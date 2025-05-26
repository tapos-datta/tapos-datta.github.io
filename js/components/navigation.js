// Navigation Component
export class Navigation {
    constructor() {
        this.header = document.querySelector('header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.logoLink = document.querySelector('.logo.nav-link');
        this.sectionLinks = document.querySelectorAll('.section-link');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.lastScrollY = window.scrollY;
        this.isMenuOpen = false;
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';

        this.init();
    }

    init() {
        // Initialize event listeners
        this.initScrollHandler();
        this.initMobileMenu();
        this.initNavLinks();
        this.initLogoLink();
        this.initSectionLinks();

        // Handle initial navigation if coming from blog.html
        if (document.referrer.includes('blog.html')) {
            const hash = window.location.hash;
            if (hash) {
                setTimeout(() => {
                    const targetSection = document.querySelector(hash);
                    if (targetSection) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        // Remove hash from URL after scrolling
                        history.pushState("", document.title, window.location.pathname);
                    }
                }, 100);
            }
        }
    }

    initSectionLinks() {
        this.sectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const [page, hash] = href.split('#');
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';

                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }

                // If we're on blog.html, handle navigation differently
                if (currentPage === 'blog.html') {
                    e.preventDefault();
                    // Use replaceState to prevent adding to browser history
                    history.replaceState(null, '', 'index.html');
                    window.location.href = 'index.html';
                    // After navigation, scroll to the section
                    setTimeout(() => {
                        const targetSection = document.querySelector(`#${hash}`);
                        if (targetSection) {
                            const headerHeight = this.header.offsetHeight;
                            const targetPosition = targetSection.offsetTop - headerHeight;
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 100);
                    return;
                }

                // If we're on a different page, navigate to index.html first
                if (page && page !== currentPage) {
                    window.location.href = href;
                    return;
                }

                // Remove hash from URL
                history.pushState("", document.title, window.location.pathname);

                // Scroll to section
                const targetSection = document.querySelector(`#${hash}`);
                if (targetSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initLogoLink() {
        if (this.logoLink) {
            this.logoLink.addEventListener('click', (e) => {
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // If we're already on index.html, prevent default and scroll to top
                if (this.currentPage === 'index.html') {
                    e.preventDefault();
                    // Remove any existing hash from URL
                    history.pushState("", document.title, window.location.pathname);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                // Otherwise, let the default navigation happen to go to index.html
            });
        }
    }

    initScrollHandler() {
        window.addEventListener('scroll', () => {
            // Handle header visibility on scroll
            if (window.scrollY > this.lastScrollY && window.scrollY > 100) {
                this.header.classList.add('header-hidden');
            } else {
                this.header.classList.remove('header-hidden');
            }

            this.lastScrollY = window.scrollY;
        });
    }

    initMobileMenu() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && !this.mobileMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu when pressing escape key
            document.addEventListener('keydown', (e) => {
                if (this.isMenuOpen && e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }

    initNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }

                // Handle blog page navigation
                if (href === 'blog.html') {
                    return;
                }

                // Handle section navigation
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        // If we're on blog.html, navigate to index.html first
                        if (this.currentPage === 'blog.html') {
                            e.preventDefault();
                            // Use replaceState to prevent adding to browser history
                            history.replaceState(null, '', 'index.html');
                            window.location.href = 'index.html';
                            // After navigation, scroll to the section
                            setTimeout(() => {
                                const headerHeight = this.header.offsetHeight;
                                const targetPosition = targetSection.offsetTop - headerHeight;
                                window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth'
                                });
                            }, 100);
                            return;
                        }

                        // Remove hash from URL
                        history.pushState("", document.title, window.location.pathname);
                        
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenuBtn.classList.add('active');
        this.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isMenuOpen = true;
    }

    closeMobileMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        this.isMenuOpen = false;
    }
}

// Export initialization function
export function initNavigation() {
    new Navigation();
}
