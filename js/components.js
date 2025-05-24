// Function to show loader
function showLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'flex';
        loader.style.opacity = '1';
    }
}

// Function to hide loader
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// Function to load a component
async function loadComponent(componentName, targetId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.innerHTML = html;
            
            // Dispatch a custom event when component is loaded
            const event = new CustomEvent('componentLoaded', {
                detail: { componentName, targetId }
            });
            document.dispatchEvent(event);

            // Special handling for experience component
            if (componentName === 'experience') {
                setTimeout(() => {
                    if (typeof initializeExperienceTabs === 'function') {
                        initializeExperienceTabs();
                    }
                }, 100);
            }
        }
    } catch (error) {
        console.error(`Failed to load ${componentName}: ${error.message}`);
    }
}

// Function to get current section from hash
function getCurrentSection() {
    const hash = window.location.hash.slice(1) || 'home';
    return hash;
}

// Function to load all components
async function loadAllComponents() {
    showLoader();
    const currentSection = getCurrentSection();

    try {
        // Load common components for all sections
        const commonComponents = [
            ['loader', 'loader-container'],
            ['social-sidebar', 'social-sidebar-container'],
            ['header', 'header-container'],
            ['footer', 'footer-container']
        ];

        await Promise.all(commonComponents.map(([name, id]) => loadComponent(name, id)));

        // Load home section specific components
        const homeComponents = [
            ['hero', 'hero-container'],
            ['about', 'about-container'],
            ['technologies', 'technologies-container'],
            ['experience', 'experience-container'],
            ['education', 'education-container'],
            ['projects', 'projects-container'],
            ['publications', 'publications-container'],
            ['contact', 'contact-container']
        ];
        await Promise.all(homeComponents.map(([name, id]) => loadComponent(name, id)));

        // Hide loader after all components are loaded
        setTimeout(hideLoader, 500);
    } catch (error) {
        console.error(`Failed to load components: ${error.message}`);
        hideLoader();
    }
}

// Load components when the DOM is ready
document.addEventListener('DOMContentLoaded', loadAllComponents);

// Handle hash changes
window.addEventListener('hashchange', loadAllComponents);

// Handle link clicks for navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href');
        // Handle index.html#section links
        if (href?.startsWith('index.html#')) {
            e.preventDefault();
            const section = href.split('#')[1];
            window.location.hash = section;
            return;
        }
    }
}); 