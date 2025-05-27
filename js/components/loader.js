// Loader Component
export class Loader {
    constructor() {
        this.loader = document.querySelector('.loader');
        this.loaderText = document.querySelector('.loader-text');
        this.loaderProgress = document.querySelector('.loader-progress');
        this.minLoadingTime = 1000; // Minimum loading time in milliseconds
        this.startTime = Date.now();

        this.init();
    }

    init() {
        if (this.loader) {
            // Hide loader when all resources are loaded
            window.addEventListener('load', () => {
                this.handleLoadComplete();
            });

            // Fallback in case load event doesn't fire
            setTimeout(() => {
                if (this.loader.classList.contains('active')) {
                    this.handleLoadComplete();
                }
            }, 5000); // 5 seconds fallback

            // Initialize progress animation
            this.initProgressAnimation();
        }
    }

    initProgressAnimation() {
        if (this.loaderProgress) {
            let progress = 0;
            const interval = setInterval(() => {
                // Simulate progress up to 90%
                if (progress < 90) {
                    progress += Math.random() * 10;
                    this.updateProgress(progress);
                } else {
                    clearInterval(interval);
                }
            }, 200);
        }
    }

    updateProgress(progress) {
        if (this.loaderProgress) {
            const roundedProgress = Math.min(Math.round(progress), 100);
            this.loaderProgress.style.width = `${roundedProgress}%`;
            
            if (this.loaderText) {
                this.loaderText.textContent = `Loading... ${roundedProgress}%`;
            }
        }
    }

    handleLoadComplete() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);

        // Ensure minimum loading time
        setTimeout(() => {
            // Complete progress animation
            this.updateProgress(100);

            // Add fade-out class
            this.loader.classList.add('fade-out');

            // Remove loader from DOM after animation
            setTimeout(() => {
                this.loader.remove();
                document.body.classList.remove('loading');
            }, 500); // Match the CSS transition duration
        }, remainingTime);
    }
}

// Export initialization function
export function initLoader() {
    new Loader();
}
