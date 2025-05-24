// Loader - immediately hide
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    loader.style.display = 'none';
});

// Clear the session storage when the user closes the tab/window
window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('hasLoaded');
});

// Function to handle navigation
function handleNavigation(e, href) {
    e.preventDefault();
    const targetId = href.includes('#') ? href.split('#')[1] : href;
    
    if (href.startsWith('index.html')) {
        // If navigating to index.html, let the default behavior handle it
        window.location.href = href;
        return;
    }
    
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Update URL hash without scrolling
        history.pushState(null, null, `#${targetId}`);
    }
}

// Function to initialize navigation
function initializeNavigation() {
    // Handle all navigation links
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => handleNavigation(e, anchor.getAttribute('href')));
    });
}

// Function to handle hash-based navigation on page load
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const targetId = hash.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Function to initialize experience tabs
function initializeExperienceTabs() {
    console.log('Attempting to initialize experience tabs...');
    
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab panels:', tabPanels.length);
    
    if (tabButtons.length === 0 || tabPanels.length === 0) {
        console.log('Tab elements not found, will retry in 100ms...');
        setTimeout(initializeExperienceTabs, 100);
        return;
    }
    
    // Remove any existing click handlers from buttons
    tabButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Get fresh references after cloning
    const freshTabButtons = document.querySelectorAll('.tab-button');
    const freshTabPanels = document.querySelectorAll('.tab-panel');
    
    console.log('Initializing tab click handlers...');
    freshTabButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            console.log('Tab clicked:', index);
            e.preventDefault();
            
            // Remove active class from all buttons and panels
            freshTabButtons.forEach(btn => btn.classList.remove('active'));
            freshTabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            freshTabPanels[index].classList.add('active');
            
            // Log the state change
            console.log(`Activated tab ${index}: ${button.textContent.trim()}`);
        });
        
        // Log the click handler attachment
        console.log(`Click handler attached to tab ${index}: ${button.textContent.trim()}`);
    });
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initializeNavigation();
    
    // Handle hash-based navigation
    handleHashNavigation();
    
    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Listen for component loaded events
    document.addEventListener('componentLoaded', (event) => {
        console.log(`Component loaded: ${event.detail.componentName}`);
        if (event.detail.componentName === 'experience') {
            console.log('Experience component loaded, initializing tabs...');
            initializeExperienceTabs();
        }
        // Reinitialize navigation after components are loaded
        initializeNavigation();
    });

    // Initialize section animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(section);
    });
});

// Handle hash changes after page load
window.addEventListener('hashchange', handleHashNavigation);

// Handle link clicks for navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href');
        
        // Handle section links from blog page
        if (window.location.pathname.endsWith('blog.html') && href?.includes('index.html#')) {
            e.preventDefault();
            const section = href.split('#')[1];
            window.location.href = `index.html#${section}`;
            return;
        }

        // Handle hash links on index page
        if (window.location.pathname.endsWith('index.html') && href?.startsWith('#')) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', href);
            }
            return;
        }
    }
}); 