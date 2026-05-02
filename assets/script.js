document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navbar = document.querySelector('.navbar');
    const backToTopButton = document.querySelector('.back-to-top');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const expanded = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', expanded);
        });

        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !hamburger.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

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
