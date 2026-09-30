// ---------- 3D background: drifting low-poly wireframe shapes ----------
// Runs behind all page content on <canvas id="bg-canvas">.
// Fails silently if three.js didn't load (e.g. blocked script) — the page
// still looks correct with the plain dark background as a fallback.

(function () {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ---- palette (matches style.css custom properties) ----
  const COLOR_DIM = 0x3b3660;   // muted violet-steel — most shapes
  const COLOR_TEAL = 0x2fe0c3;  // secondary accent
  const COLOR_AMBER = 0xf5a93b; // single "signal" shape

  let scene, camera, renderer;
  let shapes = [];
  let group;
  let width, height;
  let rafId = null;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // fully transparent — CSS bg shows through

    group = new THREE.Group();
    scene.add(group);

    const geometries = [
      () => new THREE.IcosahedronGeometry(1, 0),
      () => new THREE.OctahedronGeometry(1, 0),
      () => new THREE.TetrahedronGeometry(1, 0),
    ];

    const TOTAL = 20;
    for (let i = 0; i < TOTAL; i++) {
      const geoFn = geometries[Math.floor(Math.random() * geometries.length)];
      const geometry = geoFn();

      let color = COLOR_DIM;
      let opacity = 0.3;
      if (i === TOTAL - 1) {
        color = COLOR_AMBER; // exactly one amber shape — a quiet focal point
        opacity = 0.38;
      } else if (i % 4 === 0) {
        color = COLOR_TEAL;
        opacity = 0.26;
      }

      const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: opacity,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const scale = 1 + Math.random() * 2.4;
      mesh.scale.setScalar(scale);

      mesh.position.set(
        (Math.random() - 0.5) * 46,
        (Math.random() - 0.5) * 30,
        -Math.random() * 34 - 4
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData.spin = {
        x: (Math.random() - 0.5) * 0.0025,
        y: (Math.random() - 0.5) * 0.0025,
      };

      group.add(mesh);
      shapes.push(mesh);
    }

    window.addEventListener('resize', onResize, { passive: true });
    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange);
    }
  }

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / width - 0.5) * 2;
    mouseY = (e.clientY / height - 0.5) * 2;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopLoop();
    } else if (!prefersReducedMotion) {
      startLoop();
    }
  }

  function animate() {
    rafId = requestAnimationFrame(animate);

    shapes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.spin.x;
      mesh.rotation.y += mesh.userData.spin.y;
    });
    group.rotation.y += 0.00025;

    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;
    camera.position.x = targetX * 1.4;
    camera.position.y = -targetY * 1.0;
    camera.lookAt(0, 0, -10);

    renderer.render(scene, camera);
  }

  function startLoop() {
    if (rafId === null) animate();
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  try {
    init();
    if (prefersReducedMotion) {
      renderer.render(scene, camera); // one static frame, no motion
    } else {
      startLoop();
    }
  } catch (e) {
    console.warn('3D background skipped:', e);
  }
})();
