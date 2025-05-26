// Component Loader
export class ComponentLoader {
    constructor() {
        this.components = {
            'loader-container': 'components/loader.html',
            'social-sidebar-container': 'components/social-sidebar.html',
            'header-container': 'components/header.html',
            'hero-container': 'components/hero.html',
            'about-container': 'components/about.html',
            'technologies-container': 'components/technologies.html',
            'experience-container': 'components/experience.html',
            'education-container': 'components/education.html',
            'projects-container': 'components/projects.html',
            'publications-container': 'components/publications.html',
            'contact-container': 'components/contact.html',
            'footer-container': 'components/footer.html'
        };
    }

    async loadComponents() {
        // First load essential components (header and hero)
        const essentialComponents = ['header-container', 'hero-container'];
        await Promise.all(essentialComponents.map(async (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            try {
                const response = await fetch(this.components[containerId]);
                if (!response.ok) throw new Error(`Failed to load ${this.components[containerId]}`);
                const html = await response.text();
                container.innerHTML = html;
            } catch (error) {
                console.error(`Error loading component ${this.components[containerId]}:`, error);
                container.innerHTML = `<div class="error">Failed to load component</div>`;
            }
        }));

        // Then load the rest of the components
        const remainingComponents = Object.entries(this.components)
            .filter(([containerId]) => !essentialComponents.includes(containerId));

        const loadPromises = remainingComponents.map(async ([containerId, componentPath]) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            try {
                const response = await fetch(componentPath);
                if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
                const html = await response.text();
                container.innerHTML = html;
            } catch (error) {
                console.error(`Error loading component ${componentPath}:`, error);
                container.innerHTML = `<div class="error">Failed to load component</div>`;
            }
        });

        await Promise.all(loadPromises);
        console.log('All components loaded');
    }
}

// Export initialization function
export function initComponentLoader() {
    const loader = new ComponentLoader();
    return loader.loadComponents();
} 