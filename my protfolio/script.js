/**
 * Jayanta Portfolio — Hamish Williams (hamishw.com) 1:1 Engine
 * Three.js 3D Displacement Sphere, Cycling DecoderText Animation & 3D Mockup Parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Setup Official Google Antigravity Interactive Vector-Field Particle Background
  initAntigravityCanvas();

  // 3. Three.js Sphere (Disabled in favor of clean Google Antigravity interactive canvas)
  // initDisplacementSphere();

  // 4. Setup The Signature Hamish Cycling Discipline DecoderText Animation (+ Animator -> + Developer)
  initDisciplineDecoderAnimation();

  // 5. Setup Scroll Decoder Text on Section Headings
  initScrollDecoderAnimation();

  // 6. Setup 3D Device Perspective Parallax on Hover
  initDevice3DParallax();

  // 7. Setup Theme Toggle (Dark / Light)
  initThemeToggle();

  // 8. Navigation & Live Clock
  initNavigation();
  initLiveClock();
});

/* ===================================================================
   1. Three.js WebGL Interactive Displacement Sphere
   =================================================================== */
function initDisplacementSphere() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5.8;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lighting setup for Hamish iridescent cyan / emerald aesthetic
  const ambientLight = new THREE.AmbientLight(0x0c0c0c, 3.2);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00F0FF, 3.8, 50);
  cyanLight.position.set(4, 3, 4);
  scene.add(cyanLight);

  const neonGreenLight = new THREE.PointLight(0x00E599, 3.0, 50);
  neonGreenLight.position.set(-4, -2, 3);
  scene.add(neonGreenLight);

  const purpleBacklight = new THREE.PointLight(0xA855F7, 2.2, 50);
  purpleBacklight.position.set(0, 4, -4);
  scene.add(purpleBacklight);

  // Sphere Geometry
  const radius = 1.65;
  const geometry = new THREE.IcosahedronGeometry(radius, 40);

  // Cache original vertex positions for displacement calculations
  const positionAttribute = geometry.attributes.position;
  const originalPositions = new Float32Array(positionAttribute.array);

  // High-End Metallic Physical Material
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    roughness: 0.18,
    metalness: 0.45,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    reflectivity: 0.95,
  });

  const sphere = new THREE.Mesh(geometry, material);
  // Positioned slightly to right on desktop matching Hamish's hero layout
  sphere.position.set(window.innerWidth > 1024 ? 1.6 : 0, 0, 0);
  scene.add(sphere);

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Procedural noise approximation using multi-frequency harmonic waves
  function noise(x, y, z, time) {
    return (
      Math.sin(x * 1.6 + time * 1.3) * Math.cos(y * 1.6 + time * 0.9) * 0.5 +
      Math.sin(y * 2.3 - time * 1.5) * Math.cos(z * 2.3 + time * 1.2) * 0.3 +
      Math.sin(z * 3.2 + time * 1.8) * Math.cos(x * 3.2 - time * 1.4) * 0.2
    );
  }

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime() * 0.75;

    // Smooth inertia tracking
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    sphere.rotation.y = time * 0.18 + targetX * 0.6;
    sphere.rotation.x = targetY * 0.4;

    // Point lights follow cursor smoothly
    cyanLight.position.x = 4 + targetX * 2.5;
    cyanLight.position.y = 3 + targetY * 2.5;

    // Morph vertices along normals using procedural noise
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const ox = originalPositions[i];
      const oy = originalPositions[i + 1];
      const oz = originalPositions[i + 2];

      const length = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / length;
      const ny = oy / length;
      const nz = oz / length;

      const displacement = noise(nx, ny, nz, time) * 0.38;
      const newRadius = radius + displacement;

      positions[i] = nx * newRadius;
      positions[i + 1] = ny * newRadius;
      positions[i + 2] = nz * newRadius;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sphere.position.set(window.innerWidth > 1024 ? 1.6 : 0, 0, 0);
  });
}

/* ===================================================================
   2. Signature Discipline Cycling DecoderText Animation (+ Animator -> + Developer)
   =================================================================== */
