// Tabs Component
export class Tabs {
    constructor() {
        this.tabList = document.querySelector('.tab-list');
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabPanels = document.querySelectorAll('.tab-panel');
        this.activeTabIndex = 0;

        this.init();
    }

    init() {
        if (this.tabList && this.tabButtons.length && this.tabPanels.length) {
            // Set initial active tab
            this.setActiveTab(this.activeTabIndex);

            // Add click event listeners to tab buttons
            this.tabButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    this.setActiveTab(index);
                });

                // Add keyboard navigation
                button.addEventListener('keydown', (e) => {
                    switch (e.key) {
                        case 'ArrowLeft':
                            e.preventDefault();
                            this.navigateTabs('prev');
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            this.navigateTabs('next');
                            break;
                        case 'Home':
                            e.preventDefault();
                            this.setActiveTab(0);
                            break;
                        case 'End':
                            e.preventDefault();
                            this.setActiveTab(this.tabButtons.length - 1);
                            break;
                    }
                });
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                this.handleResize();
            });

            // Initial resize handling
            this.handleResize();
        }
    }

    setActiveTab(index) {
        // Remove active class from all tabs and panels
        this.tabButtons.forEach(button => button.classList.remove('active'));
        this.tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to selected tab and panel
        this.tabButtons[index].classList.add('active');
        this.tabPanels[index].classList.add('active');

        // Update active tab index
        this.activeTabIndex = index;

        // Update ARIA attributes
        this.updateAriaAttributes();

        // Scroll active tab into view on mobile
        if (window.innerWidth <= 768) {
            this.tabButtons[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    navigateTabs(direction) {
        let newIndex = this.activeTabIndex;

        if (direction === 'prev') {
            newIndex = this.activeTabIndex > 0 ? this.activeTabIndex - 1 : this.tabButtons.length - 1;
        } else if (direction === 'next') {
            newIndex = this.activeTabIndex < this.tabButtons.length - 1 ? this.activeTabIndex + 1 : 0;
        }

        this.setActiveTab(newIndex);
        this.tabButtons[newIndex].focus();
    }

    updateAriaAttributes() {
        this.tabButtons.forEach((button, index) => {
            const isActive = index === this.activeTabIndex;
            const panelId = `tab-panel-${index + 1}`;
            const buttonId = `tab-button-${index + 1}`;

            // Set IDs if not already set
            if (!button.id) button.id = buttonId;
            if (!this.tabPanels[index].id) this.tabPanels[index].id = panelId;

            // Update ARIA attributes
            button.setAttribute('aria-selected', isActive);
            button.setAttribute('aria-controls', panelId);
            this.tabPanels[index].setAttribute('aria-labelledby', buttonId);
            this.tabPanels[index].setAttribute('aria-hidden', !isActive);
            this.tabPanels[index].setAttribute('tabindex', isActive ? 0 : -1);
        });

        // Update tablist role
        this.tabList.setAttribute('role', 'tablist');
        this.tabButtons.forEach(button => button.setAttribute('role', 'tab'));
        this.tabPanels.forEach(panel => panel.setAttribute('role', 'tabpanel'));
    }

    handleResize() {
        // Add horizontal scroll indicator on mobile
        if (window.innerWidth <= 768) {
            const isScrollable = this.tabList.scrollWidth > this.tabList.clientWidth;
            this.tabList.classList.toggle('scrollable', isScrollable);
        } else {
            this.tabList.classList.remove('scrollable');
        }
    }
}

// Export initialization function
export function initTabs() {
    new Tabs();
}
