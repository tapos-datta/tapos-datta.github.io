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
        this.isTransitioning = false;

        this.init();
    }

    async navigateToPage(targetPage, hash = '') {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Navigate to target page immediately
        const targetUrl = hash ? `${targetPage}#${hash}` : targetPage;
        window.location.href = targetUrl;
    }

    async navigateToSection(targetSection) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // If we're on blog.html, navigate to index.html first
        if (this.currentPage === 'blog.html') {
            await this.navigateToPage('index.html', targetSection.id);
            return;
        }

        // For sections on the same page, scroll smoothly
        const headerHeight = this.header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update URL without page reload
        history.pushState(null, '', `#${targetSection.id}`);

        // Reset transition state
        this.isTransitioning = false;
    }

    initSectionLinks() {
        this.sectionLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const [page, hash] = href.split('#');

                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }

                // If we're navigating to a different page
                if (page && page !== this.currentPage) {
                    await this.navigateToPage(page, hash);
                    return;
                }

                // If we're navigating to a section
                if (hash) {
                    const targetSection = document.querySelector(`#${hash}`);
                    if (targetSection) {
                        await this.navigateToSection(targetSection);
                    }
                }
            });
        });
    }

    initLogoLink() {
        if (this.logoLink) {
            this.logoLink.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }

                // Always navigate to index.html
                if (this.currentPage !== 'index.html') {
                    await this.navigateToPage('index.html');
                } else {
                    // If already on index.html, scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    // Remove hash from URL
                    history.pushState(null, '', window.location.pathname);
                }
            });
        }
    }

    initScrollHandler() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDelta = currentScrollY - lastScrollY;
                    const headerHeight = this.header.offsetHeight;

                    // Show header when scrolling up or at the top
                    if (currentScrollY <= headerHeight || scrollDelta < 0) {
                        this.header.classList.remove('header-hidden');
                    } 
                    // Hide header when scrolling down and past header height
                    else if (scrollDelta > 0 && currentScrollY > headerHeight) {
                        this.header.classList.add('header-hidden');
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });

                ticking = true;
            }
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
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }

                // Handle blog navigation
                if (href === 'blog.html') {
                    await this.navigateToPage('blog.html');
                    return;
                }

                // Handle section navigation
                if (href.startsWith('#')) {
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        await this.navigateToSection(targetSection);
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

    init() {
        // Initialize event listeners
        this.initScrollHandler();
        this.initMobileMenu();
        this.initNavLinks();
        this.initLogoLink();
        this.initSectionLinks();

        // Handle initial navigation if coming from another page
        if (window.location.hash) {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                // Add a small delay to ensure the page is fully loaded
                setTimeout(() => {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }
}

// Export initialization function
export function initNavigation() {
    new Navigation();
}
