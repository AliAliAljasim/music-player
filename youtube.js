"use strict";
// YouTube sign-in, library import and playback for b·side.
// Google Identity Services issues a youtube.readonly token, the YouTube
// Data API v3 supplies playlists, and the IFrame Player API plays them.
window.BSideYouTube = (() => {
  const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';
  const API = 'https://www.googleapis.com/youtube/v3/';
  const TOKEN_KEY = 'bside.ytToken';
  const MUSIC_CATEGORY = '10';
  const clientId = ((window.BSIDE_CONFIG || {}).googleClientId || '').trim();

  let token = null;
  try {
    const t = JSON.parse(localStorage.getItem(TOKEN_KEY));
    if (t && t.exp > Date.now() + 60000) token = t;
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
  if (clientId) loadScript('https://accounts.google.com/gsi/client').catch(() => {});

  function saveToken(t) {
    token = t;
    try {
      if (t) localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) { /* ignore */ }
  }

  function signIn() {
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
    if (token && window.google && google.accounts) google.accounts.oauth2.revoke(token.value, () => {});
    saveToken(null);
    stopAll();
  }

  async function api(path, params) {
    if (!token) throw new Error('Not signed in to YouTube.');
    const r = await fetch(API + path + '?' + new URLSearchParams(params), {
      headers: { Authorization: 'Bearer ' + token.value }
    });
    if (r.status === 401) {
      saveToken(null);
      throw new Error('Your YouTube session expired. Connect again.');
    }
    const j = await r.json();
    if (!r.ok) throw new Error((j.error && j.error.message) || 'YouTube API error ' + r.status);
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

  async function playlistTracks(id, keep = isMusic) {
    const items = await api('playlistItems', { part: 'contentDetails', playlistId: id, maxResults: 50 });
    const ids = items.items.map((i) => i.contentDetails.videoId);
    if (!ids.length) return [];
    // Deleted, private and filtered-out videos drop out here; keep the playlist's order.
    const vids = await api('videos', { ...VIDEO_PARTS, id: ids.join(','), maxResults: 50 });
    const byId = new Map(vids.items.filter(keep).map((v) => [v.id, v]));
    return ids.filter((i) => byId.has(i)).map((i) => trackFromVideo(byId.get(i)));
  }

  // YouTube Music's own "Liked music" playlist (LM) when the API exposes it;
  // otherwise liked YouTube videos, minus non-music and Shorts.
  async function likedMusic() {
    try {
      const lm = await playlistTracks('LM', (v) => !isShort(v));
      if (lm.length) return lm;
    } catch (e) {
      if (!token) throw e; // session expired, not just LM being unavailable
    }
    const liked = await api('videos', { ...VIDEO_PARTS, myRating: 'like', maxResults: 50 });
    return liked.items.filter(isMusic).map(trackFromVideo);
  }

  // The playlist's own cover, as YouTube Music shows it. A playlist whose
  // first video is gone gets YouTube's grey placeholder; treat that as none.
  function playlistCover(p) {
    const c = thumbFor(p);
    return c && !/no_thumbnail/.test(c.url) ? c : null;
  }

  // Liked music first, then the user's playlists (first 50 songs of each).
  async function library() {
    const [likedTracks, pls] = await Promise.all([
      likedMusic(),
      api('playlists', { part: 'snippet,contentDetails', mine: 'true', maxResults: 50 })
    ]);
    const lists = await Promise.all(pls.items
      .filter((p) => p.contentDetails.itemCount > 0)
      .map(async (p) => ({ id: p.id, name: p.snippet.title, tracks: await playlistTracks(p.id), cover: playlistCover(p) })));
    const out = likedTracks.length ? [{ id: 'LM', name: 'Liked music', tracks: likedTracks, cover: null }] : [];
    return out.concat(lists.filter((l) => l.tracks.length));
  }

  // ---------- playback ----------
  // The player is kept invisible (see .yt-card); YouTube's terms ask for it
  // to be visible, so hiding it is a deliberate choice for this app.
  //
  // There are two decks so a crossfade can start the next track while the
  // current one fades out. Only the active deck reports state, time and
  // errors. Each deck plays at the master volume times its own fade gain.

  const PLAYING = 1, PAUSED = 2, BUFFERING = 3, ENDED = 0;
  // A skip fades the outgoing track quickly rather than waiting out the full fade.
  const SKIP_FADE_MAX = 800;

  const decks = ['yt-player', 'yt-player-2'].map((el) => ({ el, player: null, gain: 1, ramp: null, fadeIn: 0, fadeOther: 0 }));
  let active = 0;
  let master = 100;
  let ready = false;
  let playerReady = null;
  let loadSeq = 0;
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
                onError: (e) => { if (d === deck()) onError(e.data); }
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
    configured: !!clientId,
    signedIn: () => !!token,
    signIn, signOut, profile, library, ensurePlayer,
    onEnded: (fn) => { onEnded = fn; },
    onError: (fn) => { onError = fn; },
    // Playing/paused as the player reports it, including changes made outside
    // the app (headphone buttons, keyboard media keys, Windows' media controls).
    onPlayState: (fn) => { onPlayState = fn; },
    setVolume: (v) => { master = v; decks.forEach(apply); },
    player: {
      load, crossfade, play, pause,
      seek: (s) => { if (ready) deck().player.seekTo(s, true); },
      time: () => (ready ? deck().player.getCurrentTime() || 0 : 0),
      duration: () => (ready ? deck().player.getDuration() || 0 : 0)
    }
  };
})();
