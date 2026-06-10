(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════════════════
     THREE.JS HERO ANIMATION – WOW VERSION
     Additive Blending Glow · Spiral Partikel-Vortex · 3 Geometrien · Puls
  ══════════════════════════════════════════════════════════════════════════════ */

  function initHero3D() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    if (typeof THREE === 'undefined') {
      console.warn('Three.js nicht geladen – Hero-Animation deaktiviert.');
      return;
    }
    try {

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function setSize() {
      const w = window.innerWidth;
      const h = document.getElementById('hero').offsetHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    setSize();
    window.addEventListener('resize', setSize, { passive: true });

    /* ── Noise vertex shader ────────────────────────────────────────────── */
    const noiseVert = /* glsl */`
      uniform float uTime;
      varying vec3 vNormal;
      varying float vDisp;

      vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
      vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
      vec4 permute(vec4 x){return mod289(((x*34.)+10.)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291-0.85373472*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1./6.,1./3.);
        const vec4 D=vec4(0.,.5,1.,2.);
        vec3 i=floor(v+dot(v,C.yyy));
        vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);
        vec3 l=1.-g;
        vec3 i1=min(g.xyz,l.zxy);
        vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;
        vec3 x2=x0-i2+C.yyy;
        vec3 x3=x0-D.yyy;
        i=mod289(i);
        vec4 p=permute(permute(permute(
          i.z+vec4(0.,i1.z,i2.z,1.))
          +i.y+vec4(0.,i1.y,i2.y,1.))
          +i.x+vec4(0.,i1.x,i2.x,1.));
        float n_=0.142857142857;
        vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);
        vec4 y_=floor(j-7.*x_);
        vec4 x=x_*ns.x+ns.yyyy;
        vec4 y=y_*ns.x+ns.yyyy;
        vec4 h=1.-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);
        vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.+1.;
        vec4 s1=floor(b1)*2.+1.;
        vec4 sh=-step(h,vec4(0.));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
        vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);
        vec3 p1=vec3(a0.zw,h.y);
        vec3 p2=vec3(a1.xy,h.z);
        vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
        m*=m;
        return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }
      void main(){
        vNormal = normal;
        vDisp   = snoise(position*1.5 + uTime*0.4)*0.3
                + snoise(position*3.0 - uTime*0.25)*0.12;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal*vDisp, 1.0);
      }
    `;

    /* Fragment: edge fresnel glow + color pulse amber↔red */
    const noiseFrag = /* glsl */`
      uniform vec3  uColorA;
      uniform vec3  uColorB;
      uniform float uTime;
      varying vec3  vNormal;
      varying float vDisp;
      void main(){
        float edge  = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.,0.,1.))), 1.4);
        float pulse = 0.5 + 0.5 * sin(uTime * 3.5);
        vec3  col   = mix(uColorA, uColorB, pulse * 0.4 + vDisp * 0.5);
        float alpha = (0.30 + 0.65 * edge) * (0.6 + 0.4 * pulse);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    /* ── Outer icosahedron – noise displaced, amber↔red pulse ──────────── */
    const mat1 = new THREE.ShaderMaterial({
      uniforms: {
        uTime:   { value: 0 },
        uColorA: { value: new THREE.Color('#D4961A') },
        uColorB: { value: new THREE.Color('#E8520A') },
      },
      vertexShader: noiseVert, fragmentShader: noiseFrag,
      wireframe: true, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const mesh1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 4), mat1);

    /* ── Middle icosahedron – brick red, counter-rotating ───────────────── */
    const mat2 = new THREE.MeshBasicMaterial({
      color: '#C04020', wireframe: true, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const mesh2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 2), mat2);

    /* ── Inner octahedron – bright amber, fast spin ─────────────────────── */
    const mat3 = new THREE.MeshBasicMaterial({
      color: '#FFB830', wireframe: true, transparent: true, opacity: 0.80,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const mesh3 = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 1), mat3);

    /* ── Glow sphere – soft ambient halo ────────────────────────────────── */
    const glowMat = new THREE.MeshBasicMaterial({
      color: '#D4961A', transparent: true, opacity: 0.04,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(3.2, 24, 24), glowMat);

    /* ── Spiral particle vortex ─────────────────────────────────────────── */
    const SPIRAL = 500;
    const sPos   = new Float32Array(SPIRAL * 3);
    const sCol   = new Float32Array(SPIRAL * 3);
    const cA = new THREE.Color('#D4961A');
    const cB = new THREE.Color('#B54E2A');
    for (let i = 0; i < SPIRAL; i++) {
      const t      = i / SPIRAL;
      const angle  = t * Math.PI * 14;          // 7 full spirals
      const radius = 0.6 + t * 3.2;
      const height = (t - 0.5) * 5.5;
      sPos[i*3]     = radius * Math.cos(angle);
      sPos[i*3 + 1] = height;
      sPos[i*3 + 2] = radius * Math.sin(angle);
      const c = cA.clone().lerp(cB, t);
      sCol[i*3] = c.r; sCol[i*3+1] = c.g; sCol[i*3+2] = c.b;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute('color',    new THREE.BufferAttribute(sCol, 3));
    const spiral = new THREE.Points(sGeo, new THREE.PointsMaterial({
      size: 0.045, vertexColors: true,
      transparent: true, opacity: 0.75,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));

    /* ── Ambient particle cloud ─────────────────────────────────────────── */
    const CLOUD = 300;
    const cPos  = new Float32Array(CLOUD * 3);
    for (let i = 0; i < CLOUD; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.8 + Math.random() * 2.5;
      cPos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
      cPos[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      cPos[i*3 + 2] = r * Math.cos(phi);
    }
    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
    const cloud = new THREE.Points(cloudGeo, new THREE.PointsMaterial({
      color: '#D4961A', size: 0.032,
      transparent: true, opacity: 0.45,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));

    /* ── Group ──────────────────────────────────────────────────────────── */
    const group = new THREE.Group();
    group.add(glow, mesh1, mesh2, mesh3, spiral, cloud);
    scene.add(group);

    /* ── Mouse ──────────────────────────────────────────────────────────── */
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 1.4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * -0.9;
    }, { passive: true });

    /* ── Scroll fade ────────────────────────────────────────────────────── */
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    /* ── Loop ───────────────────────────────────────────────────────────── */
    let raf, t0 = 0;
    function animate(ts) {
      raf = requestAnimationFrame(animate);
      const dt = Math.min((ts - t0) / 1000, 0.05);
      t0 = ts;

      mat1.uniforms.uTime.value = ts * 0.0004;

      // Outer: slow drift + mouse
      mesh1.rotation.y += dt * 0.22 + (mouseX * 0.28 - mesh1.rotation.y) * 0.028;
      mesh1.rotation.x += (mouseY * 0.20 - mesh1.rotation.x) * 0.028;

      // Middle: counter-rotation
      mesh2.rotation.y -= dt * 0.58;
      mesh2.rotation.x += dt * 0.35;

      // Inner: fast + different axis
      mesh3.rotation.y += dt * 1.4;
      mesh3.rotation.z -= dt * 0.9;

      // Spiral: slow spin + slight tilt from mouse
      spiral.rotation.y += dt * 0.14;
      spiral.rotation.x += (mouseY * 0.08 - spiral.rotation.x) * 0.02;

      // Cloud: gentle counter-drift
      cloud.rotation.y -= dt * 0.07;
      cloud.rotation.z += dt * 0.03;

      // Breathing scale on outer
      const breath = 1 + 0.028 * Math.sin(ts * 0.0009);
      mesh1.scale.setScalar(breath);
      glow.scale.setScalar(breath * 1.1);

      // Scroll fade-out
      const heroH = document.getElementById('hero').offsetHeight;
      canvas.style.opacity = Math.max(0, 0.92 - (scrollY / heroH) * 1.6);

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else                  raf = requestAnimationFrame(animate);
    });

    } catch (err) {
      console.error('Hero-3D-Animation Fehler:', err);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     GSAP SCROLL ANIMATIONS – Timings korrigiert (start: 'top 72%')
  ══════════════════════════════════════════════════════════════════════════════ */

  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero – gestaffelt beim Laden */
    gsap.from('.trust-badge-row span', {
      opacity: 0, y: 18, duration: 0.65, stagger: 0.1, delay: 0.5, ease: 'power2.out',
    });
    gsap.from('.hero-content h1', {
      opacity: 0, y: 35, duration: 1.0, delay: 0.25, ease: 'power3.out',
    });
    gsap.from('.hero-subline', {
      opacity: 0, y: 22, duration: 0.85, delay: 0.6, ease: 'power2.out',
    });
    gsap.from('.btn-hero', {
      opacity: 0, y: 18, scale: 0.93, duration: 0.75, delay: 0.95, ease: 'back.out(1.6)',
    });

    /* Leistungen – Karten von links/rechts */
    const cards = document.querySelectorAll('.leistung-card');
    if (cards[0]) gsap.from(cards[0], {
      scrollTrigger: { trigger: '#leistungen', start: 'top 68%', once: true },
      opacity: 0, x: -60, duration: 0.9, ease: 'power2.out',
    });
    if (cards[1]) gsap.from(cards[1], {
      scrollTrigger: { trigger: '#leistungen', start: 'top 68%', once: true },
      opacity: 0, x: 60, duration: 0.9, delay: 0.12, ease: 'power2.out',
    });
    gsap.from('#leistungen .section-title', {
      scrollTrigger: { trigger: '#leistungen', start: 'top 75%', once: true },
      opacity: 0, y: 30, duration: 0.75, ease: 'power2.out',
    });

    /* Über uns */
    gsap.from('.ueber-uns-text', {
      scrollTrigger: { trigger: '#ueber-uns', start: 'top 70%', once: true },
      opacity: 0, x: -50, duration: 0.9, ease: 'power2.out',
    });
    gsap.from('.person-card', {
      scrollTrigger: { trigger: '.ueber-uns-personen', start: 'top 72%', once: true },
      opacity: 0, x: 50, duration: 0.8, stagger: 0.18, ease: 'power2.out',
    });
    gsap.from('.stat', {
      scrollTrigger: { trigger: '.stats-row', start: 'top 75%', once: true },
      opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power2.out',
    });
    gsap.from('.stat strong', {
      scrollTrigger: { trigger: '.stats-row', start: 'top 75%', once: true },
      scale: 0.4, duration: 0.6, stagger: 0.12, delay: 0.1, ease: 'back.out(1.7)',
    });

    /* Referenzen – 2×2 Grid staggered */
    gsap.from('#referenzen .section-title', {
      scrollTrigger: { trigger: '#referenzen', start: 'top 72%', once: true },
      opacity: 0, y: 28, duration: 0.75, ease: 'power2.out',
    });
    gsap.from('.referenz-item', {
      scrollTrigger: { trigger: '.referenzen-grid', start: 'top 72%', once: true },
      opacity: 0, y: 55, scale: 0.96,
      duration: 0.8,
      stagger: { amount: 0.5, grid: [2, 2], from: 'start' },
      ease: 'power2.out',
    });

    /* Kontakt */
    gsap.from('#kontakt .section-title', {
      scrollTrigger: { trigger: '#kontakt', start: 'top 72%', once: true },
      opacity: 0, y: 28, duration: 0.75, ease: 'power2.out',
    });
    gsap.from('.kontakt-info', {
      scrollTrigger: { trigger: '.kontakt-grid', start: 'top 72%', once: true },
      opacity: 0, x: -45, duration: 0.85, ease: 'power2.out',
    });
    gsap.from('.kontakt-form', {
      scrollTrigger: { trigger: '.kontakt-grid', start: 'top 72%', once: true },
      opacity: 0, x: 45, duration: 0.85, delay: 0.1, ease: 'power2.out',
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════════════════════════════════════════ */

  function initNav() {
    const nav    = document.getElementById('nav');
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        links.classList.toggle('open', !open);
      });
      links.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded', 'false');
          links.classList.remove('open');
        })
      );
    }

    document.querySelectorAll('a[href^="#"]').forEach(a =>
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 8,
          behavior: 'smooth',
        });
      })
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     KONTAKTFORMULAR – Web3Forms API
     Einrichtung: https://web3forms.com  →  Gratis API-Key per E-Mail anfordern
     Den Key unten bei ACCESS_KEY eintragen.
  ══════════════════════════════════════════════════════════════════════════════ */

  function initForm() {
    const form = document.getElementById('kontakt-form');
    if (!form) return;

    // ⚠️  API-Key von https://web3forms.com hier eintragen:
    const ACCESS_KEY = 'DEIN-WEB3FORMS-API-KEY';

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const btn  = form.querySelector('.btn-submit');
      const data = new FormData(form);

      btn.disabled    = true;
      btn.textContent = 'Wird gesendet …';

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key:  ACCESS_KEY,
            from_name:   'Pieper Dach Website',
            subject:     'Neue Anfrage – ' + (data.get('name') || 'unbekannt'),
            name:        data.get('name'),
            telefon:     data.get('telefon'),
            message:     data.get('nachricht'),
          }),
        });

        const json = await res.json();
        if (res.ok && json.success) {
          form.innerHTML = `
            <div class="form-success" role="alert">
              <strong>Vielen Dank für Ihre Anfrage!</strong>
              <p>Wir melden uns so schnell wie möglich bei Ihnen. Für dringende Anliegen rufen Sie uns gerne direkt an.</p>
            </div>`;
        } else {
          showError(btn);
        }
      } catch {
        showError(btn);
      }
    });

    function showError(btn) {
      btn.disabled    = false;
      btn.textContent = 'Anfrage senden →';
      let err = form.querySelector('.form-error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'form-error';
        err.setAttribute('role', 'alert');
        form.appendChild(err);
      }
      err.textContent = 'Fehler beim Senden. Bitte rufen Sie uns direkt an.';
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     COOKIE BANNER – DSGVO
  ══════════════════════════════════════════════════════════════════════════════ */

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const KEY = 'pieper_cookie_consent';

    // Zeige Banner wenn noch keine Entscheidung getroffen
    if (!localStorage.getItem(KEY)) {
      requestAnimationFrame(() => banner.classList.add('visible'));
    }

    document.getElementById('cookie-accept').addEventListener('click', () => {
      localStorage.setItem(KEY, 'all');
      hideBanner();
    });

    document.getElementById('cookie-necessary').addEventListener('click', () => {
      localStorage.setItem(KEY, 'necessary');
      hideBanner();
    });

    function hideBanner() {
      banner.classList.remove('visible');
      banner.addEventListener('transitionend', () => banner.setAttribute('hidden', ''), { once: true });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initForm();
    initCookieBanner();

    if (!reducedMotion) {
      initHero3D();
      initScrollAnimations();
    } else {
      // Referenz-Labels bei reduced-motion immer sichtbar
      document.querySelectorAll('.referenz-label').forEach(el => {
        el.style.transform = 'translateY(0)';
      });
    }
  });

}());
