/*
  سنّ ثلاثي الأبعاد هادئ للواجهة: شكل السنّ يُنفخ من خطّ خارجي (وسادة ناعمة) بوجهين، مينا لامعة وجذور بلون عاجي،
  يطفو ببطء ويميل قليلاً مع المؤشر. المشهد كله يُفكَّك من الذاكرة عند ابتعاد القسم عن الشاشة (يديره app.js).
*/
import { THREE, baseStage, chaikin, pillow } from './lib3d.js';

/* نصف الخطّ الأيمن (من أعلى الوسط إلى أسفل الوسط)؛ يُعكس للأيسر */
const HALF = [[0, .8], [.2, .95], [.45, 1.0], [.7, .9], [.84, .62], [.82, .3], [.7, .04], [.6, -.3], [.5, -.72], [.4, -1.02], [.29, -1.07], [.2, -.82], [.12, -.52], [0, -.4]];
const OUTLINE = chaikin(HALF.concat(HALF.slice(1, -1).reverse().map(([x, y]) => [-x, y])), 3);

export function createTooth(canvas, host) {
  const S = baseStage(canvas, { fov: 28, exposure: 1.28 });
  if (!S) return null;
  const { scene, camera } = S;

  scene.add(new THREE.HemisphereLight(0xfffaf3, 0xb4d0cb, .85));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.55); key.position.set(-2.5, 3.5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb8fff6, 1.1); rim.position.set(3, 1, -3); scene.add(rim);

  /* مجسّم السنّ: وجهان (أمامي وخلفي) من نفس الوسادة، وألوان رؤوس: تاج أبيض وجذور عاجية */
  const geo = pillow(OUTLINE, .62, .05, 30, false), pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
  const ivory = new THREE.Color(0xe9d8b8), white = new THREE.Color(0xffffff), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const y2d = -pos.getZ(i), u = THREE.MathUtils.clamp((-.05 - y2d) / .57, 0, 1), t = u * u * (3 - 2 * u); c.copy(white).lerp(ivory, t * .85); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, roughness: .2, metalness: 0, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: 1.1, emissive: new THREE.Color(0x1d2b2a), emissiveIntensity: .45, sheen: .6, sheenColor: new THREE.Color(0xfff3de), sheenRoughness: .5 });
  const tooth = new THREE.Group();
  const front = new THREE.Mesh(geo, mat), back = new THREE.Mesh(geo, mat);
  front.rotation.x = back.rotation.x = Math.PI / 2; back.scale.y = -1;
  tooth.add(front, back);
  scene.add(tooth);

  /* ظلّ ناعم تحت السنّ يتنفّس مع الطفو */
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  { const g = sc.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(8,60,70,.55)'); gr.addColorStop(.6, 'rgba(8,60,70,.16)'); gr.addColorStop(1, 'rgba(8,60,70,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.55; scene.add(shadow);

  /* مؤشر/إمالة الجهاز */
  const tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  const onMove = (e) => { const r = host.getBoundingClientRect(); tgt.x = ((e.clientX - r.left) / r.width - .5) * 2; tgt.y = ((e.clientY - r.top) / r.height - .5) * 2; };
  const onLeave = () => { tgt.x = 0; tgt.y = 0; };
  host.addEventListener('pointermove', onMove); host.addEventListener('pointerleave', onLeave);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.onResize = (w, h) => {
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), need = 2.55, d = Math.max(need / (2 * t), 2.05 / (2 * t * camera.aspect)) * 1.18;
    camera.position.set(0, .05, d); camera.lookAt(0, 0, 0);
  };
  S.resize();
  S.onFrame = (dt) => {
    const t = S.time, k = 1 - Math.exp(-dt * 5);
    cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k;
    const sway = reduce ? 0 : 1;
    tooth.rotation.y = Math.sin(t * .55) * .5 * sway + cur.x * .45;
    tooth.rotation.x = cur.y * .22 - .04;
    tooth.rotation.z = Math.sin(t * .7) * .035 * sway;
    const bob = Math.sin(t * 1.15) * .06 * sway;
    tooth.position.y = bob + .02;
    shadow.scale.setScalar(1 - bob * .9); shadow.material.opacity = .9 - bob * .8;
    key.position.x = -2.5 + Math.sin(t * .4) * .8;   // لمعة تتحرك على المينا
  };
  S.onDispose = () => { host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave); };
  return S;
}
