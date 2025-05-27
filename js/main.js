// Import all component styles
import '../css/style.css';
import '../css/blog.css';

// Import component loader
import { initComponentLoader } from './components/componentLoader.js';

// Import all component initialization functions
import { initLoader } from './components/loader.js';
import { initNavigation } from './components/navigation.js';
import { initTabs } from './components/tabs.js';
import { initAnimations } from './components/animations.js';
import { initContactForm } from './components/contact.js';
import { initBlog } from './components/blog.js';

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First load all HTML components
        await initComponentLoader();
        
        // Initialize essential components first
        initLoader();
        initNavigation();
        initAnimations();

        // Initialize remaining components immediately
        initTabs();
        initContactForm();
        initBlog();

        console.log('Portfolio website initialized');
    } catch (error) {
        console.error('Error initializing website:', error);
    }
}); 