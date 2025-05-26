// Animations Component
export class Animations {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal, .fade-in');
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.initIntersectionObserver();
        } else {
            // Fallback for browsers without IntersectionObserver
            this.initScrollRevealFallback();
        }
    }

    initIntersectionObserver() {
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        this.revealElements.forEach(el => {
            this.observer.observe(el);
        });
    }

    initScrollRevealFallback() {
        // Fallback: reveal elements on scroll
        const revealOnScroll = () => {
            this.revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.85) {
                    el.classList.add('visible');
                }
            });
        };
        window.addEventListener('scroll', revealOnScroll);
        window.addEventListener('resize', revealOnScroll);
        revealOnScroll();
    }
}

// Export initialization function
export function initAnimations() {
    new Animations();
}