function initDisciplineDecoderAnimation() {
  const textEl = document.getElementById('discipline-text');
  if (!textEl) return;

  const DISCIPLINES = ['Shopify Developer', 'Web Designer', 'Frontend Dev', 'UI/UX Specialist', 'Liquid Expert'];
  const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789ABCDEF!@#$%&*';

  let currentIndex = 0;

  function scrambleToWord(targetWord) {
    let iteration = 0;
    const maxIterations = targetWord.length * 2.6;

    clearInterval(textEl._scrambleInterval);

    textEl._scrambleInterval = setInterval(() => {
      textEl.textContent = targetWord
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration / 2.6) {
            return targetWord[index];
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        textEl.textContent = targetWord;
        clearInterval(textEl._scrambleInterval);
      }

      iteration += 1;
    }, 45); // Slower, relaxed scramble transition
  }

  // Initial scramble on load
  setTimeout(() => {
    scrambleToWord(DISCIPLINES[0]);
  }, 600);

  // Cycle every 4.8 seconds (slower, comfortably readable)
  setInterval(() => {
    currentIndex = (currentIndex + 1) % DISCIPLINES.length;
    scrambleToWord(DISCIPLINES[currentIndex]);
  }, 4800);
}

/* ===================================================================
   3. Scroll Decoder Animation on Headings
   =================================================================== */
function initScrollDecoderAnimation() {
  const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF!@#$%&*';

  function decodeElement(element) {
    const targetText = element.getAttribute('data-text') || element.textContent;
    let iteration = 0;
    const maxIterations = targetText.length * 2;

    clearInterval(element._decodeInterval);

    element._decodeInterval = setInterval(() => {
      element.textContent = targetText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration / 2) {
            return targetText[index];
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        element.textContent = targetText;
        clearInterval(element._decodeInterval);
      }

      iteration += 1;
    }, 25);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        decodeElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.decoder-heading').forEach(el => observer.observe(el));
}

/* ===================================================================
   4. 3D Perspective Device Mockup Parallax
   =================================================================== */
function initDevice3DParallax() {
  const containers = document.querySelectorAll('.perspective-container');

  containers.forEach(container => {
    const device = container.querySelector('.laptop-device, .phone-device');
    if (!device) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateY = (x / (rect.width / 2)) * 14;
      const rotateX = -(y / (rect.height / 2)) * 12;

      device.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.03)`;
    });

    container.addEventListener('mouseleave', () => {
      device.style.transform = '';
    });
  });
}

/* ===================================================================
   5. Theme Toggle Box (Dark / Light Mode)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  let isDark = true;

  toggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      toggleBtn.innerHTML = '<span class="text-base text-white/90">☾</span>';
    } else {
      document.documentElement.classList.remove('dark');
      toggleBtn.innerHTML = '<span class="text-base text-white/90">☼</span>';
    }
    if (typeof window._updateAntigravityTheme === 'function') {
      window._updateAntigravityTheme(isDark);
    }
  });
}

/* ===================================================================
   6. Navigation & Scroll Tracking
   =================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileItems = document.querySelectorAll('.mobile-item');
  const navLinks = document.querySelectorAll('.vertical-nav-item');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Active Section Spy
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 240;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ===================================================================
   7. Live Local Clock
   =================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `LOCAL // ${hours}:${minutes}:${seconds} IST`;
  }

  setInterval(updateClock, 1000);
  updateClock();
}

/* ===================================================================
   8. Official Google Antigravity (https://antigravity.google/oauth-callback)
   Exact WebGL Shader & Vector Field Simulation:
   - 12,500+ oriented rounded pill dashes (sdRoundBox GLSL)
   - Tangential vector-field streamlines aligned along field rotation (-angle + noiseAngle)
   - Dynamic cursor gravitational ring with harmonic radius pulsation
   - 3-stop Google gradient palette (Electric Blue, Coral Red, Sun Yellow)
   - Seamless all-hover cursor tracking across the entire screen
   =================================================================== */
