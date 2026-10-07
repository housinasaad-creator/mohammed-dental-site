/*
  أدوات three.js المشتركة (مأخوذة من مشروع الشوكولا): بيئة استوديو، نفخ شكل ثنائي الأبعاد إلى مجسّم ناعم،
  وقاعدة مشهد تعمل فقط حين تكون ظاهرة وتُفكَّك بالكامل من الذاكرة عند الإغلاق.
*/
import * as THREE from './vendor/three.module.min.js';
export { THREE };

export const TAU = Math.PI * 2;

/* ---------------------------------------------------------------- هندسة ثنائية الأبعاد */
export function chaikin(pts, iters = 2) {
  let a = pts;
  for (let k = 0; k < iters; k++) {
    const b = [], n = a.length;
    for (let i = 0; i < n; i++) { const p = a[i], q = a[(i + 1) % n]; b.push([.75 * p[0] + .25 * q[0], .75 * p[1] + .25 * q[1]], [.25 * p[0] + .75 * q[0], .25 * p[1] + .75 * q[1]]); }
    a = b;
  }
  return a;
}
export const centroid = (pts) => { let x = 0, y = 0; pts.forEach((p) => { x += p[0]; y += p[1]; }); return [x / pts.length, y / pts.length]; };

/* إعادة أخذ عيّنات من حدّ مغلق بمسافات متساوية */
export function resample(pts, n) {
  const m = pts.length, len = [0]; for (let i = 0; i < m; i++) { const a = pts[i], b = pts[(i + 1) % m]; len.push(len[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const L = len[m], out = []; let j = 0;
  for (let i = 0; i < n; i++) { const d = (i / n) * L; while (len[j + 1] < d) j++; const a = pts[j % m], b = pts[(j + 1) % m], f = (d - len[j]) / ((len[j + 1] - len[j]) || 1); out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); }
  return out;
}

/* نفخ سلس (معادلة بواسون بطريقة SOR): ارتفاع ناعم بلا طيّات كبالون ممتلئ */
export function inflater(outline) {
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; outline.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  const n = 72, dx = (x1 - x0) / (n - 3), dy = (y1 - y0) / (n - 3), ox = x0 - dx, oy = y0 - dy, phi = new Float32Array(n * n), mask = new Uint8Array(n * n);
  const inside = (x, y) => { let c = false; for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) { const [xi, yi] = outline[i], [xj, yj] = outline[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) mask[j * n + i] = inside(ox + i * dx, oy + j * dy) ? 1 : 0;
  const w = 1.9, c = dx * dy;
  for (let it = 0; it < 220; it++) for (let j = 1; j < n - 1; j++) for (let i = 1; i < n - 1; i++) { const k = j * n + i; if (!mask[k]) continue; const nb = phi[k - 1] + phi[k + 1] + phi[k - n] + phi[k + n]; phi[k] += w * ((nb + c) / 4 - phi[k]); }
  let mx = 0; for (let k = 0; k < phi.length; k++) mx = Math.max(mx, phi[k]);
  const at = (i, j) => phi[Math.min(n - 1, Math.max(0, j)) * n + Math.min(n - 1, Math.max(0, i))] / mx;
  const cr = (p0, p1, p2, p3, t) => .5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  return (x, y) => { const fx = Math.min(n - 1.001, Math.max(0, (x - ox) / dx)), fy = Math.min(n - 1.001, Math.max(0, (y - oy) / dy)), i = fx | 0, j = fy | 0, tx = fx - i, ty = fy - j; const col = (jj) => cr(at(i - 1, jj), at(i, jj), at(i + 1, jj), at(i + 2, jj), tx); return cr(col(j - 1), col(j), col(j + 1), col(j + 2), ty); };
}

/* وسادة منفوخة: حلقات من الحدّ نحو المركز، الارتفاع يعتمد على المسافة إلى الحدّ، ونورمالات تحليلية ناعمة */
export function pillow(outline, H, wall = .06, K = 26, analytic = true) {
  { let a = 0; for (let i = 0; i < outline.length; i++) { const p = outline[i], q = outline[(i + 1) % outline.length]; a += p[0] * q[1] - q[0] * p[1]; } if (a > 0) outline = outline.slice().reverse(); }
  outline = resample(outline, 240);
  const N = outline.length, [cx, cy] = centroid(outline), pos = [], idx = [], uv = [], hAt = inflater(outline);
  const vert = (x, y, z) => { pos.push(x, y, z); uv.push(x * .5 + .5, z * .5 + .5); return pos.length / 3 - 1; };
  const rings = [], HT = [], XY = [];
  for (let k = 0; k <= K; k++) {
    const s = 1 - Math.pow(k / K, 1.7), ht = [], xy = [];
    for (let i = 0; i < N; i++) { const [px, py] = outline[i], vx = cx + (px - cx) * s, vy = cy + (py - cy) * s; xy.push([vx, vy]); ht.push(k === 0 ? 0 : H * Math.sqrt(Math.min(1, Math.max(0, hAt(vx, vy))))); }
    HT.push(ht); XY.push(xy);
  }
  for (let it = 0; it < 3; it++) for (let k = 1; k < K; k++) { HT[k] = HT[k].map((y, i) => .5 * y + .125 * (HT[k][(i + 1) % N] + HT[k][(i + N - 1) % N]) + .125 * (HT[k - 1][i] + HT[k + 1][i])); }
  for (let k = 0; k <= K; k++) rings.push(XY[k].map(([vx, vy], i) => vert(vx, HT[k][i], -vy)));
  for (let k = 0; k < K; k++) for (let i = 0; i < N; i++) { const a = rings[k][i], b = rings[k][(i + 1) % N], c = rings[k + 1][i], d = rings[k + 1][(i + 1) % N]; idx.push(a, c, b, b, c, d); }
  const w0 = [], w1 = []; for (let i = 0; i < N; i++) { const [px, py] = outline[i]; w0.push(vert(px, 0, -py)); w1.push(vert(px, -wall, -py)); }
  for (let i = 0; i < N; i++) { const a = w0[i], b = w0[(i + 1) % N], c = w1[i], d = w1[(i + 1) % N]; idx.push(a, b, c, b, d, c); }
  const ctr = vert(cx, -wall, -cy); for (let i = 0; i < N; i++) idx.push(ctr, w1[i], w1[(i + 1) % N]);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const nrm = g.attributes.normal, e = .006;
  if (analytic) for (let k = 2; k <= K; k++) for (let i = 0; i < N; i++) {
    const [vx, vy] = XY[k][i], gx = (hAt(vx + e, vy) - hAt(vx - e, vy)) / (2 * e), gy = (hAt(vx, vy + e) - hAt(vx, vy - e)) / (2 * e), f = H / (2 * Math.sqrt(Math.max(hAt(vx, vy), 2e-3)));
    let nx = -f * gx, ny = 1, nz = f * gy; const l = Math.hypot(nx, ny, nz); nrm.setXYZ(rings[k][i], nx / l, ny / l, nz / l);
  }
  for (let i = 0; i < N; i++) {   // الحافّة: نورمال أفقي للخارج (مماسّ ناعم عند التقاء وجهي المجسّم)
    const p = outline[(i + N - 1) % N], q = outline[(i + 1) % N], tx = q[0] - p[0], ty = q[1] - p[1], l = Math.hypot(tx, ty) || 1, nx = -ty / l, nz = -tx / l;
    nrm.setXYZ(rings[0][i], nx, 0, nz); nrm.setXYZ(w0[i], nx, 0, nz); nrm.setXYZ(w1[i], nx, 0, nz);
    const a1 = rings[1][i], x1 = nrm.getX(a1), y1 = nrm.getY(a1), z1 = nrm.getZ(a1), m1 = .55; let ax = x1 * (1 - m1) + nx * m1, ay = y1 * (1 - m1) + .3 * m1, az = z1 * (1 - m1) + nz * m1; const al = Math.hypot(ax, ay, az) || 1; nrm.setXYZ(a1, ax / al, ay / al, az / al);
  }
  return g;
}

/* ---------------------------------------------------------------- بيئة استوديو: نوافذ إضاءة بتدرّج (soft boxes) */
export function makeEnv(renderer) {
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16), new THREE.MeshBasicMaterial({ color: 0x86adb2, side: THREE.BackSide })));
  const gc = document.createElement('canvas'); gc.width = 8; gc.height = 64; { const g = gc.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, '#fff'); gr.addColorStop(.55, '#dcebee'); gr.addColorStop(1, '#6c9aa6'); g.fillStyle = gr; g.fillRect(0, 0, 8, 64); }
  const grad = new THREE.CanvasTexture(gc); grad.colorSpace = THREE.SRGBColorSpace;
  const panel = (w, h, col, k, pos) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: grad, color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(...pos); m.lookAt(0, 0, 0); sc.add(m); };
  panel(7, 3.2, 0xffffff, 8, [-4, 7, 5]);
  panel(1.4, 9, 0xf4fdff, 6, [-8, 2, 1]);
  panel(1.4, 9, 0xe3f7f6, 4, [8, 2, 2]);
  panel(4, 6, 0x9fe6e0, 2, [6, 1, -4]);
  panel(10, 2.4, 0xffffff, 3, [0, 6, -8]);
  panel(4, 2, 0xffffff, 3, [3, 3, 8]);
  panel(10, 10, 0x1d4a57, .8, [0, -6, 0]);
  const pm = new THREE.PMREMGenerator(renderer), rt = pm.fromScene(sc, 0.02); pm.dispose(); grad.dispose(); return rt.texture;
}

