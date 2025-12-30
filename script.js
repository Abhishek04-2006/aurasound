// ===================================
// STATE MANAGEMENT
// ===================================
const state = {
    cart: 0,
    isModalOpen: false,
    isMobileMenuOpen: false
};

// ===================================
// DOM ELEMENTS
// ===================================
const elements = {
    navbar: document.getElementById('navbar'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    cartBtn: document.getElementById('cartBtn'),
    cartBadge: document.getElementById('cartBadge'),
    heroCta: document.getElementById('heroCta'),
    watchVideo: document.getElementById('watchVideo'),
    ctaOrder: document.getElementById('ctaOrder'),
    orderModal: document.getElementById('orderModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    orderForm: document.getElementById('orderForm'),
    faqItems: document.querySelectorAll('.faq-item')
};

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
elements.hamburger.addEventListener('click', () => {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    elements.hamburger.classList.toggle('active');
    elements.navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';
});

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (state.isMobileMenuOpen) {
            elements.hamburger.classList.remove('active');
            elements.navMenu.classList.remove('active');
            state.isMobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    });
});

// ===================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// MODAL FUNCTIONALITY
// ===================================
function openModal() {
    state.isModalOpen = true;
    elements.orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    const modalContent = elements.orderModal.querySelector('.modal-content');
    modalContent.style.animation = 'none';
    setTimeout(() => {
        modalContent.style.animation = 'slideUp 0.3s ease-out';
    }, 10);
}

function closeModal() {
    state.isModalOpen = false;
    elements.orderModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Open modal on CTA clicks
elements.heroCta.addEventListener('click', openModal);
elements.ctaOrder.addEventListener('click', openModal);

// Close modal on overlay click
elements.modalOverlay.addEventListener('click', closeModal);

// Close modal on close button click
elements.modalClose.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isModalOpen) {
        closeModal();
    }
});

// ===================================
// VIDEO MODAL (Simulated)
// ===================================
elements.watchVideo.addEventListener('click', () => {
    // Create a simple alert for demo purposes
    // In production, this would open a video player modal
    showNotification('🎥 Video player would open here!', 'info');
});

// ===================================
// CART FUNCTIONALITY
// ===================================
function updateCart(quantity) {
    state.cart = Math.max(0, state.cart + quantity);
    elements.cartBadge.textContent = state.cart;
    
    // Add animation to cart badge
    elements.cartBadge.style.animation = 'none';
    setTimeout(() => {
        elements.cartBadge.style.animation = 'pulse 0.3s ease-out';
    }, 10);
}

elements.cartBtn.addEventListener('click', () => {
    if (state.cart > 0) {
        showNotification(`🛒 You have ${state.cart} item(s) in your cart`, 'success');
    } else {
        showNotification('🛒 Your cart is empty', 'info');
    }
});

// ===================================
// FAQ ACCORDION
// ===================================
elements.faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        elements.faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================
elements.orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(elements.orderForm);
    const orderData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        zipCode: formData.get('zipCode'),
        color: formData.get('color'),
        price: 299,
        timestamp: new Date().toISOString()
    };
    
    // Validate form
    if (!validateForm(orderData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = elements.orderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing...</span>';
    
    // Simulate API call
    try {
        await simulateOrderSubmission(orderData);
        
        // Success
        showNotification('🎉 Order placed successfully! Check your email for confirmation.', 'success');
        updateCart(1);
        closeModal();
        elements.orderForm.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        showNotification('❌ Order failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// ===================================
// FORM VALIDATION
// ===================================
function validateForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Please enter a valid full name');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    // Address validation
    if (!data.address || data.address.trim().length < 10) {
        errors.push('Please enter a complete address');
    }
    
    // City validation
    if (!data.city || data.city.trim().length < 2) {
        errors.push('Please enter a valid city');
    }
    
    // ZIP code validation
    const zipRegex = /^[\d\-\s]{3,}$/;
    if (!data.zipCode || !zipRegex.test(data.zipCode)) {
        errors.push('Please enter a valid ZIP code');
    }
    
    if (errors.length > 0) {
        showNotification('❌ ' + errors[0], 'error');
        return false;
    }
    
    return true;
}

// ===================================
// SIMULATE ORDER SUBMISSION
// ===================================
function simulateOrderSubmission(orderData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Log order data (in production, this would be sent to a server)
            console.log('Order submitted:', orderData);
            
            // 95% success rate simulation
            if (Math.random() > 0.05) {
                resolve({ success: true, orderId: generateOrderId() });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

function generateOrderId() {
    return 'AS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                   type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                   'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        zIndex: '9999',
        maxWidth: '400px',
        fontWeight: '600',
        animation: 'slideInRight 0.3s ease-out',
        fontSize: '0.95rem'
    });
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards, review cards, etc.
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .review-card, .showcase-item, .spec-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// ANALYTICS (Simulated)
// ===================================
function trackEvent(category, action, label) {
    console.log('Analytics Event:', { category, action, label, timestamp: new Date() });
    // In production, this would send data to Google Analytics, Mixpanel, etc.
}

// Track page view
trackEvent('Page', 'View', 'Landing Page');

// Track CTA clicks
elements.heroCta.addEventListener('click', () => {
    trackEvent('CTA', 'Click', 'Hero CTA');
});

elements.ctaOrder.addEventListener('click', () => {
    trackEvent('CTA', 'Click', 'Bottom CTA');
});

// Track video button click
elements.watchVideo.addEventListener('click', () => {
    trackEvent('Video', 'Click', 'Watch Video');
});

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================
// Trap focus in modal when open
elements.orderModal.addEventListener('keydown', (e) => {
    if (!state.isModalOpen) return;
    
    if (e.key === 'Tab') {
        const focusableElements = elements.orderModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// ===================================
// EASTER EGG - KONAMI CODE
// ===================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    showNotification('🎮 Konami Code Activated! Enjoy 10% off with code: KONAMI10', 'success');
    
    // Add rainbow effect to logo
    const logo = document.querySelector('.logo-text');
    logo.style.background = 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
    logo.style.backgroundSize = '200% 100%';
    logo.style.webkitBackgroundClip = 'text';
    logo.style.webkitTextFillColor = 'transparent';
    logo.style.animation = 'rainbow 3s linear infinite';
    
    // Add rainbow animation
    if (!document.querySelector('#rainbow-animation')) {
        const style = document.createElement('style');
        style.id = 'rainbow-animation';
        style.textContent = `
            @keyframes rainbow {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    trackEvent('Easter Egg', 'Activated', 'Konami Code');
}

// ===================================
// INITIALIZATION
// ===================================
console.log('%c🎧 AuraSound Pro Landing Page', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with ❤️ using vanilla JavaScript', 'font-size: 12px; color: #888;');
console.log('%cTry the Konami Code for a surprise! ↑↑↓↓←→←→BA', 'font-size: 12px; color: #888;');

// Show welcome notification
setTimeout(() => {
    showNotification('👋 Welcome! Limited time offer: Save $100 today!', 'info');
}, 1000);
