document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Mobile Menu & Navigation
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Handle nav link clicks (close menu and smooth scroll)
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Close mobile menu if it's open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }

                // Handle smooth scrolling for hash links on the same page
                const href = this.getAttribute('href');
                const url = new URL(href, window.location.href);
                if (url.pathname === window.location.pathname && url.hash) {
                    e.preventDefault();
                    const target = document.querySelector(url.hash);
                    if (target) {
                        // Use a timeout to ensure menu is closed before scrolling
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 50);
                    }
                }
            });
        });
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // ============================================
    // Back to Top Button
    // ============================================
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // CTA Button - Link to Contact Page
    // ============================================
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (!button.hasAttribute('href') && button.type !== 'submit') {
            button.addEventListener('click', function() {
                window.location.href = 'contact.html';
            });
        }
    });

    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const originalFormHTML = contactForm.innerHTML;

        const setupContactFormListener = (form) => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = form.querySelector('input[name="name"]').value;
                const email = form.querySelector('input[name="email"]').value;
                const company = form.querySelector('input[name="company"]').value;
                const service = form.querySelector('select[name="service_type"]').value;
                const message = form.querySelector('textarea[name="message"]').value;
                
                if (!name || !email || !service || !message) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                const subject = `New Inquiry from ${name} - ${service}`;
                const body = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nService: ${service}\n\nMessage:\n${message}`;
                
                window.location.href = `mailto:ici.texh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                form.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <h3 style="color: var(--white); margin-bottom: 1rem;">Thank You!</h3>
                        <p style="color: var(--white); margin-bottom: 1rem;">Your message has been received. We'll get back to you within 24 hours.</p>
                        <button type="button" class="cta-button" id="resetForm">Send Another Message</button>
                    </div>
                `;
                
                document.getElementById('resetForm').addEventListener('click', function() {
                    form.innerHTML = originalFormHTML;
                    setupContactFormListener(form); // Re-attach listener to the restored form
                });
            });
        };

        setupContactFormListener(contactForm);
    }

    // ============================================
    // Price Tooltip on Mobile Scroll
    // ============================================
    if (window.matchMedia("(max-width: 768px)").matches) {
        const priceWrappers = document.querySelectorAll('.price-button-wrapper');
        let isScrolling;
        
        if (priceWrappers.length > 0) {
            // Function to show prices
            const showPrices = () => {
                priceWrappers.forEach(wrapper => wrapper.classList.add('show-price'));
            };

            // Initially show prices
            showPrices();

            window.addEventListener('scroll', () => {
                // Hide on scroll
                priceWrappers.forEach(wrapper => wrapper.classList.remove('show-price'));
                
                // Clear our timeout throughout the scroll
                window.clearTimeout(isScrolling);

                // Set a timeout to run after scrolling ends
                isScrolling = setTimeout(() => {
                    showPrices();
                }, 150); // Show 150ms after scroll stops
            }, { passive: true });
        }
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isExpanded = item.classList.contains('active');
                question.setAttribute('aria-expanded', String(!isExpanded));
                item.classList.toggle('active');
            });
        }
    });

    // ============================================
    // Active Navigation Link on Current Page
    // ============================================
    const updateActiveNav = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let currentSectionId = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('#')[0];
            const isCurrentPage = (linkPage === currentPage) || (linkPage === '' && currentPage === 'index.html');

            if (isCurrentPage) {
                if (link.hash === `#${currentSectionId}`) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                } else if (!currentSectionId && !link.hash) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            } else {
                link.classList.remove('active');
            }
        });
    };

    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // Interactive Gradient Background
    // ============================================
    
    if (typeof THREE !== 'undefined') {
        // TouchTexture class
        class TouchTexture {
            constructor() {
                this.size = 64;
                this.width = this.height = this.size;
                this.maxAge = 64;
                this.radius = 0.25 * this.size;
                this.speed = 1 / this.maxAge;
                this.trail = [];
                this.last = null;
                this.initTexture();
            }

            initTexture() {
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.ctx = this.canvas.getContext("2d");
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.texture = new THREE.Texture(this.canvas);
            }

            update() {
                this.clear();
                let speed = this.speed;
                for (let i = this.trail.length - 1; i >= 0; i--) {
                    const point = this.trail[i];
                    let f = point.force * speed * (1 - point.age / this.maxAge);
                    point.x += point.vx * f;
                    point.y += point.vy * f;
                    point.age++;
                    if (point.age > this.maxAge) {
                        this.trail.splice(i, 1);
                    } else {
                        this.drawPoint(point);
                    }
                }
                this.texture.needsUpdate = true;
            }

            clear() {
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            addTouch(point) {
                let force = 0;
                let vx = 0;
                let vy = 0;
                const last = this.last;
                if (last) {
                    const dx = point.x - last.x;
                    const dy = point.y - last.y;
                    if (dx === 0 && dy === 0) return;
                    const dd = dx * dx + dy * dy;
                    let d = Math.sqrt(dd);
                    vx = dx / d;
                    vy = dy / d;
                    force = Math.min(dd * 20000, 2.0);
                }
                this.last = { x: point.x, y: point.y };
                this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
            }

            drawPoint(point) {
                const pos = {
                    x: point.x * this.width,
                    y: (1 - point.y) * this.height
                };

                let intensity = 1;
                if (point.age < this.maxAge * 0.3) {
                    intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
                } else {
                    const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
                    intensity = -t * (t - 2);
                }
                intensity *= point.force;

                const radius = this.radius;
                let color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
                let offset = this.size * 5;
                this.ctx.shadowOffsetX = offset;
                this.ctx.shadowOffsetY = offset;
                this.ctx.shadowBlur = radius * 1;
                this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

                this.ctx.beginPath();
                this.ctx.fillStyle = "rgba(255,0,0,1)";
                this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // GradientBackground class
        class GradientBackground {
            constructor(sceneManager) {
                this.sceneManager = sceneManager;
                this.mesh = null;
                this.uniforms = {
                    uTime: { value: 0 },
                    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    uColor1: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
                    uColor2: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
                    uColor3: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
                    uColor4: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
                    uColor5: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
                    uColor6: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
                    uSpeed: { value: 1.2 },
                    uIntensity: { value: 1.8 },
                    uTouchTexture: { value: null },
                    uGrainIntensity: { value: 0.08 },
                    uZoom: { value: 1.0 },
                    uDarkNavy: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
                    uGradientSize: { value: 1.0 },
                    uGradientCount: { value: 6.0 },
                    uColor1Weight: { value: 1.0 },
                    uColor2Weight: { value: 1.0 }
                };
            }

            init() {
                const viewSize = this.sceneManager.getViewSize();
                const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);

                const material = new THREE.ShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                          vec3 pos = position.xyz;
                          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
                          vUv = uv;
                        }
                    `,
                    fragmentShader: `
                        uniform float uTime;
                        uniform vec2 uResolution;
                        uniform vec3 uColor1;
                        uniform vec3 uColor2;
                        uniform vec3 uColor3;
                        uniform vec3 uColor4;
                        uniform vec3 uColor5;
                        uniform vec3 uColor6;
                        uniform float uSpeed;
                        uniform float uIntensity;
                        uniform sampler2D uTouchTexture;
                        uniform float uGrainIntensity;
                        uniform float uZoom;
                        uniform vec3 uDarkNavy;
                        uniform float uGradientSize;
                        uniform float uGradientCount;
                        uniform float uColor1Weight;
                        uniform float uColor2Weight;
                        
                        varying vec2 vUv;
                        
                        #define PI 3.14159265359
                        
                        float grain(vec2 uv, float time) {
                          vec2 grainUv = uv * uResolution * 0.5;
                          float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
                          return grainValue * 2.0 - 1.0;
                        }
                        
                        vec3 getGradientColor(vec2 uv, float time) {
                          float gradientRadius = uGradientSize;
                          
                          vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
                          vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
                          vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
                          vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
                          vec2 center5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
                          vec2 center6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
                          
                          float dist1 = length(uv - center1);
                          float dist2 = length(uv - center2);
                          float dist3 = length(uv - center3);
                          float dist4 = length(uv - center4);
                          float dist5 = length(uv - center5);
                          float dist6 = length(uv - center6);
                          
                          float influence1 = 1.0 - smoothstep(0.0, gradientRadius, dist1);
                          float influence2 = 1.0 - smoothstep(0.0, gradientRadius, dist2);
                          float influence3 = 1.0 - smoothstep(0.0, gradientRadius, dist3);
                          float influence4 = 1.0 - smoothstep(0.0, gradientRadius, dist4);
                          float influence5 = 1.0 - smoothstep(0.0, gradientRadius, dist5);
                          float influence6 = 1.0 - smoothstep(0.0, gradientRadius, dist6);
                          
                          vec3 color = vec3(0.0);
                          color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
                          color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
                          color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
                          color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
                          color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
                          color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;
                          
                          color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;
                          
                          float luminance = dot(color, vec3(0.299, 0.587, 0.114));
                          color = mix(vec3(luminance), color, 1.35);
                          color = pow(color, vec3(0.92));
                          
                          float brightness1 = length(color);
                          float mixFactor1 = max(brightness1 * 1.2, 0.15);
                          color = mix(uDarkNavy, color, mixFactor1);
                          
                          float maxBrightness = 1.0;
                          float brightness = length(color);
                          if (brightness > maxBrightness) {
                            color = color * (maxBrightness / brightness);
                          }
                          
                          return color;
                        }
                        
                        void main() {
                          vec2 uv = vUv;
                          
                          // Fluid baseline distortion
                          uv.x += sin(uv.y * 5.0 + uTime * 0.4) * 0.05;
                          uv.y += cos(uv.x * 5.0 + uTime * 0.3) * 0.05;
                          
                          vec4 touchTex = texture2D(uTouchTexture, uv);
                          float vx = -(touchTex.r * 2.0 - 1.0);
                          float vy = -(touchTex.g * 2.0 - 1.0);
                          float intensity = touchTex.b;
                          
                          uv.x += vx * 0.8 * intensity;
                          uv.y += vy * 0.8 * intensity;
                          
                          vec2 center = vec2(0.5);
                          float dist = length(uv - center);
                          float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * intensity;
                          float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * intensity;
                          uv += vec2(ripple + wave);
                          
                          vec3 color = getGradientColor(uv, uTime);
                          
                          float grainValue = grain(uv, uTime);
                          color += grainValue * uGrainIntensity;
                          
                          float timeShift = uTime * 0.5;
                          color.r += sin(timeShift) * 0.02;
                          color.g += cos(timeShift * 1.4) * 0.02;
                          color.b += sin(timeShift * 1.2) * 0.02;
                          
                          float brightness2 = length(color);
                          float mixFactor2 = max(brightness2 * 1.2, 0.15);
                          color = mix(uDarkNavy, color, mixFactor2);
                          
                          color = clamp(color, vec3(0.0), vec3(1.0));
                          
                          float maxBrightness = 1.0;
                          float brightness = length(color);
                          if (brightness > maxBrightness) {
                            color = color * (maxBrightness / brightness);
                          }
                          
                          gl_FragColor = vec4(color, 1.0);
                        }
                    `
                });

                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.z = 0;
                this.sceneManager.scene.add(this.mesh);
            }

            update(delta) {
                if (this.uniforms.uTime) {
                    this.uniforms.uTime.value += delta;
                }
            }

            onResize(width, height) {
                const viewSize = this.sceneManager.getViewSize();
                if (this.mesh) {
                    this.mesh.geometry.dispose();
                    this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
                }
                if (this.uniforms.uResolution) {
                    this.uniforms.uResolution.value.set(width, height);
                }
            }
        }

        // App class
        class App {
            constructor() {
                this.renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    powerPreference: "high-performance",
                    alpha: false,
                    stencil: false,
                    depth: false
                });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.setAnimationLoop(null);
                
                // Set ID for styling and ensuring z-index
                this.renderer.domElement.id = "webGLApp";
                document.body.appendChild(this.renderer.domElement);

                this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
                this.camera.position.z = 50;
                
                // Match site dark navy background
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x0A0E27); 
                
                this.clock = new THREE.Clock();

                this.touchTexture = new TouchTexture();
                this.gradientBackground = new GradientBackground(this);
                this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;

                this.init();
            }

            init() {
                this.gradientBackground.init();
                
                // Default Scheme 1 logic inline
                const uniforms = this.gradientBackground.uniforms;
                uniforms.uColor1.value.set(0.945, 0.353, 0.133); // Orange
                uniforms.uColor2.value.set(0.039, 0.055, 0.153); // Navy
                uniforms.uColor3.value.set(0.945, 0.353, 0.133);
                uniforms.uColor4.value.set(0.039, 0.055, 0.153);
                uniforms.uColor5.value.set(0.945, 0.353, 0.133);
                uniforms.uColor6.value.set(0.039, 0.055, 0.153);
                
                uniforms.uDarkNavy.value.set(0.039, 0.055, 0.153);
                uniforms.uGradientSize.value = 0.85; // Increased for a fuller orange spread
                uniforms.uGradientCount.value = 12.0;
                uniforms.uSpeed.value = 1.5;
                uniforms.uColor1Weight.value = 1.5; // Boosted the orange color weight
                uniforms.uColor2Weight.value = 1.8;

                this.tick();

                window.addEventListener("resize", () => this.onResize());
                window.addEventListener("mousemove", (ev) => this.onMouseMove(ev));
                window.addEventListener("touchmove", (ev) => this.onTouchMove(ev));
            }

            onTouchMove(ev) {
                const touch = ev.touches[0];
                this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
            }

            onMouseMove(ev) {
                this.mouse = {
                    x: ev.clientX / window.innerWidth,
                    y: 1 - ev.clientY / window.innerHeight
                };
                this.touchTexture.addTouch(this.mouse);
            }

            getViewSize() {
                const fovInRadians = (this.camera.fov * Math.PI) / 180;
                const height = Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2);
                return { width: height * this.camera.aspect, height };
            }

            update(delta) {
                this.touchTexture.update();
                this.gradientBackground.update(delta);
            }

            render() {
                const delta = this.clock.getDelta();
                const clampedDelta = Math.min(delta, 0.1);
                this.renderer.render(this.scene, this.camera);
                this.update(clampedDelta);
            }

            tick() {
                this.render();
                requestAnimationFrame(() => this.tick());
            }

            onResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.gradientBackground.onResize(window.innerWidth, window.innerHeight);
            }
        }

        // Initialize the app
        const app = new App();
    }

    // ============================================
    // Hero Typewriter Effect
    // ============================================
    const startTypewriter = () => {
        const heroText = document.querySelector('.hero-content h1');
        if (heroText) {
            const text = heroText.textContent.trim();
            heroText.textContent = '';
            heroText.classList.add('typing-cursor');
            
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    heroText.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 100); // Speed: 100ms per character
                } else {
                    setTimeout(() => heroText.classList.remove('typing-cursor'), 3000);
                }
            };
            type();
        }
    };

    // ============================================
    // Loader Logic
    // ============================================
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-progress-bar');
    const loaderPercent = document.getElementById('loaderPercent');

    if (loader && loaderBar && loaderPercent) {
        let loadProgress = 0;
        // Run for exactly 5 seconds (5000ms)
        // Update every 50ms -> 100 steps -> 1% increment per step
        const loadInterval = setInterval(() => {
            loadProgress += 1;
            loaderBar.style.width = `${loadProgress}%`;
            loaderPercent.textContent = `${loadProgress}%`;

            if (loadProgress >= 100) {
                clearInterval(loadInterval);
                setTimeout(() => {
                    loader.classList.add('hidden');
                    startTypewriter(); // Start typing after loader finishes
                }, 500);
            }
        }, 50);
    } else {
        startTypewriter(); // Run immediately if no loader (e.g. other pages)
    }

    // ============================================
    // Electric Border Injection
    // ============================================
    const electrifyCards = () => {
        const selectors = [
            '.price-card',
            '.service-card',
            '.mission-card',
            '.vision-card',
            '.benefit-item',
            '.tech-item'
        ];

        const cards = document.querySelectorAll(selectors.join(', '));

        cards.forEach(card => {
            if (card.querySelector('.inner-container')) return;

            const originalContent = card.innerHTML;
            let color = 'cyan';

            if (card.classList.contains('price-card')) color = 'gold';
            else if (card.classList.contains('service-card')) color = 'cyan';
            else if (card.classList.contains('mission-card') || card.classList.contains('vision-card') || card.classList.contains('benefit-item')) color = 'green';
            else if (card.classList.contains('tech-item')) color = 'pink';

            card.classList.add('electric-card');
            card.setAttribute('data-color', color);

            card.innerHTML = `
                <div class="inner-container">
                    <div class="background-glow"></div>
                    <div class="glow-layer-1"></div>
                    <div class="glow-layer-2"></div>
                    <div class="border-outer"></div>
                    <div class="main-card"></div>
                </div>
                <div class="content-container">
                    ${originalContent}
                </div>
            `;
        });
    };

    electrifyCards();
});