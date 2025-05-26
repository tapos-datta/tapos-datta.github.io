// Blog Component
import { blogService } from '../services/blogService.js';

export class Blog {
    constructor() {
        this.blogGrid = document.getElementById('blogGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.isLoading = false;
    }

    async init() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Fetch initial posts
            const posts = await blogService.fetchPosts();
            
            // Clear loading state
            this.blogGrid.innerHTML = '';
            
            if (posts && posts.length > 0) {
                // Render posts
                posts.forEach(post => {
                    const card = blogService.createBlogCard(post);
                    this.blogGrid.appendChild(card);
                });

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
        this.blogGrid.innerHTML = `
            <div class="blog-card">
                <div class="blog-card-content">
                    <div class="blog-card-image">
                        <img src="assets/images/placeholder_blog.webp" alt="Loading..." loading="lazy">
                    </div>
                    <div class="blog-card-text">
                        <div class="blog-meta">
                            <span class="blog-date">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span class="date">Loading...</span>
                            </span>
                            <span class="blog-category">Loading...</span>
                        </div>
                        <h3>Loading blog posts...</h3>
                        <p class="blog-excerpt">Please wait while we fetch the latest articles.</p>
                    </div>
                </div>
            </div>
        `;
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
                newPosts.forEach(post => {
                    const card = blogService.createBlogCard(post);
                    this.blogGrid.appendChild(card);
                });

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
}

// Initialize blog component
export function initBlog() {
    const blog = new Blog();
    blog.init();
} 