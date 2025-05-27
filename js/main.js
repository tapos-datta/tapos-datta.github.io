// Import styles using Vite's CSS handling
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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First load all components
        await initComponentLoader();
        
        // Then initialize other components
        initLoader();
        initNavigation();
        initAnimations();
        initTabs();
        initContactForm();
        
        // Initialize blog if on blog page
        if (document.getElementById('blogGrid')) {
            initBlog();
        }
        
        // Show main content
        document.body.classList.add('loaded');
        
    } catch (error) {
        console.error('Error initializing application:', error);
        // Show error state to user
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 0, 0, 0.1); padding: 20px; border-radius: 8px; text-align: center;';
        errorMessage.innerHTML = `
            <h2 style="color: #ff4444;">Error Loading Page</h2>
            <p>Please refresh the page or try again later.</p>
            <p style="font-size: 0.8em; color: #666;">${error.message}</p>
        `;
        document.body.appendChild(errorMessage);
    }
});

// Handle any unhandled errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
}); 