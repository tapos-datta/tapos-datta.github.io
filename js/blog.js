// Medium API Integration
const MEDIUM_USERNAME = 'tapos-datta';
const MEDIUM_RSS_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`;

// DOM Elements
const blogGrid = document.querySelector('.blog-grid');
const newsletterSection = document.querySelector('.newsletter-section');
const categoryFilters = document.querySelectorAll('.category-filter');
const loadMoreButton = document.querySelector('.load-more-button');

// State
let allArticles = [];
let currentPage = 1;
const articlesPerPage = 6;
let currentCategory = 'all';

// Loading State
function showLoading() {
    blogGrid.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading articles...</p>
        </div>
    `;
}

function showError(message) {
    blogGrid.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="fetchMediumArticles()" class="retry-button">Retry</button>
        </div>
    `;
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Extract Categories from Tags
function extractCategories(tags) {
    const categories = new Set();
    tags.forEach(tag => {
        const category = tag.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        categories.add(category);
    });
    return Array.from(categories);
}

// Extract first image from content
function extractFirstImage(content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
}

// Get article image with fallback
function getArticleImage(article) {
    // Try to get image from content first
    const contentImage = extractFirstImage(article.content);
    if (contentImage && contentImage !== 'undefined' && contentImage !== 'null') {
        return contentImage;
    }
    
    // Fallback to thumbnail
    if (article.thumbnail && article.thumbnail !== 'undefined' && article.thumbnail !== 'null') {
        return article.thumbnail;
    }
    
    // Final fallback to placeholder image
    return 'assets/images/placeholder_blog.webp';
}

// Create Blog Card HTML
function createBlogCard(article) {
    const categories = extractCategories(article.categories);
    const categoryHTML = categories.map(category => 
        `<span class="blog-category">${category}</span>`
    ).join('');
    
    const articleImage = getArticleImage(article);

    return `
        <article class="blog-card" data-categories="${categories.join(',')}">
            <div class="blog-card-content">
                <div class="blog-card-image">
                    <img src="${articleImage}" 
                         alt="${article.title}" 
                         loading="lazy" 
                         onerror="this.onerror=null; this.src='assets/images/placeholder_blog.webp'">
                </div>
                <div class="blog-card-text">
                    <div class="blog-meta">
                        <span class="blog-date">${formatDate(article.pubDate)}</span>
                        ${categoryHTML}
                    </div>
                    <h3>${article.title}</h3>
                    <p class="blog-excerpt">
                        ${article.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </article>
    `;
}

// Filter Articles by Category
function filterArticles(category) {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach(card => {
        const cardCategories = card.dataset.categories.split(',');
        if (category === 'all' || cardCategories.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Update Category Filter UI
function updateCategoryFilters(selectedCategory) {
    categoryFilters.forEach(filter => {
        if (filter.dataset.category === selectedCategory) {
            filter.classList.add('active');
        } else {
            filter.classList.remove('active');
        }
    });
}

// Handle image loading
function handleImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create a new image to test loading
                const tempImage = new Image();
                tempImage.onload = () => {
                    img.src = tempImage.src;
                    img.classList.add('loaded');
                };
                tempImage.onerror = () => {
                    // Use local placeholder image
                    img.src = 'assets/images/placeholder_blog.webp';
                    img.classList.add('loaded');
                };
                
                // Start loading the image
                tempImage.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    images.forEach(img => {
        // Store original src in data-src
        if (img.src) {
            img.dataset.src = img.src;
        }
        imageObserver.observe(img);
    });
}

// Load More Articles
function loadMoreArticles() {
    const start = currentPage * articlesPerPage;
    const end = start + articlesPerPage;
    const filteredArticles = currentCategory === 'all' 
        ? allArticles 
        : allArticles.filter(article => 
            extractCategories(article.categories).includes(currentCategory)
        );

    if (start >= filteredArticles.length) {
        loadMoreButton.style.display = 'none';
        return;
    }

    const articlesToShow = filteredArticles.slice(start, end);
    const articlesHTML = articlesToShow.map(article => createBlogCard(article)).join('');
    
    blogGrid.insertAdjacentHTML('beforeend', articlesHTML);
    currentPage++;

    // Handle image loading for new articles
    handleImageLoading();

    if (end >= filteredArticles.length) {
        loadMoreButton.style.display = 'none';
    }
}

// Fetch Articles from Medium
async function fetchMediumArticles() {
    try {
        showLoading();
        const response = await fetch(MEDIUM_RSS_URL);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('Failed to fetch articles');
        }

        allArticles = data.items;
        
        if (allArticles.length === 0) {
            showError('No articles found');
            return;
        }

        // Set up initial grid
        const initialArticles = allArticles.slice(0, articlesPerPage);
        const articlesHTML = initialArticles.map(article => createBlogCard(article)).join('');
        blogGrid.innerHTML = articlesHTML;

        // Show/hide load more button
        loadMoreButton.style.display = allArticles.length > articlesPerPage ? 'inline-flex' : 'none';

        // Add animation classes
        document.querySelectorAll('.blog-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Handle image loading
        handleImageLoading();

    } catch (error) {
        console.error('Error fetching Medium articles:', error);
        showError('Failed to load articles. Please try again later.');
    }
}

// Event Listeners
categoryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        const category = filter.dataset.category;
        currentCategory = category;
        currentPage = 1;
        updateCategoryFilters(category);
        filterArticles(category);
        loadMoreButton.style.display = 'inline-flex';
    });
});

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadMoreArticles);
}

// Newsletter Form Handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would typically send this to your backend
        const formContainer = newsletterForm.parentElement;
        formContainer.innerHTML = `
            <div class="newsletter-success">
                <i class="fas fa-check-circle"></i>
                <h3>Thanks for subscribing!</h3>
                <p>You'll receive updates on new articles and technical insights.</p>
            </div>
        `;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchMediumArticles();
});

// Function to initialize the blog grid
function initializeBlogGrid() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    // Example blog posts data
    const blogPosts = [
        {
            title: "Optimizing ML Models for Mobile Deployment",
            excerpt: "A deep dive into techniques for reducing model size while maintaining accuracy in mobile applications.",
            date: "March 15, 2024",
            readTime: "8 min read",
            link: "https://medium.com/@tapos-datta/optimizing-ml-models-for-mobile-deployment"
        },
        {
            title: "Real-Time Video Processing with OpenGL ES",
            excerpt: "Exploring efficient video processing techniques using OpenGL ES for mobile applications.",
            date: "February 28, 2024",
            readTime: "10 min read",
            link: "https://medium.com/@tapos-datta/real-time-video-processing-with-opengl-es"
        },
        {
            title: "Building Efficient Computer Vision Apps",
            excerpt: "Best practices for implementing computer vision features in mobile applications.",
            date: "February 10, 2024",
            readTime: "12 min read",
            link: "https://medium.com/@tapos-datta/building-efficient-computer-vision-apps"
        }
    ];

    // Create blog cards
    blogPosts.forEach(post => {
        const card = createBlogCard(post);
        blogGrid.appendChild(card);
    });

    // Initialize load more button
    const loadMoreButton = document.querySelector('.load-more-button');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            // Add more blog posts or show a message
            loadMoreButton.textContent = 'More articles coming soon!';
            loadMoreButton.disabled = true;
        });
    }
}

// Function to create a blog card
function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    
    card.innerHTML = `
        <div class="blog-card-content">
            <div class="blog-card-header">
                <h3>${post.title}</h3>
                <div class="blog-card-meta">
                    <span class="blog-date">${post.date}</span>
                    <span class="blog-read-time">${post.readTime}</span>
                </div>
            </div>
            <p class="blog-excerpt">${post.excerpt}</p>
            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="blog-link">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return card;
}

// Initialize blog grid when the component is loaded
document.addEventListener('componentLoaded', (event) => {
    if (event.detail.componentName === 'blog') {
        initializeBlogGrid();
    }
}); 