// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('inverted');
    const isInverted = document.body.classList.contains('inverted');
    localStorage.setItem('theme', isInverted ? 'dark' : 'light');
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('inverted');
    }
});

// Blog filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter blog posts
            blogPosts.forEach(post => {
                const category = post.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    post.style.display = 'block';
                    post.style.animation = 'fadeIn 0.8s ease forwards';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
});

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Simulate successful subscription
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Subscribed!';
                submitBtn.style.background = '#2d5a3d';
                emailInput.value = '';
                
            // Show success notification
            showNotification('Welcome to Week 1! Check your email for Day 1: Python vs Java setup guide.', 'success');                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Blog post click functionality
document.addEventListener('DOMContentLoaded', function() {
    const blogPosts = document.querySelectorAll('.blog-post h3');
    
    blogPosts.forEach(title => {
        title.addEventListener('click', function() {
            const postTitle = this.textContent;
            showNotification(`Opening: "${postTitle}"`, 'info');
            
            // In a real application, this would navigate to the detailed daily lesson
            setTimeout(() => {
                showNotification('Daily lesson with code examples would open here. Coming soon!', 'info');
            }, 1500);
        });
    });
});

// Typing animation completion callback
document.addEventListener('DOMContentLoaded', function() {
    const typewriter = document.querySelector('.typewriter');
    
    if (typewriter) {
        // Add blinking cursor after typing animation completes
        setTimeout(() => {
            typewriter.style.borderRight = '2px solid var(--primary-color)';
            typewriter.style.animation = 'blink-caret 0.75s step-end infinite';
        }, 3500);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Toggle theme with Ctrl/Cmd + D
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Focus search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const emailInput = document.querySelector('.newsletter-form input[type="email"]');
        if (emailInput) {
            emailInput.focus();
        }
    }
});

// Intersection Observer for animation timing
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('section, .blog-post');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Reading progress indicator (for future enhancement)
function updateReadingProgress() {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - winHeight;
    const scrollTop = window.pageYOffset;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // This could be used to show reading progress
    console.log(`Reading progress: ${Math.round(scrollPercent)}%`);
}

window.addEventListener('scroll', updateReadingProgress);

// Article analytics (placeholder)
function trackArticleInteraction(action, articleTitle) {
    // In a real application, this would send analytics data
    console.log(`Analytics: ${action} - ${articleTitle}`);
}

// Enhanced blog post interactions
document.addEventListener('DOMContentLoaded', function() {
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        const title = post.querySelector('h3').textContent;
        
        // Track when articles come into view
        const postObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackArticleInteraction('viewed', title);
                }
            });
        }, { threshold: 0.5 });
        
        postObserver.observe(post);
        
        // Track clicks on articles
        post.addEventListener('click', () => {
            trackArticleInteraction('clicked', title);
        });
    });
});

// Copy link functionality (for sharing articles)
function copyArticleLink(articleTitle) {
    const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(articleTitle)}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Article link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy link', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Article link copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy link', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Search functionality placeholder
function initializeSearch() {
    // This would implement client-side search through articles
    console.log('Search functionality would be implemented here');
    showNotification('Search feature coming soon!', 'info');
}

// Performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    // Log page load performance
    setTimeout(() => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    }, 0);
});

console.log('NexArch - Software Engineering Career Development Platform initialized successfully!');
