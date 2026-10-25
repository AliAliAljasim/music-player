"use strict";
// YouTube sign-in, library import and playback for Groove.
// In the desktop app, the main process signs in and keeps the session (see
// setupAuth in main.js); in a plain browser, Google Identity Services issues
// an hour-long token. The YouTube Data API v3 supplies playlists, and the
// IFrame Player API plays them.
window.BSideYouTube = (() => {
  const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
  const API = 'https://www.googleapis.com/youtube/v3/';
  const TOKEN_KEY = 'bside.ytToken';
  const MUSIC_CATEGORY = '10';
  const clientId = ((window.BSIDE_CONFIG || {}).googleClientId || '').trim();

  const shellAuth = window.bsideShell && window.bsideShell.auth;
  const desktop = shellAuth ? shellAuth.info() : { configured: false };
  const viaApp = desktop.configured;

  let token = null; // { value, exp }
  // Desktop: whether the main process holds a session it can renew.
  let session = viaApp && desktop.saved;
  try {
    const t = JSON.parse(localStorage.getItem(TOKEN_KEY));
    if (viaApp) localStorage.removeItem(TOKEN_KEY);
    else if (t && t.exp > Date.now() + 60000) token = t;
  } catch (e) { /* storage unavailable: sign in each visit */ }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Could not load ' + src));
      document.head.appendChild(s);
    });
  }

  // Preload GIS so requestAccessToken runs inside the click (popup blockers).
  if (clientId && !viaApp) loadScript('https://accounts.google.com/gsi/client').catch(() => {});

  function saveToken(t) {
    token = t;
    if (viaApp) return; // the main process keeps the session
    try {
      if (t) localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) { /* ignore */ }
  }

  async function appCall(action) {
    const r = await shellAuth.call(action);
    if (r.error) throw new Error(r.error);
    return r;
  }

  // The access token, asking the main process for a fresh one when it's
  // (nearly) expired or YouTube turned it down (`renew`).
  async function accessToken(renew) {
    if (!viaApp || (!renew && token && token.exp > Date.now() + 60000)) return token && token.value;
    if (!session) return null;
    const { token: t } = await appCall(renew ? 'renew' : 'token');
    token = t;
    session = !!t;
    return t && t.value;
  }

  async function signIn() {
    if (viaApp) {
      token = (await appCall('signin')).token;
      session = true;
      return;
    }
    if (!clientId) return Promise.reject(new Error('Add your Google OAuth Client ID to config.js first.'));
    if (!(window.google && google.accounts && google.accounts.oauth2)) {
      return Promise.reject(new Error('Google sign-in is still loading. Try again in a moment.'));
    }
    return new Promise((resolve, reject) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPE,
        callback: (r) => {
          if (r.error) return reject(new Error(r.error_description || r.error));
          saveToken({ value: r.access_token, exp: Date.now() + Number(r.expires_in) * 1000 });
          resolve();
        },
        error_callback: (e) => reject(new Error(e.type === 'popup_closed' ? 'Sign-in was cancelled.' : (e.message || e.type)))
      });
      client.requestAccessToken();
    });
  }

  function signOut() {
    if (viaApp) {
      appCall('signout').catch(() => {});
      token = null;
      session = false;
    } else if (token && window.google && google.accounts) google.accounts.oauth2.revoke(token.value, () => {});
    saveToken(null);
    stopAll();
  }

  // GET, or POST when there's a body; `method` overrides (POST without a body, DELETE).
  async function api(path, params, body, method) {
    let value = await accessToken(false);
    if (!value) throw new Error('Not signed in to YouTube.');
    const send = (v) => fetch(API + path + '?' + new URLSearchParams(params), {
      method: method || (body ? 'POST' : 'GET'),
      headers: { Authorization: 'Bearer ' + v, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
    let r = await send(value);
    if (r.status === 401 && viaApp && (value = await accessToken(true))) r = await send(value);
    if (r.status === 401) {
      saveToken(null);
      session = false;
      throw new Error('Your YouTube session expired. Connect again.');
    }
    const text = await r.text(); // rating and deleting answer with no content
    const j = text ? JSON.parse(text) : {};
    if (!r.ok) {
      const msg = (j.error && j.error.message) || 'YouTube API error ' + r.status;
      // A session from before Groove could change playlists (read-only).
      if (r.status === 403 && /insufficient.*scope/i.test(msg)) throw new Error('Connect YouTube Music again to let Groove change your playlists.');
      throw new Error(msg);
    }
    return j;
  }

  function parseDuration(iso) {
    const m = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || '');
    if (!m) return 0;
    return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
  }

  // Asking for an embed size makes the API report the video's aspect ratio
  // (player.embedWidth/embedHeight); Shorts are the vertical ones.
  const VIDEO_PARTS = { part: 'snippet,contentDetails,player', maxHeight: 100 };

  function isShort(v) {
    const w = Number(v.player && v.player.embedWidth), h = Number(v.player && v.player.embedHeight);
    return w > 0 && h > 0 && w < h;
  }

  function isMusic(v) { return v.snippet.categoryId === MUSIC_CATEGORY && !isShort(v); }

  // Square-cropped cover from the video's thumbnails. standard/high are 4:3
  // frames with the 16:9 picture letterboxed inside, so zoom past the bars.
  function thumbFor(v) {
    const t = v.snippet.thumbnails || {};
    if (t.maxres) return { url: t.maxres.url, size: 'cover' };
    const boxed = t.standard || t.high;
    if (boxed) return { url: boxed.url, size: 'auto 134%' };
    return t.medium ? { url: t.medium.url, size: 'cover' } : null;
  }

  // Same shape as the sample DATA tracks, plus the video id and thumbnail.
  function trackFromVideo(v) {
    return [v.snippet.title, v.snippet.channelTitle.replace(/ - Topic$/, ''), parseDuration(v.contentDetails.duration) || 1, v.id, thumbFor(v)];
  }

  async function profile() {
    const j = await api('channels', { part: 'snippet', mine: 'true' });
    const ch = j.items && j.items[0];
    if (!ch) return { name: 'YouTube account', avatar: '' };
    const th = ch.snippet.thumbnails || {};
    return { name: ch.snippet.title, avatar: (th.default || th.medium || {}).url || '' };
  }

  // Every page of a list endpoint (50 items a page). The cap only guards
  // against a runaway loop; it's far above any real library.
  const MAX_PAGES = 200;
  async function allItems(path, params) {
    const out = [];
    let pageToken = '';
    for (let page = 0; page < MAX_PAGES; page++) {
      const j = await api(path, { ...params, maxResults: 50, ...(pageToken ? { pageToken } : {}) });
      out.push(...(j.items || []));
      pageToken = j.nextPageToken;
      if (!pageToken) break;
    }
    return out;
  }

  // Video details for any number of ids, 50 per request, in parallel.
  async function videoDetails(ids) {
    const chunks = [];
    for (let i = 0; i < ids.length; i += 50) chunks.push(ids.slice(i, i + 50));
    const pages = await Promise.all(chunks.map((c) => api('videos', { ...VIDEO_PARTS, id: c.join(','), maxResults: 50 })));
    return pages.flatMap((j) => j.items || []);
  }

  // Each track also carries its playlist item id (t[5]), which removing it needs.
  async function playlistTracks(id, keep = isMusic) {
    const items = await allItems('playlistItems', { part: 'contentDetails', playlistId: id });
    if (!items.length) return [];
    // Deleted, private and filtered-out videos drop out here; keep the playlist's order.
    const byId = new Map((await videoDetails(items.map((i) => i.contentDetails.videoId))).filter(keep).map((v) => [v.id, v]));
    return items.filter((i) => byId.has(i.contentDetails.videoId)).map((i) => [...trackFromVideo(byId.get(i.contentDetails.videoId)), i.id]);
  }

  // YouTube Music's own "Liked music" playlist (LM) when the API exposes it;
  // otherwise liked YouTube videos, minus non-music and Shorts.
  async function likedMusic() {
    try {
      const lm = await playlistTracks('LM', (v) => !isShort(v));
      if (lm.length) return lm;
    } catch (e) {
      if (!signedIn()) throw e; // session expired, not just LM being unavailable
    }
    const liked = await allItems('videos', { ...VIDEO_PARTS, myRating: 'like' });
    return liked.filter(isMusic).map(trackFromVideo);
  }

  // The playlist's own cover, as YouTube Music shows it. A playlist whose
  // first video is gone gets YouTube's grey placeholder; treat that as none.
  function playlistCover(p) {
    const c = thumbFor(p);
    return c && !/no_thumbnail/.test(c.url) ? c : null;
  }

  // Liked music first, then all of the user's playlists, every song.
  async function library() {
    const [likedTracks, pls] = await Promise.all([
      likedMusic(),
      allItems('playlists', { part: 'snippet,contentDetails', mine: 'true' })
    ]);
    const lists = await Promise.all(pls
      .filter((p) => p.contentDetails.itemCount > 0)
      .map(async (p) => ({ id: p.id, name: p.snippet.title, tracks: await playlistTracks(p.id), cover: playlistCover(p) })));
    const out = likedTracks.length ? [{ id: 'LM', name: 'Liked music', tracks: likedTracks, cover: null }] : [];
    return out.concat(lists.filter((l) => l.tracks.length));
  }

  // Music videos matching a query, as tracks. A search costs 100 of the
  // API's 10,000 daily quota units, so the app only searches YouTube on Enter.
  async function search(q) {
    const j = await api('search', { part: 'id', type: 'video', videoCategoryId: MUSIC_CATEGORY, q, maxResults: 25 });
    const ids = (j.items || []).map((i) => i.id.videoId).filter(Boolean);
    if (!ids.length) return [];
    const byId = new Map((await videoDetails(ids)).filter((v) => !isShort(v)).map((v) => [v.id, v]));
    return ids.filter((i) => byId.has(i)).map((i) => trackFromVideo(byId.get(i)));
  }

  // Each insert, delete or rating costs 50 of the daily quota units.
  // Returns the new playlist item's id.
  async function addToPlaylist(playlistId, videoId) {
    const j = await api('playlistItems', { part: 'snippet' }, { snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId } } });
    return j.id || '';
  }

  // Without the item id (not known yet), the video's first entry in the playlist.
  async function removeFromPlaylist(playlistId, videoId, itemId) {
    if (!itemId) {
      const j = await api('playlistItems', { part: 'id', playlistId, videoId, maxResults: 1 });
      itemId = j.items && j.items[0] && j.items[0].id;
      if (!itemId) return; // already gone
    }
    await api('playlistItems', { id: itemId }, null, 'DELETE');
  }

  // Like (adds it to Liked music) or clear the rating.
  async function rate(videoId, liked) {
    await api('videos/rate', { id: videoId, rating: liked ? 'like' : 'none' }, null, 'POST');
  }

  async function createPlaylist(title) {
    const p = await api('playlists', { part: 'snippet,status' }, { snippet: { title }, status: { privacyStatus: 'private' } });
    return { id: p.id, name: p.snippet.title };
  }

  function signedIn() { return viaApp ? session : !!token; }

  // ---------- playback ----------
  // The player is kept invisible (see .yt-card); YouTube's terms ask for it
  // to be visible, so hiding it is a deliberate choice for this app.
  //
  // There are two decks so a crossfade can start the next track while the
  // current one fades out. Only the active deck reports state, time and
  // errors. Each deck plays at the master volume times its own fade gain.

  const PLAYING = 1, PAUSED = 2, BUFFERING = 3, ENDED = 0, CUED = 5;
  // A skip fades the outgoing track quickly rather than waiting out the full fade.
  const SKIP_FADE_MAX = 800;

  const decks = ['yt-player', 'yt-player-2'].map((el) => ({ el, player: null, gain: 1, ramp: null, fadeIn: 0, fadeOther: 0 }));
  let active = 0;
  let master = 100;
  let ready = false;
  let playerReady = null;
  let loadSeq = 0;
  // While a new track loads (fading the old one out, then buffering), the
  // player still reports the old track's time; report the new start instead.
  let pendingStart = null;
  let onEnded = () => {};
  let onError = () => {};
  let onPlayState = () => {};

  const deck = () => decks[active];
  const other = () => decks[1 - active];

  function apply(d) {
    if (d.player && d.player.setVolume) d.player.setVolume(Math.round(master * d.gain));
  }

  function audible(d) {
    const s = d.player && d.player.getPlayerState ? d.player.getPlayerState() : -1;
    return (s === PLAYING || s === BUFFERING) && d.gain > 0;
  }

  // Move a deck's gain to `to` over `ms`. Resolves true on arrival, false if
  // another ramp on the same deck replaced it first.
  function ramp(d, to, ms) {
    if (d.ramp) d.ramp.cancel();
    return new Promise((resolve) => {
      const from = d.gain;
      if (!ms || from === to) { d.gain = to; apply(d); resolve(true); return; }
      const t0 = performance.now();
      const id = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        d.gain = from + (to - from) * k;
        apply(d);
        if (k === 1) { clearInterval(id); d.ramp = null; resolve(true); }
      }, 40);
      d.ramp = { cancel: () => { clearInterval(id); d.ramp = null; resolve(false); } };
    });
  }

  // Only ever called on the inactive deck.
  function fadeOutAndStop(d, ms) {
    d.fadeIn = 0;
    d.fadeOther = 0;
    if (!audible(d)) {
      if (d.ramp) d.ramp.cancel();
      if (d.player && d.player.stopVideo) d.player.stopVideo();
      return;
    }
    ramp(d, 0, ms).then((done) => { if (done && d !== deck()) d.player.stopVideo(); });
  }

  function stateChange(d, s) {
    if (d !== deck()) return;
    if (s === PLAYING || s === CUED) pendingStart = null;
    if (s === PLAYING) {
      if (d.fadeIn) { ramp(d, 1, d.fadeIn); d.fadeIn = 0; }
      if (d.fadeOther) { fadeOutAndStop(other(), d.fadeOther); d.fadeOther = 0; }
      onPlayState(true);
    } else if (s === PAUSED) {
      onPlayState(false);
    } else if (s === ENDED) {
      onEnded();
    }
  }

  function ensurePlayer() {
    if (!playerReady) {
      playerReady = new Promise((resolve, reject) => {
        window.onYouTubeIframeAPIReady = () => {
          let n = 0;
          decks.forEach((d) => {
            d.player = new YT.Player(d.el, {
              width: 200, height: 200,
              playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
              events: {
                onReady: () => { apply(d); if (++n === decks.length) { ready = true; resolve(); } },
                onStateChange: (e) => stateChange(d, e.data),
                onError: (e) => { if (d === deck()) { pendingStart = null; onError(e.data); } }
              }
            });
          });
        };
        loadScript('https://www.youtube.com/iframe_api').catch(reject);
      });
    }
    return playerReady;
  }

  async function load(videoId, start, autoplay, fadeMs) {
    await ensurePlayer();
    const seq = ++loadSeq;
    pendingStart = start || 0;
    const d = deck();
    const quick = Math.min(fadeMs, SKIP_FADE_MAX);
    fadeOutAndStop(other(), quick);
    if (fadeMs && audible(d)) await ramp(d, 0, quick);
    if (seq !== loadSeq) return; // skipped again while fading
    if (d.ramp) d.ramp.cancel();
    d.fadeOther = 0;
    d.fadeIn = autoplay ? fadeMs : 0;
    d.gain = d.fadeIn ? 0 : 1;
    apply(d);
    const opts = { videoId, startSeconds: start || 0 };
    if (autoplay) d.player.loadVideoById(opts); else d.player.cueVideoById(opts);
  }

  // Start videoId on the idle deck and blend over `ms` once it is playing.
  async function crossfade(videoId, ms) {
    await ensurePlayer();
    ++loadSeq;
    pendingStart = 0;
    active = 1 - active;
    const d = deck();
    if (d.ramp) d.ramp.cancel();
    d.gain = 0;
    apply(d);
    d.fadeIn = ms;
    d.fadeOther = ms;
    d.player.loadVideoById({ videoId, startSeconds: 0 });
  }

  function play(fadeMs) {
    const d = deck();
    if (!ready) return;
    const s = d.player.getPlayerState();
    if (s === PLAYING || s === BUFFERING) { ramp(d, 1, fadeMs); return; }
    if (d.ramp) d.ramp.cancel();
    d.fadeIn = fadeMs;
    d.gain = fadeMs ? 0 : 1;
    apply(d);
    d.player.playVideo();
  }

  // Resolves true once paused, false if playback resumed during the fade.
  async function pause(fadeMs) {
    const d = deck();
    if (!ready) return true;
    fadeOutAndStop(other(), fadeMs);
    d.fadeIn = 0;
    if (!audible(d)) { d.player.pauseVideo(); return true; }
    const done = await ramp(d, 0, fadeMs);
    if (done) d.player.pauseVideo();
    return done;
  }

  function stopAll() {
    decks.forEach((d) => {
      if (d.ramp) d.ramp.cancel();
      if (d.player && d.player.stopVideo) d.player.stopVideo();
    });
  }

  return {
    configured: viaApp || !!clientId,
    // Desktop sign-in finishes in the system browser rather than a popup.
    signInInBrowser: viaApp,
    signedIn, signIn, signOut, profile, library, search, addToPlaylist, removeFromPlaylist, rate, createPlaylist, ensurePlayer,
    onEnded: (fn) => { onEnded = fn; },
    onError: (fn) => { onError = fn; },
    // Playing/paused as the player reports it, including changes made outside
    // the app (headphone buttons, keyboard media keys, Windows' media controls).
    onPlayState: (fn) => { onPlayState = fn; },
    setVolume: (v) => { master = v; decks.forEach(apply); },
    player: {
      load, crossfade, play, pause,
      seek: (s) => { if (ready) deck().player.seekTo(s, true); },
      time: () => (pendingStart != null ? pendingStart : ready ? deck().player.getCurrentTime() || 0 : 0),
      duration: () => (pendingStart == null && ready ? deck().player.getDuration() || 0 : 0)
    }
  };
})();