/* ---------------------------------------------------------------- قاعدة مشهد */
export function baseStage(canvas, o = {}) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { return null; }
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.05;
  const coarse = matchMedia('(pointer: coarse)').matches;
  let dprMax = Math.min(devicePixelRatio || 1, o.dprCap || (coarse ? 1.75 : 2));
  const scene = new THREE.Scene(); scene.environment = makeEnv(renderer);
  const camera = new THREE.PerspectiveCamera(o.fov || 30, 1, 0.1, 60);
  const S = { renderer, scene, camera, coarse, canvas, vis: false, disposed: false, onFrame: null, onResize: null, time: 0 };
  let raf = 0, last = 0, acc = 0, frames = 0, slow = 0; const cap = coarse ? 1 / 30 : 1 / 60;
  function resize() {
    const w = canvas.clientWidth || 300, h = canvas.clientHeight || 300; renderer.setPixelRatio(dprMax); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    S.onResize && S.onResize(w, h);
  }
  function frame(now) {
    raf = 0; if (S.disposed || !S.vis || document.hidden) return;
    const dtRaw = Math.min(.05, (now - last) / 1000); last = now; acc += dtRaw;
    if (acc < cap * .9) { raf = requestAnimationFrame(frame); return; }
    const dt = acc; acc = 0; S.time += dt;
    S.onFrame && S.onFrame(dt, now);
    renderer.render(scene, camera);
    frames++; if (dt > .045) slow++;
    if (frames === 50) { if (slow > 22 && dprMax > 1) { dprMax = Math.max(1, dprMax - .3); resize(); } frames = 0; slow = 0; }
    raf = requestAnimationFrame(frame);
  }
  const wake = () => { if (!S.disposed && S.vis && !raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const io = new IntersectionObserver((es) => { S.vis = es[0].isIntersecting; wake(); }, { rootMargin: '60px' }); io.observe(canvas);
  const onWin = () => resize(); addEventListener('resize', onWin); document.addEventListener('visibilitychange', wake);
  S.resize = resize; S.wake = wake;
  S.dispose = () => {
    if (S.disposed) return; S.disposed = true; S.vis = false; cancelAnimationFrame(raf); raf = 0;
    removeEventListener('resize', onWin); document.removeEventListener('visibilitychange', wake); io.disconnect(); S.onDispose && S.onDispose();
    scene.traverse((n) => { if (n.geometry) n.geometry.dispose(); if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => { ['map', 'alphaMap', 'bumpMap'].forEach((k) => m[k] && m[k].dispose && m[k].dispose()); m.dispose(); }); });
    if (scene.environment) scene.environment.dispose(); scene.environment = null;
    renderer.dispose(); renderer.forceContextLoss(); canvas.width = 1; canvas.height = 1;
  };
  S.resize();
  return S;
}
