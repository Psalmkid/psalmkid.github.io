document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navbar = document.querySelector('.navbar');
    const backToTopButton = document.querySelector('.back-to-top');
    const mobileBreakpoint = window.matchMedia('(max-width: 960px)');

    if (hamburger && navMenu) {
        const closeMobileMenu = () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        };

        const openMobileMenu = () => {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            if (mobileBreakpoint.matches) {
                document.body.classList.add('menu-open');
            }
        };

        hamburger.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
                return;
            }
            openMobileMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        mobileBreakpoint.addEventListener('change', () => {
            if (!mobileBreakpoint.matches) {
                closeMobileMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !hamburger.contains(event.target) && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    event.preventDefault();
                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    } else {
        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    event.preventDefault();
                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    const revealTargets = document.querySelectorAll(
        '.impact-card, .service-card, .feature-item, .price-card, .contact-card, .contact-form-card, .faq-item, .testimonial-card, .stat-block, .hero-panel-card, .credibility-item'
    );

    revealTargets.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
    });

    if ('IntersectionObserver' in window && revealTargets.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.18,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealTargets.forEach((element) => revealObserver.observe(element));
    } else {
        revealTargets.forEach((element) => element.classList.add('is-visible'));
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 40;
        navbar?.classList.toggle('scrolled', scrolled);
        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', window.scrollY > 400);
        }
    }, { passive: true });

    backToTopButton?.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!expanded));
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const originalFormHTML = contactForm.innerHTML;
        const setupListener = (form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const name = form.querySelector('input[name="name"]')?.value.trim();
                const email = form.querySelector('input[name="email"]')?.value.trim();
                const message = form.querySelector('textarea[name="message"]')?.value.trim();
                if (!name || !email || !message) {
                    alert('Please complete all required fields.');
                    return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                const subject = `New inquiry from ${name}`;
                const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;
                window.location.href = `mailto:ici.texh@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
                form.innerHTML = `
                    <div style="text-align:center; padding:2rem;">
                        <h3 style="color:#fff; margin-bottom:1rem;">Thank you!</h3>
                        <p style="color:#fff; margin-bottom:1rem;">Your message has been prepared in your email client. We'll review it within 24 hours.</p>
                        <button type="button" class="cta-button" id="resetForm">Send another message</button>
                    </div>
                `;
                document.getElementById('resetForm')?.addEventListener('click', () => {
                    form.innerHTML = originalFormHTML;
                    setupListener(form);
                });
            });
        };
        setupListener(contactForm);
    }
});