function initAntigravityCanvas() {
  const canvas = document.getElementById('antigravity-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3.1;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Generate 3,200 refined particles (clean, spacious, non-hazy)
  const particleCount = 3200;
  const positions = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount * 4);
  const gridSize = Math.ceil(Math.sqrt(particleCount));
  let pIdx = 0;

  for (let gy = 0; gy < gridSize && pIdx < particleCount; gy++) {
    for (let gx = 0; gx < gridSize && pIdx < particleCount; gx++) {
      const u = (gx / (gridSize - 1)) * 2.6 - 1.3;
      const v = (gy / (gridSize - 1)) * 2.6 - 1.3;
      const jx = u + (Math.random() - 0.5) * (2.6 / gridSize) * 0.95;
      const jy = v + (Math.random() - 0.5) * (2.6 / gridSize) * 0.95;

      positions[pIdx * 3 + 0] = jx;
      positions[pIdx * 3 + 1] = jy;
      positions[pIdx * 3 + 2] = 0;

      seeds[pIdx * 4 + 0] = Math.random();
      seeds[pIdx * 4 + 1] = Math.random();
      seeds[pIdx * 4 + 2] = Math.random();
      seeds[pIdx * 4 + 3] = Math.random();

      pIdx++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('seeds', new THREE.BufferAttribute(seeds, 4));

  // Simplex 3D Noise GLSL (exact Ian McEwan / Ashima Arts)
  const snoiseGLSL = `
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
  `;

  const vertexShader = `
    precision highp float;

    uniform float uTime;
    uniform vec2 uRingPos;
    uniform float uRingRadius;
    uniform float uRingWidth;
    uniform float uRingWidth2;
    uniform float uRingDisplacement;
    uniform float uParticleScale;
    uniform float uPixelRatio;

    attribute vec4 seeds;

    varying vec2 vLocalPos;
    varying float vScale;
    varying float vVelocity;

    ${snoiseGLSL}

    void main() {
        vec2 refPos = position.xy;
        float time = uTime * 0.5;

        // Multi-frequency procedural noise displacement
        float noise1 = snoise(vec3(refPos.xy * 4.0 + vec2(88.494, 32.4397), time * 0.35));
        float noise2 = snoise(vec3(refPos.xy * 4.0 + vec2(50.904, 120.947), time * 0.35));
        float noise3 = snoise(vec3(refPos.xy * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
        float noise4 = snoise(vec3(refPos.xy * 20.0 + vec2(50.904, 120.947), time * 0.5));

        vec2 disp = vec2(noise1, noise2) * 0.03;
        disp += vec2(noise3, noise4) * 0.005;

        float dist = distance(refPos.xy, uRingPos);
        float noise0 = snoise(vec3(refPos.xy * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
        float dist1 = distance(refPos.xy + (noise0 * 0.005), uRingPos);

        // Ring effect calculation (active wave / ripple around mouse cursor)
        float t = smoothstep(uRingRadius - (uRingWidth * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
        float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
        float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

        t = pow(max(0.0, t), 2.0);
        t2 = pow(max(0.0, t2), 3.0);
        t += t2 * 2.5;
        t += t3 * 0.35;
        t += snoise(vec3(refPos.xy * 25.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.4;

        // Interactive cursor proximity falloff: keeps distant areas clean and non-hazy
        float cursorDistFalloff = 1.0 - smoothstep(0.0, 0.9, dist);
        t *= (0.35 + cursorDistFalloff * 0.65);

        // Very faint ambient noise (airy, subtle, non-hazy)
        float nS = snoise(vec3(refPos.xy * 1.5 + vec2(18.4924, 72.9744), time * 0.25));
        float ambient = pow((nS + 1.0) * 0.5, 3.0) * 0.05;

        disp.x += sin((refPos.x * 20.0) + (time * 4.0)) * 0.015 * clamp(dist, 0.0, 1.0);
        disp.y += cos((refPos.y * 20.0) + (time * 3.0)) * 0.015 * clamp(dist, 0.0, 1.0);

        // Displacement away from ring center
        vec2 ringDisp = -(uRingPos - (refPos + disp)) * pow(t2, 0.75) * uRingDisplacement;
        vec2 finalPos = refPos + disp + (ringDisp * 0.35);

        vLocalPos = finalPos;
        vScale = clamp(t + ambient, 0.0, 1.4);
        vVelocity = clamp(t * 0.9, 0.0, 1.0);

        vec4 viewSpace = modelViewMatrix * vec4(vec3(finalPos, 0.0), 1.0);
        gl_Position = projectionMatrix * viewSpace;

        // Refined dash sprite size (clean, non-hazy)
        gl_PointSize = max(3.5, (3.5 + vScale * 7.0) * (uPixelRatio * 0.5) * uParticleScale);
    }
  `;

  const fragmentShader = `
    precision highp float;

    varying vec2 vLocalPos;
    varying float vScale;
    varying float vVelocity;

    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    uniform vec2 uRingPos;
    uniform float uAlpha;
    uniform float uTime;
    uniform int uColorScheme;

    ${snoiseGLSL}

    // Signed Distance Field for Rounded Box (Pill)
    float sdRoundBox( in vec2 p, in vec2 b, in vec4 r ) {
        r.xy = (p.x > 0.0) ? r.xy : r.zw;
        r.x  = (p.y > 0.0) ? r.x  : r.y;
        vec2 q = abs(p) - b + r.x;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
    }

    vec2 rotate(vec2 v, float a) {
        float s = sin(a);
        float c = cos(a);
        mat2 m = mat2(c, s, -s, c);
        return m * v;
    }

    void main() {
        float noiseAngle = snoise(vec3(vLocalPos * 10.0 + vec2(18.4924, 72.9744), uTime * 0.85));
        float noiseColor = snoise(vec3(vLocalPos * 2.0 + vec2(74.664, 91.556), uTime * 0.5));
        noiseColor = (noiseColor + 1.0) * 0.5;

        // Vector field streamline angle relative to ring/mouse position
        float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

        vec2 uv = gl_PointCoord.xy;
        uv -= vec2(0.5);
        uv.y *= -1.0;
        // Rotate pill tangentially along field lines
        uv = rotate(uv, -angle + (noiseAngle * 0.5));

        // Google 3-Color Gradient (Blue -> Red -> Yellow)
        float h = 0.8;
        float progress = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
        vec3 col = mix(mix(uColor1, uColor2, progress / h), mix(uColor2, uColor3, (progress - h) / (1.0 - h)), step(h, progress));
        vec3 color = col;

        // Rounded dash pill geometry (width 0.5, height 0.2, corner radius 0.25)
        float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(0.25));
        rounded = smoothstep(0.1, 0.0, rounded);

        // Airy, non-hazy transparency: subtle ambient background + brilliant interactive hover
        float ambientAlpha = 0.06;
        float interactiveAlpha = smoothstep(0.08, 0.45, vScale) * 0.94;
        float a = uAlpha * rounded * (ambientAlpha + interactiveAlpha);
        if (a < 0.012) {
            discard;
        }

        color = clamp(color, 0.0, 1.0);
        if (uColorScheme == 0) {
            // Dark mode subtle boost
            color = mix(color, color + vec3(0.12, 0.15, 0.28), clamp(vVelocity, 0.0, 1.0));
        }

        gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
    }
  `;

  // Colors: exact Google Antigravity palette (#2c64ed Blue, #f84242 Red, #ffcf03 Yellow)
  const isDark = document.documentElement.classList.contains('dark');
  const color1 = new THREE.Color('#2c64ed'); // Blue
  const color2 = new THREE.Color('#f84242'); // Red
  const color3 = new THREE.Color('#ffcf03'); // Yellow

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uRingPos: { value: new THREE.Vector2(0, 0) },
      uRingRadius: { value: 0.18 },
      uRingWidth: { value: 0.107 },
      uRingWidth2: { value: 0.05 },
      uRingDisplacement: { value: 0.12 },
      uParticleScale: { value: 0.9 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uColor1: { value: color1 },
      uColor2: { value: color2 },
      uColor3: { value: color3 },
      uAlpha: { value: 0.55 },
      uColorScheme: { value: isDark ? 0 : 1 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const mesh = new THREE.Points(geometry, material);
  mesh.scale.set(5, 5, 5);
  scene.add(mesh);

  // Smooth mouse / ring tracking
  const targetRingPos = new THREE.Vector2(0, 0);
  const ringPos = new THREE.Vector2(0, 0);

  function updateMouseWorld(clientX, clientY) {
    const nx = (clientX / window.innerWidth) * 2 - 1;
    const ny = -(clientY / window.innerHeight) * 2 + 1;

    const tanFov = Math.tan((camera.fov * Math.PI) / 360);
    const planeH = 2 * tanFov * camera.position.z;
    const planeW = planeH * camera.aspect;

    const worldX = (nx * planeW) * 0.5;
    const worldY = (ny * planeH) * 0.5;

    // Mesh is scaled by 5.0
    targetRingPos.x = worldX / 5.0;
    targetRingPos.y = worldY / 5.0;
  }

  // Global mouse event listener across the entire page (all hovers)
  window.addEventListener('mousemove', (e) => {
    updateMouseWorld(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      updateMouseWorld(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Expose theme updater for the theme toggle button
  window._updateAntigravityTheme = (dark) => {
    material.uniforms.uColorScheme.value = dark ? 0 : 1;
    material.uniforms.uColor1.value.set('#2c64ed');
    material.uniforms.uColor2.value.set('#f84242');
    material.uniforms.uColor3.value.set('#ffcf03');
  };

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
  });

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Smooth inertia follow
    ringPos.x += (targetRingPos.x - ringPos.x) * 0.038;
    ringPos.y += (targetRingPos.y - ringPos.y) * 0.038;

    material.uniforms.uRingPos.value.copy(ringPos);
    material.uniforms.uTime.value = time;
    material.uniforms.uRingRadius.value = 0.18 + Math.sin(time * 1.0) * 0.03 + Math.cos(time * 3.0) * 0.02;

    renderer.render(scene, camera);
  }

  animate();
}
