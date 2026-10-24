"use strict";
(() => {
  const ACCENT = '#E0A458';
  const SHOW_BACKDROP_PREF = true;

  const GROOVES = 'repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,.16) 0 1px, rgba(0,0,0,0) 1px 3px)';
  const SHEEN = 'conic-gradient(from 20deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,.16) 30deg, rgba(255,255,255,0) 60deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,.12) 210deg, rgba(255,255,255,0) 240deg)';
  const RINGS = 'radial-gradient(circle closest-side, rgba(0,0,0,0) 0 34%, rgba(0,0,0,.22) 34% 40%, rgba(0,0,0,0) 40% 55%, rgba(255,255,255,.08) 55% 55.5%, rgba(0,0,0,0) 55.5% 68%, rgba(255,255,255,.08) 68% 68.5%, rgba(0,0,0,0) 68.5% 81%, rgba(255,255,255,.08) 81% 81.5%, rgba(0,0,0,0) 81.5% 96.5%, rgba(255,255,255,.06) 96.5% 100%)';

  const PALETTES = [
    ['#E2462F', '#F2B33D', '#1E2A78', '#F6EEDC'], ['#2B4C7E', '#F28F3B', '#16233D', '#F4E9D8'],
    ['#4C8C6B', '#F2D16B', '#1F3A2E', '#F3EEE2'], ['#6B3FA0', '#FF8FAB', '#1B1035', '#F6E9F0'],
    ['#E8A33D', '#C2410C', '#3B2A1A', '#FFF4DC'], ['#1F6F8B', '#99E1D9', '#0B2E3A', '#EAF7F5'],
    ['#B23A48', '#FCB9B2', '#461220', '#FFF0EE'], ['#2E2E2E', '#E9D758', '#F25F5C', '#F5F5F0']
  ];

  const VINYLS = [
    { name: 'Midnight Black', style: 'solid', c: ['#141414'] },
    { name: 'Oxblood', style: 'clear', c: ['#6E1423'] },
    { name: 'Cherry Splatter', style: 'splatter', c: ['#C1121F', '#F6EEDC', '#141414'] },
    { name: 'Tangerine Haze', style: 'smoke', c: ['#F28C28', '#FFD29A'] },
    { name: 'Mustard Marble', style: 'marble', c: ['#E3B23C', '#FFF4DC', '#9C6B12'] },
    { name: 'Lemonade', style: 'splatter', c: ['#F4E04D', '#FFFFFF', '#F28C28'] },
    { name: 'Seafoam Swirl', style: 'swirl', c: ['#7BD3C1', '#EAF7F5'] },
    { name: 'Forest Smoke', style: 'smoke', c: ['#2D6A4F', '#0B1F16'] },
    { name: 'Lime Splatter', style: 'opaque-splatter', c: ['#A7C957', '#141414', '#F6EEDC'] },
    { name: 'Ocean Split', style: 'half', c: ['#1D4E89', '#5FA8D3'] },
    { name: 'Cobalt Galaxy', style: 'galaxy', c: ['#1B2A6B', '#FFFFFF', '#99E1D9'] },
    { name: 'Sky Clear', style: 'clear', c: ['#9AD1F5'] },
    { name: 'Lilac Marble', style: 'marble', c: ['#B79CED', '#F6E9F0', '#6B3FA0'] },
    { name: 'Ultraviolet', style: 'splatter', c: ['#5A189A', '#FF8FAB', '#F6E9F0'] },
    { name: 'Bubblegum Eye', style: 'inner', c: ['#FF8FAB', '#FFF0EE'] },
    { name: 'Coke Bottle', style: 'clear', c: ['#BFD8C6'] },
    { name: 'Bone Splatter', style: 'opaque-splatter', c: ['#EFE6D2', '#141414', '#B23A48'] },
    { name: 'Rust Pinwheel', style: 'pinwheel', c: ['#B5562D', '#F4E9D8'] },
    { name: 'Grey Smoke', style: 'smoke', c: ['#8D99AE', '#2E2E2E'] },
    { name: 'Gold Rush', style: 'metallic', c: ['#C9A227', '#FFF1B8', '#7A5C10'] }
  ];

  const SPOTS = [[28,22,2.4,1],[64,16,1.5,2],[80,40,3,1],[17,60,2,2],[40,82,2.6,1],[73,76,1.8,1],[88,62,1.3,2],[12,36,1.4,1],[55,8,1.2,1],[22,78,1.1,2],[60,90,1.6,2],[91,28,1.1,1],[33,10,0.9,2],[8,50,1,1],[84,85,1.2,1],[47,94,0.9,1]];

  const DATA = [
    { name: 'Liked music', color: '#D9A441', tracks: [['Paper Lanterns', 'Marlow Ives', 214], ['Slow Static', 'Halden', 248], ['Coastline FM', 'The Quiet Hours', 197], ['Glass Orchard', 'Juno Vale', 231], ['Second Light', 'Oren & the Fields', 263], ['Night Bus', 'Kiko Marsh', 182], ['Low Tide Radio', 'Halden', 225], ['Velvet Margin', 'Ana Sorel', 241]] },
    { name: 'Late night', color: '#4F7FA0', tracks: [['Neon Rain', 'Sable Drive', 256], ['3 A.M. Kitchen', 'Marlow Ives', 203], ['Afterglow', 'Juno Vale', 238], ['Empty Platform', 'The Quiet Hours', 271], ['Moth', 'Ana Sorel', 189], ['Streetlight Hymn', 'Kiko Marsh', 244]] },
    { name: 'Sunday morning', color: '#9AAA6A', tracks: [['Linen', 'Oren & the Fields', 199], ['Toast & Honey', 'Juno Vale', 176], ['Open Window', 'Halden', 228], ['Green Room', 'Ana Sorel', 214], ['Slow Walk Home', 'Marlow Ives', 252]] },
    { name: 'Focus', color: '#C8553D', tracks: [['Grid', 'Sable Drive', 312], ['Quiet Engine', 'The Quiet Hours', 287], ['Margins', 'Halden', 265], ['Ink', 'Kiko Marsh', 241], ['Long Division', 'Sable Drive', 298], ['White Space', 'Ana Sorel', 276], ['Tessellate', 'Halden', 254]] },
    { name: 'Road trip', color: '#8A6BA0', tracks: [['Mile Marker', 'Oren & the Fields', 221], ['Rearview', 'Marlow Ives', 207], ['Desert Wire', 'Sable Drive', 239], ['Gas Station Sunrise', 'Kiko Marsh', 218], ['Hundred Miles of Static', 'The Quiet Hours', 266], ['Windows Down', 'Juno Vale', 194]] },
    { name: 'Rainy days', color: '#4E9484', tracks: [['Grey Sweater', 'Ana Sorel', 233], ['Puddles', 'Juno Vale', 185], ['Fogged', 'Halden', 247], ['Umbrella Song', 'Oren & the Fields', 212], ['Tin Roof', 'Kiko Marsh', 229]] },
    { name: 'Throwbacks', color: '#B9774A', tracks: [['Cassette Summer', 'Marlow Ives', 219], ['Mixtape No. 4', 'Sable Drive', 236], ['Rewind', 'The Quiet Hours', 201], ['Old Phone Number', 'Juno Vale', 224], ['Polaroid', 'Ana Sorel', 208], ['Arcade Lights', 'Kiko Marsh', 243]] },
    { name: 'Wind down', color: '#7D8AA6', tracks: [['Lamp Off', 'Halden', 281], ['Breathing Room', 'Ana Sorel', 258], ['Soft Focus', 'Oren & the Fields', 236], ['Goodnight, Harbour', 'The Quiet Hours', 302]] }
  ];

  // ---------- state ----------
  // Player.dc.html imports Main with start-view="player": land on the turntable.
  const state = {
    view: 'player', openId: 1, plId: 1, idx: 2, pos: 0,
    playing: false, pick: null, rpm: 33, zoom: 1,
    account: null, syncing: false, ytError: ''
  };

  const yt = window.BSideYouTube;
  const SAMPLE = DATA.slice();
  const PL_COLORS = DATA.map((p) => p.color);

  function setState(patch) {
    Object.assign(state, patch);
    render();
  }

  // ---------- helpers (ported from the design's Component class) ----------

  function fmt(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function step(d) {
    const n = DATA[state.plId].tracks.length;
    setState({ idx: (state.idx + d + n) % n, pos: 0, pick: null });
    ytSync();
  }

  function play(plId, idx) {
    setState({ plId, idx, pos: 0, playing: true, view: 'player', pick: null });
    ytSync();
  }

  // ---------- YouTube ----------
  // Tracks from YouTube carry a video id (t[3]); mirror state onto the player.
  // Sample tracks have none, so the simulated clock keeps driving them.

  let ytLoaded = null;

  function ytSync(seekTo) {
    const t = DATA[state.plId].tracks[state.idx];
    if (!t[3]) return;
    if (ytLoaded !== t[3]) {
      ytLoaded = t[3];
      yt.player.load(t[3], state.pos, state.playing);
      render();
      return;
    }
    if (seekTo != null) yt.player.seek(seekTo);
    if (state.playing) yt.player.play(); else yt.player.pause();
  }

  function useLibrary(lists) {
    DATA.splice(0, DATA.length, ...lists.map((p, i) => ({ name: p.name, color: PL_COLORS[i % PL_COLORS.length], tracks: p.tracks })));
    ytLoaded = null;
    setState({ openId: 0, plId: 0, idx: 0, pos: 0, playing: false, pick: null });
  }

  async function syncYouTube() {
    setState({ syncing: true, ytError: '' });
    try {
      const [account, lists] = await Promise.all([yt.profile(), yt.library()]);
      yt.ensurePlayer();
      if (lists.length) useLibrary(lists);
      setState({ account, syncing: false, view: 'home', ytError: lists.length ? '' : 'No playlists or liked music found on this account.' });
    } catch (e) {
      setState({ syncing: false, account: yt.signedIn() ? state.account : null, ytError: e.message });
    }
  }

  async function connectYouTube() {
    setState({ ytError: '' });
    try {
      await yt.signIn();
    } catch (e) {
      setState({ ytError: e.message });
      return;
    }
    syncYouTube();
  }

  function disconnectYouTube() {
    if (!window.confirm('Sign out of YouTube Music?')) return;
    yt.signOut();
    useLibrary(SAMPLE);
    setState({ account: null, ytError: '' });
  }

  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function dist(a, b) {
    const p = rgb(a), q = rgb(b);
    const rm = (p[0] + q[0]) / 2, dr = p[0] - q[0], dg = p[1] - q[1], db = p[2] - q[2];
    return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
  }

  function closestVinyl(hex) {
    let best = VINYLS[0], bd = Infinity;
    VINYLS.forEach((v) => { const d = dist(hex, v.c[0]); if (d < bd) { bd = d; best = v; } });
    return best;
  }

  function dots(cols, scale) {
    return SPOTS.map((s, i) => {
      const r = s[2] * scale;
      return 'radial-gradient(circle at ' + s[0] + '% ' + s[1] + '%, ' + cols[i % cols.length] + ' 0 ' + r + '%, rgba(0,0,0,0) ' + (r + 0.5) + '%)';
    }).join(', ');
  }

  function vinylBody(v) {
    const a = v.c[0], b = v.c[1] || a, c = v.c[2] || b;
    const clear = (x) => 'radial-gradient(circle at 50% 50%, ' + x + 'E0 0 62%, ' + x + 'B8 62% 100%)';
    const blob = (x, w, h, px, py, al) => 'radial-gradient(ellipse ' + w + '% ' + h + '% at ' + px + '% ' + py + '%, ' + x + (al || '') + ' 0%, ' + x + '00 100%)';
    const flat = (x) => 'linear-gradient(' + x + ', ' + x + ')';
    let body;
    switch (v.style) {
      case 'solid': body = flat(a); break;
      case 'clear': body = clear(a); break;
      case 'splatter': body = dots([b, c], 1) + ', ' + clear(a); break;
      case 'opaque-splatter': body = dots([b, c], 1) + ', ' + flat(a); break;
      case 'galaxy': body = dots([b, c], 0.45) + ', ' + flat(a); break;
      case 'marble': body = [blob(b, 45, 22, 30, 28), blob(b, 30, 40, 74, 62), blob(c, 35, 18, 40, 80), blob(b, 22, 30, 82, 22), blob(c, 20, 20, 18, 60)].join(', ') + ', ' + flat(a); break;
      case 'smoke': body = [blob(b, 55, 35, 28, 30, 'CC'), blob(b, 40, 50, 72, 66, 'AA'), blob(b, 45, 30, 50, 88, '88')].join(', ') + ', ' + clear(a); break;
      case 'half': body = 'linear-gradient(90deg, ' + a + ' 0 50%, ' + b + ' 50% 100%)'; break;
      case 'inner': body = 'radial-gradient(circle at 50% 50%, ' + b + ' 0 46%, ' + a + ' 46.5% 100%)'; break;
      case 'swirl': body = 'repeating-conic-gradient(from 0deg, ' + a + ' 0deg, ' + b + ' 30deg, ' + a + ' 60deg)'; break;
      case 'pinwheel': body = 'repeating-conic-gradient(' + a + ' 0 22.5deg, ' + b + ' 22.5deg 45deg)'; break;
      case 'metallic': body = 'conic-gradient(from 30deg, ' + a + ', ' + b + ', ' + a + ', ' + c + ', ' + a + ', ' + b + ', ' + a + ')'; break;
      default: body = clear(a);
    }
    return body;
  }

  function vinylBg(v) { return SHEEN + ', ' + GROOVES + ', ' + vinylBody(v); }
  function vinylDisc(v) { return RINGS + ', ' + GROOVES + ', ' + vinylBody(v); }

  // ---------- thumbnail colours ----------
  // Sample the visible (square-cropped) part of a YouTube thumbnail and take
  // its dominant colour, so the auto-matched pressing follows the real cover.

  const thumbColors = new Map(); // url -> { main, second } | 'pending' | null

  function hex(c) { return '#' + c.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase(); }
  function mix(a, b, t) { const p = rgb(a), q = rgb(b); return hex(p.map((x, i) => x + (q[i] - x) * t)); }

  function dominant(img, boxed) {
    const N = 32;
    const side = Math.min(img.naturalWidth, img.naturalHeight) / (boxed ? 1.34 : 1);
    const cv = document.createElement('canvas');
    cv.width = cv.height = N;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, N, N);
    const px = ctx.getImageData(0, 0, N, N).data;
    // Bucket at 4 bits per channel; favour saturated, mid-bright pixels so
    // black bars and white backgrounds don't win.
    const buckets = new Map();
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx ? (mx - mn) / mx : 0;
      const w = (0.15 + sat) * (mx < 28 || mn > 235 ? 0.2 : 1);
      const k = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);
      const e = buckets.get(k) || { w: 0, r: 0, g: 0, b: 0 };
      e.w += w; e.r += r * w; e.g += g * w; e.b += b * w;
      buckets.set(k, e);
    }
    const ranked = [...buckets.values()].sort((x, y) => y.w - x.w).map((e) => hex([e.r / e.w, e.g / e.w, e.b / e.w]));
    if (!ranked.length) return null;
    const main = ranked[0];
    const second = ranked.find((c) => dist(c, main) > 150) || mix(main, '#FFFFFF', 0.5);
    return { main, second };
  }

  function thumbColor(thumb) {
    const hit = thumbColors.get(thumb.url);
    if (hit !== undefined) return hit === 'pending' ? null : hit;
    thumbColors.set(thumb.url, 'pending');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let c = null;
      try { c = dominant(img, thumb.size !== 'cover'); } catch (e) { /* tainted canvas: keep palette */ }
      thumbColors.set(thumb.url, c);
      if (c) render();
    };
    img.onerror = () => thumbColors.set(thumb.url, null);
    img.src = thumb.url;
    return null;
  }

  function artFor(plId, idx, pick) {
    // YouTube tracks use their thumbnail as the cover (and its colours, once
    // sampled); samples get generated art from the fixed palettes.
    const thumb = (DATA[plId].tracks[idx] || [])[4];
    const tc = thumb && thumbColor(thumb);
    const [c1, c2, c3, c4] = tc
      ? [tc.main, tc.second, mix(tc.main, '#000000', 0.7), mix(tc.main, '#FFFFFF', 0.85)]
      : PALETTES[(plId * 3 + idx) % PALETTES.length];
    const coverBg = thumb
      ? 'url(' + JSON.stringify(thumb.url) + ') center / ' + thumb.size + ' no-repeat, ' + c3
      : 'radial-gradient(circle at 70% 52%, ' + c2 + ' 0 25%, rgba(0,0,0,0) 25.4%), linear-gradient(162deg, ' + c1 + ' 0 60%, ' + c3 + ' 60% 100%)';
    const vinyl = pick != null ? VINYLS[pick] : closestVinyl(c1);
    return { c1, c2, c3, c4, coverBg, hasThumb: !!thumb, vinylBg: vinylBg(vinyl), vinylDisc: vinylDisc(vinyl), vinylName: vinyl.name };
  }

  // ---------- derived view-model ----------

  function computeVals() {
    const s = state;
    const accent = ACCENT;
    const backdrop = SHOW_BACKDROP_PREF;
    const total = (pl) => pl.tracks.reduce((a, t) => a + t[2], 0);

    const playlists = DATA.map((p, i) => ({
      idx: i, name: p.name, color: p.color,
      countLabel: p.tracks.length + (p.tracks.length === 1 ? ' song' : ' songs'), lengthLabel: Math.round(total(p) / 60) + ' min'
    }));

    const openTracks = DATA[s.openId].tracks.map((t, i) => {
      const isNow = s.openId === s.plId && i === s.idx;
      return {
        idx: i, num: i + 1, title: t[0], artist: t[1], time: fmt(t[2]),
        color: isNow ? accent : '#EEE8DF', numColor: isNow ? accent : '#8F887E',
        bg: isNow ? 'rgba(255,255,255,.03)' : '',
        showNow: isNow
      };
    });

    const tr = DATA[s.plId].tracks;
    const cur = tr[s.idx];
    const art = artFor(s.plId, s.idx, s.pick);
    const auto = closestVinyl(art.c1);

    const upNext = [1, 2].map((k) => {
      const j = (s.idx + k) % tr.length;
      return { idx: j, title: tr[j][0], artist: tr[j][1], time: fmt(tr[j][2]), cover: artFor(s.plId, j).coverBg };
    });

    const views = [['Library', 'home'], ['Crate', 'crate'], ['Turntable', 'player']];
    const navActive = s.view === 'list' ? 'home' : s.view;

    return {
      accent, playlists, openTracks, upNext, art,
      openPl: playlists[s.openId], nowPl: playlists[s.plId],
      nav: views.map(([label, v]) => ({
        label, view: v,
        active: navActive === v,
        color: navActive === v ? '#F6F1EA' : (s.view === 'player' ? 'rgba(255,255,255,.75)' : '#A39C92')
      })),
      crate: VINYLS.map((v, i) => {
        const on = v.name === art.vinylName;
        return {
          idx: i, name: v.name, hex: v.c[0], style: v.style.replace('-', ' '), bg: vinylBg(v), on, scale: on ? 1.04 : 1,
          ring: on ? '0 0 0 3px #131211, 0 0 0 5px ' + accent + ', 0 14px 30px rgba(0,0,0,.5)' : '0 10px 24px rgba(0,0,0,.45)'
        };
      }),
      coverHex: art.c1,
      isPicked: s.pick != null,
      matchLabel: s.pick != null ? 'Your pick: ' + art.vinylName : 'Auto-matched: ' + art.vinylName,
      now: { title: cur[0], artist: cur[1], time: fmt(cur[2]) },
      isHome: s.view === 'home', isList: s.view === 'list', isPlayer: s.view === 'player', isCrate: s.view === 'crate',
      showBackdrop: s.view === 'player' && backdrop,
      showMini: s.view !== 'player',
      headerLine: s.view === 'player' ? 'rgba(255,255,255,.12)' : '#262320',
      playing: s.playing, paused: !s.playing,
      toggleLabel: s.playing ? 'Pause' : (s.pos > 0 ? 'Resume' : 'Play'),
      spinState: s.playing ? 'running' : 'paused',
      armAngle: (s.playing || s.pos > 0) ? (27.8 + 20.9 * Math.min(1, s.pos / cur[2])).toFixed(2) : -3,
      armShadow: s.playing ? 'drop-shadow(3px 5px 2.5px rgba(0,0,0,.45))' : 'drop-shadow(10px 18px 7px rgba(0,0,0,.3))',
      stageZoom: s.zoom,
      ledColor: s.playing ? accent : 'rgba(255,255,255,.35)', ledGlow: s.playing ? '0 0 8px ' + accent : 'none',
      spinDur: s.rpm === 45 ? '4.4s' : '6s',
      rpmLabel: s.rpm === 45 ? '45' : '33⅓',
      stateLabel: s.playing ? 'Now spinning' : (s.pos > 0 ? 'Paused' : 'Stopped'),
      stopOpacity: (s.playing || s.pos > 0) ? 1 : 0.45,
      posLabel: fmt(s.pos),
      progressPct: (s.pos / cur[2] * 100).toFixed(2) + '%'
    };
  }

  // ---------- actions ----------

  const actions = {
    goHome: () => setState({ view: 'home' }),
    openPlayer: () => setState({ view: 'player' }),
    openCrate: () => setState({ view: 'crate' }),
    closePlayer: () => setState({ view: 'list', openId: state.plId }),
    autoMatch: () => setState({ pick: null }),
    playOpen: () => play(state.openId, 0),
    toggle: () => { setState({ playing: !state.playing }); ytSync(); },
    next: () => step(1),
    prev: () => { if (state.pos > 3) { setState({ pos: 0 }); ytSync(0); } else step(-1); },
    stop: () => { setState({ playing: false, pos: 0 }); ytSync(0); },
    openPlaylist: (i) => setState({ view: 'list', openId: i }),
    playTrack: (plId, idx) => play(plId, idx),
    pickVinyl: (i, auto) => setState({ pick: VINYLS[i].name === auto.name ? null : i }),
    seekFromEvent: (e, el, duration) => {
      const r = el.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      setState({ pos: Math.floor(f * duration) });
      ytSync(state.pos);
    }
  };

  // ---------- DOM refs ----------

  const el = (id) => document.getElementById(id);
  const refs = {
    backdrop: el('backdrop'),
    topbar: el('topbar'),
    brandDot: el('brand-dot'),
    topnav: el('topnav'),
    topbarRight: el('topbar-right'),
    goHome: el('go-home'),

    heroArt: el('hero-art'), heroVinyl: el('hero-vinyl'), heroVinylLabel: el('hero-vinyl-label'),
    heroCover: el('hero-cover'), heroState: el('hero-state'), heroTitle: el('hero-title'), heroSub: el('hero-sub'),
    heroToggle: el('hero-toggle'), heroOpen: el('hero-open'),
    playlistsGrid: el('playlists-grid'),

    listBack: el('list-back'), listDiscDot: el('list-disc-dot'), listDiscCover: el('list-disc-cover'),
    listTitle: el('list-title'), listSub: el('list-sub'), listPlayAll: el('list-play-all'), listRows: el('list-rows'),

    crateNowCover: el('crate-now-cover'), crateHex: el('crate-hex'), crateMatch: el('crate-match'),
    crateAutoMatch: el('crate-auto-match'), crateGrid: el('crate-grid'),

    minibar: el('minibar'), minibarSeek: el('minibar-seek'), minibarSeekFill: el('minibar-seek-fill'),
    minibarOpen: el('minibar-open'), minibarVinyl: el('minibar-vinyl'), minibarVinylLabel: el('minibar-vinyl-label'),
    minibarCover: el('minibar-cover'), minibarTitle: el('minibar-title'), minibarArtist: el('minibar-artist'),
    minibarTime: el('minibar-time'), miniPrev: el('mini-prev'), miniToggle: el('mini-toggle'), miniNext: el('mini-next'),

    stage: el('stage'), stageInner: el('stage-inner'),
    playerCover: el('player-cover'), playerCoverTitle: el('player-cover-title'), playerCoverArtist: el('player-cover-artist'),
    playerClose: el('player-close'), ledDot: el('led-dot'), playerStateLabel: el('player-state-label'),
    playerTitle: el('player-title'), playerArtist: el('player-artist'),
    playerOpenCrate: el('player-open-crate'), pressingDot: el('pressing-dot'), pressingName: el('pressing-name'),
    upNextRows: el('up-next-rows'),

    disc: el('disc'), discLabel: el('disc-label'), discTitle: el('disc-title'), discArtist: el('disc-artist'), discRpm: el('disc-rpm'),
    tonearm: el('tonearm'), stylusStripe: el('stylus-stripe'),

    posLabel: el('pos-label'), timeLabel: el('time-label'), seekTrack: el('seek-track'),
    seekFill: el('seek-fill'), seekKnob: el('seek-knob'),
    btnStop: el('btn-stop'), btnPrev: el('btn-prev'), btnToggle: el('btn-toggle'), btnNext: el('btn-next'),

    viewHome: el('view-home'), viewList: el('view-list'), viewCrate: el('view-crate'), viewPlayer: el('view-player')
  };

  const PLAY_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#131211"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  const PAUSE_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#131211"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
  const PLAY_ICON_SM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#131211"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  const PAUSE_ICON_SM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#131211"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
  const PLAY_ICON_HERO = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#131211"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  const PAUSE_ICON_HERO = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#131211"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
  const ACCOUNT_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EEE8DF" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path></svg>';
  const PLAY_TRI_ROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#EEE8DF"><path d="M7 4.5v15l13-7.5z"></path></svg>';

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // Rebuild a list only when its content changes, so the playback tick
  // doesn't replace the buttons under the cursor mid-click.
  function rebuild(node, key, build) {
    if (node.dataset.key === key) return;
    node.dataset.key = key;
    clear(node);
    build();
  }

  // ---------- render ----------

  function render() {
    const v = computeVals();

    document.body.style.setProperty('--accent', v.accent);
    refs.brandDot.style.background = v.accent;
    refs.topbar.style.borderBottomColor = v.headerLine;

    refs.backdrop.classList.toggle('show', v.showBackdrop);
    refs.backdrop.querySelector('.blur').style.background = v.art.coverBg;

    // nav
    rebuild(refs.topnav, JSON.stringify(v.nav), () => v.nav.forEach((n) => {
      const b = document.createElement('button');
      b.textContent = n.label;
      b.style.background = n.active ? 'rgba(255,255,255,.1)' : 'transparent';
      b.style.color = n.color;
      b.addEventListener('click', () => setState({ view: n.view }));
      refs.topnav.appendChild(b);
    }));

    renderAccount();

    // view switching
    refs.viewHome.classList.toggle('active', v.isHome);
    refs.viewList.classList.toggle('active', v.isList);
    refs.viewCrate.classList.toggle('active', v.isCrate);
    refs.viewPlayer.classList.toggle('active', v.isPlayer);

    renderHome(v);
    renderList(v);
    renderCrate(v);
    renderPlayer(v);
    renderMinibar(v);
  }

  function renderAccount() {
    const key = JSON.stringify([state.account, state.syncing, state.ytError]);
    rebuild(refs.topbarRight, key, () => {
      const add = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        refs.topbarRight.appendChild(n);
        return n;
      };
      if (state.ytError) add('span', 'yt-error', state.ytError);
      if (state.syncing) {
        add('span', '', 'Syncing YouTube Music…');
      } else if (state.account) {
        add('span', '', 'Synced with YouTube Music');
        const av = add('button', 'avatar');
        av.title = state.account.name + ' · Sign out';
        av.setAttribute('aria-label', 'Sign out of ' + state.account.name);
        if (state.account.avatar) {
          const img = document.createElement('img');
          img.src = state.account.avatar;
          img.alt = '';
          img.referrerPolicy = 'no-referrer';
          av.appendChild(img);
        } else {
          av.innerHTML = ACCOUNT_ICON;
        }
        av.onclick = disconnectYouTube;
      } else {
        add('button', 'yt-connect', 'Connect YouTube Music').onclick = connectYouTube;
      }
    });
  }

  function renderHome(v) {
    refs.heroVinyl.style.background = v.art.vinylBg;
    refs.heroVinyl.style.animationPlayState = v.spinState;
    refs.heroVinylLabel.style.background = v.art.c4;
    refs.heroCover.style.background = v.art.coverBg;
    refs.heroState.textContent = v.stateLabel + ' · from ' + v.nowPl.name;
    refs.heroState.style.color = v.accent;
    refs.heroTitle.textContent = v.now.title;
    refs.heroSub.textContent = v.now.artist + ' · ' + v.art.vinylName + ' pressing';

    refs.heroToggle.innerHTML = (v.playing ? PAUSE_ICON_HERO : PLAY_ICON_HERO) + v.toggleLabel;
    refs.heroToggle.onclick = actions.toggle;
    refs.heroArt.onclick = actions.openPlayer;
    refs.heroOpen.onclick = actions.openPlayer;

    rebuild(refs.playlistsGrid, JSON.stringify(v.playlists), () => v.playlists.forEach((pl) => {
      const btn = document.createElement('button');
      btn.className = 'pl-tile';
      btn.innerHTML =
        '<span class="pl-art">' +
          '<span class="pl-disc"><span class="pl-disc-label"></span></span>' +
          '<span class="pl-cover"><span></span></span>' +
        '</span>' +
        '<span class="pl-name"></span>' +
        '<span class="pl-sub"></span>';
      btn.querySelector('.pl-disc-label').style.background = pl.color;
      btn.querySelector('.pl-cover').style.background = pl.color;
      btn.querySelector('.pl-cover span').textContent = pl.name;
      btn.querySelector('.pl-name').textContent = pl.name;
      btn.querySelector('.pl-sub').textContent = pl.countLabel + ' · ' + pl.lengthLabel;
      btn.addEventListener('click', () => actions.openPlaylist(pl.idx));
      refs.playlistsGrid.appendChild(btn);
    }));
  }

  function renderList(v) {
    refs.listBack.onclick = actions.goHome;
    refs.listDiscDot.style.background = v.openPl.color;
    refs.listDiscCover.style.background = v.openPl.color;
    refs.listTitle.textContent = v.openPl.name;
    refs.listSub.textContent = v.openPl.countLabel + ' · ' + v.openPl.lengthLabel;
    refs.listPlayAll.onclick = actions.playOpen;

    const rowsKey = JSON.stringify([state.openId, v.openTracks, v.art.vinylBg, v.spinState]);
    rebuild(refs.listRows, rowsKey, () => v.openTracks.forEach((t) => {
      const row = document.createElement('button');
      row.className = 'track-row';
      row.style.background = t.bg;
      row.style.color = t.color;
      row.innerHTML =
        '<span class="num-cell"></span>' +
        '<span class="t-title"></span>' +
        '<span class="t-artist"></span>' +
        '<span class="t-time"></span>';
      const numCell = row.querySelector('.num-cell');
      numCell.style.color = t.numColor;
      if (t.showNow) {
        numCell.innerHTML = '<span class="mini-vinyl"><span></span></span>';
        numCell.querySelector('.mini-vinyl').style.background = v.art.vinylBg;
        numCell.querySelector('.mini-vinyl').style.animationPlayState = v.spinState;
      } else {
        numCell.innerHTML = '<span class="num"></span><span class="play">' + PLAY_TRI_ROW + '</span>';
        numCell.querySelector('.num').textContent = String(t.num);
      }
      row.querySelector('.t-title').textContent = t.title;
      row.querySelector('.t-artist').textContent = t.artist;
      row.querySelector('.t-time').textContent = t.time;
      row.addEventListener('click', () => actions.playTrack(state.openId, t.idx));
      refs.listRows.appendChild(row);
    }));
  }

  function renderCrate(v) {
    refs.crateNowCover.style.background = v.art.coverBg;
    refs.crateHex.textContent = v.coverHex;
    refs.crateMatch.textContent = v.matchLabel;
    refs.crateAutoMatch.classList.toggle('hidden', !v.isPicked);
    refs.crateAutoMatch.onclick = actions.autoMatch;

    rebuild(refs.crateGrid, JSON.stringify([v.crate, v.art.c1]), () => v.crate.forEach((vi) => {
      const btn = document.createElement('button');
      btn.className = 'vinyl-tile';
      btn.innerHTML =
        '<span class="vinyl-disc"><span class="vinyl-disc-center"><span></span></span></span>' +
        '<span class="vinyl-meta">' +
          '<span class="vinyl-name"></span>' +
          '<span class="vinyl-hex"><span class="swatch"></span><span class="hex-style"></span></span>' +
          '<span class="vinyl-on hidden">On the platter</span>' +
        '</span>';
      const disc = btn.querySelector('.vinyl-disc');
      disc.style.background = vi.bg;
      disc.style.boxShadow = vi.ring;
      disc.style.transform = 'scale(' + vi.scale + ')';
      btn.querySelector('.vinyl-name').textContent = vi.name;
      btn.querySelector('.swatch').style.background = vi.hex;
      btn.querySelector('.hex-style').textContent = vi.hex + ' · ' + vi.style;
      btn.querySelector('.vinyl-on').classList.toggle('hidden', !vi.on);
      btn.addEventListener('click', () => actions.pickVinyl(vi.idx, closestVinyl(v.art.c1)));
      refs.crateGrid.appendChild(btn);
    }));
  }

  function renderPlayer(v) {
    refs.playerCover.style.background = v.art.coverBg;
    refs.playerCoverTitle.textContent = v.now.title;
    refs.playerCoverTitle.style.color = v.art.c4;
    refs.playerCoverArtist.textContent = v.now.artist;
    refs.playerCoverArtist.style.color = v.art.c4;
    refs.playerCoverTitle.classList.toggle('hidden', v.art.hasThumb);
    refs.playerCoverArtist.classList.toggle('hidden', v.art.hasThumb);

    refs.playerClose.onclick = actions.closePlayer;
    refs.ledDot.style.background = v.ledColor;
    refs.ledDot.style.boxShadow = v.ledGlow;
    refs.playerStateLabel.textContent = v.stateLabel + ' · ' + v.nowPl.name;
    refs.playerTitle.textContent = v.now.title;
    refs.playerArtist.textContent = v.now.artist;

    refs.playerOpenCrate.onclick = actions.openCrate;
    refs.pressingDot.style.background = v.art.vinylBg;
    refs.pressingName.textContent = v.art.vinylName + ' pressing';

    rebuild(refs.upNextRows, JSON.stringify([state.plId, v.upNext]), () => v.upNext.forEach((u) => {
      const row = document.createElement('button');
      row.className = 'up-row';
      row.innerHTML =
        '<span class="up-cover"></span>' +
        '<span class="up-meta"><span class="up-title"></span><span class="up-artist"></span></span>' +
        '<span class="up-time mono"></span>';
      row.querySelector('.up-cover').style.background = u.cover;
      row.querySelector('.up-title').textContent = u.title;
      row.querySelector('.up-artist').textContent = u.artist;
      row.querySelector('.up-time').textContent = u.time;
      row.addEventListener('click', () => actions.playTrack(state.plId, u.idx));
      refs.upNextRows.appendChild(row);
    }));

    // turntable
    refs.disc.style.background = v.art.vinylDisc;
    refs.disc.style.animationDuration = v.spinDur;
    refs.disc.style.animationPlayState = v.spinState;
    refs.disc.onclick = actions.toggle;
    refs.discLabel.style.background = v.art.c4;
    refs.discLabel.style.color = v.art.c3;
    refs.discTitle.textContent = v.now.title;
    refs.discArtist.textContent = v.now.artist;
    refs.discRpm.textContent = v.rpmLabel + ' RPM';

    refs.tonearm.style.transform = 'rotate(' + v.armAngle + 'deg)';
    refs.tonearm.style.filter = v.armShadow;
    refs.stylusStripe.style.background = v.accent;

    refs.stageInner.style.zoom = v.stageZoom;

    refs.posLabel.textContent = v.posLabel;
    refs.timeLabel.textContent = v.now.time;
    refs.seekFill.style.width = v.progressPct;
    refs.seekKnob.style.left = v.progressPct;
    const duration = DATA[state.plId].tracks[state.idx][2];
    refs.seekTrack.onclick = (e) => actions.seekFromEvent(e, refs.seekTrack, duration);

    refs.btnStop.style.opacity = String(v.stopOpacity);
    refs.btnStop.onclick = actions.stop;
    refs.btnPrev.onclick = actions.prev;
    refs.btnNext.onclick = actions.next;
    refs.btnToggle.innerHTML = v.playing ? PAUSE_ICON : PLAY_ICON;
    refs.btnToggle.onclick = actions.toggle;
  }

  function renderMinibar(v) {
    refs.minibar.classList.toggle('show', v.showMini);
    refs.minibarOpen.onclick = actions.openPlayer;
    refs.minibarVinyl.style.background = v.art.vinylBg;
    refs.minibarVinyl.style.animationPlayState = v.spinState;
    refs.minibarVinylLabel.style.background = v.art.c4;
    refs.minibarCover.style.background = v.art.coverBg;
    refs.minibarTitle.textContent = v.now.title;
    refs.minibarArtist.textContent = v.now.artist;
    refs.minibarTime.textContent = v.posLabel + ' / ' + v.now.time;
    refs.minibarSeekFill.style.width = v.progressPct;
    const duration = DATA[state.plId].tracks[state.idx][2];
    refs.minibarSeek.onclick = (e) => actions.seekFromEvent(e, refs.minibarSeek, duration);
    refs.miniPrev.onclick = actions.prev;
    refs.miniNext.onclick = actions.next;
    refs.miniToggle.innerHTML = v.playing ? PAUSE_ICON_SM : PLAY_ICON_SM;
    refs.miniToggle.onclick = actions.toggle;
  }

  refs.goHome.addEventListener('click', actions.goHome);

  // ---------- player stage auto-fit ----------
  // Mirrors the design's ResizeObserver-driven `zoom` fit so the turntable
  // scales to fit the window: down for small ones, up to 1.6x for large ones.
  function fitStage() {
    const el = refs.stage;
    if (!el || !el.clientWidth) return; // hidden view: keep the last fit
    const z = Math.max(0.5, Math.min(1.6, (el.clientWidth - 80) / 1044, (el.clientHeight - 48) / 660));
    const zr = Math.round(z * 1000) / 1000;
    if (zr !== state.zoom) setState({ zoom: zr });
  }
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(fitStage).observe(refs.stage);
  } else {
    window.addEventListener('resize', fitStage);
  }

  // ---------- playback clock ----------
  setInterval(() => {
    if (!state.playing) return;
    const t = DATA[state.plId].tracks[state.idx];
    if (t[3]) {
      const s = Math.min(Math.floor(yt.player.time()), t[2]);
      if (s !== state.pos) setState({ pos: s });
      return;
    }
    if (state.pos + 1 >= t[2]) step(1); else setState({ pos: state.pos + 1 });
  }, 1000);

  // ---------- keyboard: space toggles play/pause ----------
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (e.code === 'Space' && !/INPUT|TEXTAREA/.test(tag) && !e.target.isContentEditable) {
      e.preventDefault();
      actions.toggle();
    }
  });

  yt.onEnded(() => step(1));

  render();
  fitStage();
  if (yt.signedIn()) syncYouTube();
})();
