// Medium API Integration
const MEDIUM_USERNAME = 'tapos-datta';
const MEDIUM_RSS_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`;

// Blog Service
export class BlogService {
    constructor() {
        this.mediumRssUrl = MEDIUM_RSS_URL;
        this.postsPerPage = 5;
        this.currentPage = 1;
        this.allPosts = [];
        this.isLoading = false;
        this.placeholderImage = 'assets/images/placeholder_blog.webp';
    }

    async fetchPosts() {
        try {
            this.isLoading = true;
            console.log('Fetching Medium posts from:', this.mediumRssUrl);
            
            const response = await fetch(this.mediumRssUrl);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.status === 'ok' && Array.isArray(data.items)) {
                if (data.items.length === 0) {
                    console.log('No posts found in the feed');
                    throw new Error('No posts found in your Medium feed. Please check if you have published any articles.');
                }
                
                this.allPosts = await Promise.all(data.items.map(async post => {
                    // Try to get the best available image
                    const thumbnail = await this.getBestImage(post);
                    // Get up to 4 keywords
                    const keywords = this.extractKeywords(post);
                    
                    return {
                        title: post.title,
                        link: post.link,
                        date: new Date(post.pubDate),
                        content: post.description,
                        thumbnail: thumbnail,
                        categories: keywords
                    };
                }));
                
                console.log('Successfully processed posts:', this.allPosts.length);
                return this.getPaginatedPosts();
            } else {
                console.error('Invalid API response:', data);
                throw new Error(data.message || 'Failed to fetch blog posts');
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                let userMessage = 'Failed to load blog posts. ';
                if (error.message.includes('No posts found')) {
                    userMessage = 'No posts found in your Medium feed. Please check if you have published any articles.';
                } else if (error.message.includes('HTTP error')) {
                    userMessage = 'Unable to connect to Medium. Please check your internet connection and try again.';
                }
                errorMessage.textContent = userMessage;
                errorMessage.style.display = 'block';
            }
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async getBestImage(post) {
        try {
            // First try the thumbnail from Medium
            if (post.thumbnail && await this.isValidImage(post.thumbnail)) {
                console.log('Using thumbnail:', post.thumbnail);
                return post.thumbnail;
            }

            // Then try to extract from content
            const contentImage = this.extractThumbnailFromContent(post.content);
            if (contentImage && await this.isValidImage(contentImage)) {
                console.log('Using content image:', contentImage);
                return contentImage;
            }

            // Finally, try to get the first image from the post
            const firstImage = this.extractFirstImageFromContent(post.content);
            if (firstImage && await this.isValidImage(firstImage)) {
                console.log('Using first image:', firstImage);
                return firstImage;
            }

            console.log('Using placeholder image');
            return this.placeholderImage;
        } catch (error) {
            console.error('Error getting image:', error);
            return this.placeholderImage;
        }
    }

    async isValidImage(url) {
        try {
            if (!url || typeof url !== 'string') return false;
            
            // Check if URL is valid
            new URL(url);
            
            const response = await fetch(url, { 
                method: 'HEAD',
                mode: 'no-cors' // This allows checking cross-origin images
            });
            
            // If we can't check the content type (due to CORS), assume it's valid
            if (response.type === 'opaque') return true;
            
            return response.ok && response.headers.get('content-type')?.startsWith('image/');
        } catch (error) {
            console.error('Error validating image:', url, error);
            return false;
        }
    }

    extractThumbnailFromContent(content) {
        try {
            if (!content) return null;

            // Look for og:image or twitter:image meta tags first
            const metaMatch = content.match(/<meta[^>]+(?:og:image|twitter:image)[^>]+content="([^">]+)"/);
            if (metaMatch) {
                const url = metaMatch[1];
                console.log('Found meta image:', url);
                return url;
            }

            // Then look for the first image tag with src attribute
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
                const url = imgMatch[1];
                console.log('Found img tag image:', url);
                return url;
            }

            return null;
        } catch (e) {
            console.error('Error extracting thumbnail:', e);
            return null;
        }
    }

    extractFirstImageFromContent(content) {
        try {
            // Look for any image tag
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            return imgMatch ? imgMatch[1] : null;
        } catch (e) {
            console.error('Error extracting first image:', e);
            return null;
        }
    }

    extractKeywords(post) {
        try {
            // Get categories/tags from the post
            let keywords = post.categories || [];
            
            // If no categories, try to extract from content
            if (keywords.length === 0) {
                const content = post.content.toLowerCase();
                const commonKeywords = ['javascript', 'react', 'node', 'web', 'development', 'programming', 'coding', 'tech', 'tutorial', 'guide'];
                keywords = commonKeywords.filter(keyword => content.includes(keyword));
            }
            
            // Limit to 4 keywords and ensure they're unique
            return [...new Set(keywords)].slice(0, 4);
        } catch (e) {
            console.error('Error extracting keywords:', e);
            return ['Uncategorized'];
        }
    }

    getPaginatedPosts() {
        const start = 0;
        const end = this.currentPage * this.postsPerPage;
        return this.allPosts.slice(start, end);
    }

    hasMorePosts() {
        return this.currentPage * this.postsPerPage < this.allPosts.length;
    }

    loadMorePosts() {
        if (!this.isLoading && this.hasMorePosts()) {
            this.currentPage++;
            return this.getPaginatedPosts();
        }
        return [];
    }

    createBlogCard(post) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        
        const formattedDate = post.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        card.innerHTML = `
            <div class="blog-card-content">
                <div class="blog-card-image">
                    <img src="${post.thumbnail}" 
                         alt="${post.title}" 
                         loading="lazy"
                         onload="this.classList.add('loaded')"
                         onerror="this.onerror=null; this.src='${this.placeholderImage}'; this.classList.add('loaded');">
                </div>
                <div class="blog-card-text">
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="fas fa-calendar"></i>
                            <span class="date">${formattedDate}</span>
                        </span>
                        <div class="blog-categories">
                            ${post.categories.map(category => `
                                <span class="blog-category">${category}</span>
                            `).join('')}
                        </div>
                    </div>
                    <h3>${post.title}</h3>
                    <p class="blog-excerpt">${this.extractExcerpt(post.content)}</p>
                    <a href="${post.link}" 
                       class="read-more" 
                       target="_blank" 
                       rel="noopener noreferrer">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;

        // Add animation delay based on index
        const index = Array.from(card.parentElement?.children || []).indexOf(card);
        card.style.animationDelay = `${(index + 1) * 0.1}s`;

        return card;
    }

    extractExcerpt(content) {
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.length > 150 
            ? plainText.substring(0, 150) + '...' 
            : plainText;
    }
}

// Export singleton instance
export const blogService = new BlogService(); 