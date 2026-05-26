async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error('Failed to load component');
        const html = await response.text();
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const prefix = window.location.pathname.includes('/about/') || window.location.pathname.includes('/services/') || window.location.pathname.includes('/gallery/') || window.location.pathname.includes('/contact/') ? '../' : './';
    const compVersion = '?v=1.4';
    
    Promise.all([
        loadComponent('navbar-placeholder', prefix + 'components/navbar.html' + compVersion),
        loadComponent('footer-placeholder', prefix + 'components/footer.html' + compVersion),
        loadComponent('whatsapp-placeholder', prefix + 'components/whatsapp-button.html' + compVersion)
    ]).then(() => {
        
        const fixPaths = (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.querySelectorAll('a').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/')) {
                    link.setAttribute('href', prefix + href.substring(1));
                }
            });
            
            container.querySelectorAll('img').forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.startsWith('/')) {
                    img.setAttribute('src', prefix + src.substring(1));
                }
            });
        };

        fixPaths('navbar-placeholder');
        fixPaths('footer-placeholder');

        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach((element, index) => {
                element.style.transitionDelay = `${(index % 5) * 0.1}s`;
                observer.observe(element);
            });
        }, 500);

        const handleFormSubmit = (formId) => {
            const form = document.getElementById(formId);
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                try {
                    const formData = new FormData(form);
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        
                        form.innerHTML = `
                            <div class="thank-you-msg" style="text-align: center; padding: 2rem 1rem; animation: fadeIn 0.5s ease-out;">
                                <i class="fas fa-circle-check" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1.5rem;"></i>
                                <h3 style="color: var(--text-primary); font-family: var(--font-serif); font-style: italic; font-size: 2rem; margin-bottom: 1rem;">Thank You!</h3>
                                <p style="color: var(--text-secondary); opacity: 0.9;">Your inquiry has been received. We'll get back to you shortly.</p>
                                <button type="button" class="btn-outline-editorial" style="margin-top: 1.5rem; font-size: 0.8rem;" onclick="window.location.reload()">Send Another</button>
                            </div>
                        `;
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Oops! Something went wrong. Please try again or contact us via WhatsApp.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
        };

        handleFormSubmit('contact-form-home');
        handleFormSubmit('contact-form-page');
    });
});
