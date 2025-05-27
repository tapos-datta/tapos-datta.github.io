// Blog Component
import { blogService } from '../services/blogService.js';

export class Blog {
    constructor() {
        this.blogGrid = document.getElementById('blogGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.isLoading = false;
        this.initialLoad = true;
    }

    async init() {
        try {
            if (this.initialLoad) {
                // Show loading state only on initial load
                this.showLoadingState();
                this.initialLoad = false;
            }
            
            // Fetch initial posts
            const posts = await blogService.fetchPosts();
            
            // Clear loading state
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
            this.showError('Failed to load blog posts. Please try again later.');
        }
    }

    showLoadingState() {
        const loadingCard = document.createElement('div');
        loadingCard.className = 'blog-card blog-loading';
        loadingCard.innerHTML = `
            <div class="blog-card-content">
                <div class="loading-spinner"></div>
                <p>Loading posts...</p>
            </div>
        `;
        this.blogGrid.innerHTML = '';
        this.blogGrid.appendChild(loadingCard);
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