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
    if (player) player.stopVideo();
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

  // Liked music first, then the user's playlists (first 50 songs of each).
  async function library() {
    const [likedTracks, pls] = await Promise.all([
      likedMusic(),
      api('playlists', { part: 'snippet,contentDetails', mine: 'true', maxResults: 50 })
    ]);
    const lists = await Promise.all(pls.items
      .filter((p) => p.contentDetails.itemCount > 0)
      .map(async (p) => ({ name: p.snippet.title, tracks: await playlistTracks(p.id) })));
    const out = likedTracks.length ? [{ name: 'Liked music', tracks: likedTracks }] : [];
    return out.concat(lists.filter((l) => l.tracks.length));
  }

  // ---------- playback ----------
  // The player is kept invisible (see .yt-card); YouTube's terms ask for it
  // to be visible, so hiding it is a deliberate choice for this app.

  let player = null;
  let playerReady = null;
  let onEnded = () => {};

  function ensurePlayer() {
    if (!playerReady) {
      playerReady = new Promise((resolve, reject) => {
        window.onYouTubeIframeAPIReady = () => {
          player = new YT.Player('yt-player', {
            width: 200, height: 200,
            playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
            events: {
              onReady: () => resolve(player),
              onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) onEnded(); }
            }
          });
        };
        loadScript('https://www.youtube.com/iframe_api').catch(reject);
      });
    }
    return playerReady;
  }

  async function load(videoId, start, autoplay) {
    const p = await ensurePlayer();
    const opts = { videoId, startSeconds: start || 0 };
    if (autoplay) p.loadVideoById(opts); else p.cueVideoById(opts);
  }

  return {
    configured: !!clientId,
    signedIn: () => !!token,
    signIn, signOut, profile, library, ensurePlayer,
    onEnded: (fn) => { onEnded = fn; },
    player: {
      load,
      play: () => player && player.playVideo(),
      pause: () => player && player.pauseVideo(),
      seek: (s) => player && player.seekTo(s, true),
      time: () => (player && player.getCurrentTime ? player.getCurrentTime() || 0 : 0)
    }
  };
})();
