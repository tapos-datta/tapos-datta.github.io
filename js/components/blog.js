// Blog Component
import { blogService } from '../services/blogService.js';

export class Blog {
    constructor() {
        this.blogGrid = document.getElementById('blogGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingIndicator = document.getElementById('blogLoadingIndicator');
        this.isLoading = false;
        this.initialLoad = true;
    }

    async init() {
        try {
            if (this.initialLoad) {
                // Show loading indicator before fetching data
                this.showLoadingIndicator();
                this.initialLoad = false;
            }
            
            // Fetch initial posts
            const posts = await blogService.fetchPosts();
            
            // Hide loading indicator
            this.hideLoadingIndicator();
            
            // Clear grid
            this.blogGrid.innerHTML = '';
            
            if (posts && posts.length > 0) {
                // Render posts
                await this.renderPosts(posts);

                // Show/hide load more button
                this.loadMoreBtn.style.display = blogService.hasMorePosts() ? 'block' : 'none';
                
                // Add load more event listener
                this.loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
            } else {
                this.showNoPostsMessage();
            }
        } catch (error) {
            console.error('Error initializing blog:', error);
            this.hideLoadingIndicator();
            this.showError('Failed to load blog posts. Please try again later.');
        }
    }

    showLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'flex';
        }
    }

    hideLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    showNoPostsMessage() {
        this.blogGrid.innerHTML = `
            <div class="blog-card">
                <div class="blog-card-content">
                    <div class="blog-card-text" style="width: 100%; text-align: center; padding: 3rem;">
                        <h3>No Posts Found</h3>
                        <p class="blog-excerpt">There are no blog posts available at the moment. Please check back later.</p>
                    </div>
                </div>
            </div>
        `;
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }
        this.showNoPostsMessage();
    }

    async loadMorePosts() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.loadMoreBtn.textContent = 'Loading...';
            this.loadMoreBtn.disabled = true;

            const newPosts = blogService.loadMorePosts();
            
            if (newPosts && newPosts.length > 0) {
                await this.renderPosts(newPosts);
                this.loadMoreBtn.style.display = blogService.hasMorePosts() ? 'block' : 'none';
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
            this.showError('Failed to load more posts. Please try again later.');
        } finally {
            this.isLoading = false;
            this.loadMoreBtn.textContent = 'Load More Posts';
            this.loadMoreBtn.disabled = false;
        }
    }

    async renderPosts(posts) {
        // Create a document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Add each post with animation
        for (const post of posts) {
            const card = blogService.createBlogCard(post);
            fragment.appendChild(card);
        }
        
        // Add all posts at once
        this.blogGrid.appendChild(fragment);

        // Trigger animation for each card
        const cards = this.blogGrid.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('loaded');
            }, (index + 1) * 100);
        });
    }
}

// Initialize blog component
export function initBlog() {
    const blog = new Blog();
    blog.init();
} 