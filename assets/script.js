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
        if (priceWrappers.length > 0) {
            const priceObserverOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.8
            };

            const priceObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show-price');
                        observer.unobserve(entry.target);
                    }
                });
            }, priceObserverOptions);

            priceWrappers.forEach(wrapper => {
                priceObserver.observe(wrapper);
            });
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
});

// ============================================
// Smooth Scroll Behavior on Page Load
// ============================================

window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(function() {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
});
