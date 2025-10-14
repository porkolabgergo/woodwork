// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Cookie consent handling (Shadow DOM-based to avoid page-level CSS interference)
(function() {
    const CONSENT_KEY = 'balancedesign_cookie_consent_v1';

    function hasConsent() {
        try {
            return localStorage.getItem(CONSENT_KEY) === 'accepted';
        } catch (e) {
            return false;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(CONSENT_KEY, value);
        } catch (e) {
            // ignore storage errors
        }
    }

    // Build a Shadow DOM cookie panel and attach it to document.body
    function createShadowConsent() {
        // Container host
        const host = document.createElement('div');
        host.id = 'cookie-consent-host';
        // Keep off-screen until ready
        host.style.all = 'initial';

        // Attach shadow root (closed to prevent accidental page scripts from tampering)
        const shadow = host.attachShadow({ mode: 'closed' });

        // Build inner HTML + styles
        const style = document.createElement('style');
        style.textContent = `
            :host{all:initial}
            .cookie-consent{position:fixed;left:20px;right:20px;bottom:24px;background:rgba(31,25,20,0.96);color:#fff;padding:18px 20px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:2147483647;display:flex;justify-content:center;align-items:center;font-family:Inter, system-ui, Arial, sans-serif}
            .cookie-consent-inner{max-width:1100px;width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px}
            .cookie-consent-text{flex:1 1 auto}
            .cookie-consent-text p{margin-top:6px;color:#e6e6e6;font-size:0.95rem}
            .cookie-consent-actions{display:flex;gap:10px;flex-shrink:0}
            button{cursor:pointer;padding:10px 20px;border-radius:20px;border:2px solid transparent;font-weight:600}
            .btn-primary{background:#1f1914;color:#fff;border-color:#1f1914}
            .btn-secondary{background:transparent;color:#fff;border-color:#fff}
            @media(max-width:640px){.cookie-consent-inner{flex-direction:column;align-items:stretch;text-align:left}.cookie-consent-actions{justify-content:flex-end;margin-top:8px}}
        `;

        const wrapper = document.createElement('div');
        wrapper.className = 'cookie-consent';
        wrapper.innerHTML = `
            <div class="cookie-consent-inner">
                <div class="cookie-consent-text">
                    <strong>Az oldal sütiket használ</strong>
                    <p>Weboldalunk sütiket (cookie-kat) használ a jobb felhasználói élmény és analitika érdekében. Folytatással jóváhagyja a sütik használatát.</p>
                </div>
                <div class="cookie-consent-actions">
                    <button id="shadowCookieDecline" class="btn btn-secondary">Elutasítom</button>
                    <button id="shadowCookieAccept" class="btn btn-primary">Elfogadom</button>
                </div>
            </div>
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);

        // Attach host to body
        document.body.appendChild(host);

        // Attach event listeners inside shadow
        // Because shadow is closed, we must query via the wrapper reference
        const accept = wrapper.querySelector('#shadowCookieAccept');
        const decline = wrapper.querySelector('#shadowCookieDecline');

        accept.addEventListener('click', () => {
            setConsent('accepted');
            removeShadowConsent(host);
            showNotification('Köszönjük! A sütik elfogadásra kerültek.', 'success');
        });

        decline.addEventListener('click', () => {
            setConsent('declined');
            removeShadowConsent(host);
            showNotification('A sütik elutasítva. A weboldal alapfunkciói továbbra is működnek.', 'info');
        });

        return host;
    }

    function removeShadowConsent(host) {
        try {
            if (host && host.parentNode) host.parentNode.removeChild(host);
        } catch (e) {
            // ignore
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (!hasConsent()) {
            createShadowConsent();
        }
    });
})();

// Active navigation highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    
    if (window.scrollY > heroHeight - 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Kérjük, töltse ki az összes kötelező mezőt!', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Kérjük, adjon meg egy érvényes e-mail címet!', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Küldés...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        showNotification('Köszönjük az üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.', 'success');
        
        // Reset form
        this.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                  type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                  '<i class="fas fa-info-circle"></i>'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .about-content, .contact-content');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});

// Enhanced Gallery Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    const galleryModalTitle = document.getElementById('galleryModalTitle');
    const galleryModalDescription = document.getElementById('galleryModalDescription');
    const galleryModalClose = document.querySelector('.gallery-modal-close');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Prepare gallery data
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        
        galleryImages.push({
            src: item.getAttribute('data-src') || img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('alt'),
            description: caption ? caption.textContent : 'Egyedi faipari megoldás'
        });
        
        // Add click event to gallery items
        item.addEventListener('click', function() {
            currentImageIndex = index;
            openGalleryModal();
        });
    });
    
    function openGalleryModal() {
        updateModalContent();
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Force reflow then animate in
        galleryModal.offsetHeight;
        setTimeout(() => {
            galleryModal.classList.add('show');
        }, 10);
    }
    
    function closeGalleryModal() {
        galleryModal.classList.remove('show');
        setTimeout(() => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    }
    
    function updateModalContent() {
        const currentImage = galleryImages[currentImageIndex];
        galleryModalImage.src = currentImage.src;
        galleryModalImage.alt = currentImage.alt;
        galleryModalTitle.textContent = currentImage.title;
        galleryModalDescription.textContent = currentImage.description;
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateModalContent();
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalContent();
    }
    
    // Event listeners
    galleryModalClose.addEventListener('click', closeGalleryModal);
    galleryNext.addEventListener('click', showNextImage);
    galleryPrev.addEventListener('click', showPrevImage);
    
    // Gallery button click handler - target the gallery section button specifically
    const galleryButtons = document.querySelectorAll('.gallery-buttons a[href="#gallery"]');
    galleryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            currentImageIndex = 0; // Start with first image
            openGalleryModal();
        });
    });
    
    // Close modal when clicking outside the image
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (galleryModal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeGalleryModal();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
            }
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    galleryModal.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    galleryModal.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50; // minimum swipe distance
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > threshold) {
            if (swipeDistance > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPrevImage();
            }
        }
    }
});

// Back to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #1f1914;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    backToTop.addEventListener('mouseenter', function() {
        this.style.background = '#2a2018';
        this.style.transform = 'translateY(-2px)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.background = '#1f1914';
        this.style.transform = 'translateY(0)';
    });
});

// Form field validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Validate on blur
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#f44336';
            } else if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#f44336';
                } else {
                    this.style.borderColor = '#4CAF50';
                }
            } else if (this.value.trim()) {
                this.style.borderColor = '#4CAF50';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
        
        // Reset border color on input
        input.addEventListener('input', function() {
            this.style.borderColor = '#1f1914';
        });
    });
});

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScroll = throttle(function() {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    
    if (window.scrollY > heroHeight - 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }
}, 100);

window.addEventListener('scroll', throttledScroll);

// Services Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const carouselTrack = document.querySelector('.services-carousel-track');
        const carouselPrev = document.querySelector('.carousel-prev');
        const carouselNext = document.querySelector('.carousel-next');
        const serviceCards = document.querySelectorAll('.service-card');
        
        console.log('Carousel elements:', { 
            carouselTrack, 
            carouselPrev, 
            carouselNext, 
            serviceCards: serviceCards.length 
        });
        
        if (!carouselTrack || !carouselPrev || !carouselNext || serviceCards.length === 0) {
            console.log('Carousel elements not found');
            return;
        }
        
        let currentIndex = 0;
        const totalCards = serviceCards.length;
        let isAnimating = false;
        
        // Get number of cards to show based on screen size
        function getCardsToShow() {
            const width = window.innerWidth;
            if (width <= 768) return 1;        // Mobile: 1 card
            if (width <= 1024) return 2;       // Tablet: 2 cards
            return 3;                          // Desktop: 3 cards
        }
        
        // Calculate the distance to move for one card shift
        function getShiftDistance() {
            const firstCard = serviceCards[0];
            if (!firstCard) return 0;
            
            const cardWidth = firstCard.offsetWidth;
            const width = window.innerWidth;
            const gap = width <= 768 ? 16 : 32; // Smaller gap on mobile
            return cardWidth + gap;
        }
        
        function updateCarousel(animate = true) {
            if (isAnimating) return;
            
            console.log('Updating carousel, current index:', currentIndex);
            
            if (animate) {
                isAnimating = true;
            }
            
            const shiftDistance = getShiftDistance();
            const translateX = -currentIndex * shiftDistance;
            
            console.log('Card shift distance:', shiftDistance, 'Total translate:', translateX);
            
            carouselTrack.style.transform = `translateX(${translateX}px)`;
            
            if (animate) {
                setTimeout(() => {
                    isAnimating = false;
                }, 600); // Match CSS transition duration
            }
        }
        
        function nextCards() {
            if (isAnimating) return;
            
            console.log('Next button clicked, current index:', currentIndex);
            
            const cardsToShow = getCardsToShow();
            // Calculate max index (we can shift until only the required number of cards remain visible)
            const maxIndex = totalCards - cardsToShow;
            
            if (currentIndex >= maxIndex) {
                // We're at the end, wrap to beginning
                currentIndex = 0;
            } else {
                // Move to next card
                currentIndex++;
            }
            
            updateCarousel(true);
        }
        
        function prevCards() {
            if (isAnimating) return;
            
            console.log('Prev button clicked, current index:', currentIndex);
            
            const cardsToShow = getCardsToShow();
            // Calculate max index for wrapping
            const maxIndex = totalCards - cardsToShow;
            
            if (currentIndex <= 0) {
                // We're at the beginning, wrap to end
                currentIndex = maxIndex;
            } else {
                // Move to previous card
                currentIndex--;
            }
            
            updateCarousel(true);
        }
        
        // Initialize carousel
        updateCarousel(false);
        
        // Add click events to arrows (desktop only)
        carouselPrev.addEventListener('click', function(e) {
            e.preventDefault();
            prevCards();
        });
        
        carouselNext.addEventListener('click', function(e) {
            e.preventDefault();
            nextCards();
        });
        
        // Touch/Swipe functionality for mobile
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let startTime = 0;
        
        function handleTouchStart(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            startTime = Date.now();
        }
        
        function handleTouchMove(e) {
            if (!isDragging) return;
            
            // Prevent scrolling while swiping horizontally
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            const deltaY = Math.abs(e.touches[0].clientY - startY);
            
            if (deltaX > deltaY) {
                e.preventDefault();
            }
        }
        
        function handleTouchEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = startX - endX;
            const deltaY = Math.abs(startY - endY);
            const deltaTime = Date.now() - startTime;
            
            // Only register swipe if horizontal movement is greater than vertical
            // and the swipe is fast enough and long enough
            if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 50 && deltaTime < 300) {
                if (deltaX > 0) {
                    // Swiped left - go to next
                    nextCards();
                } else {
                    // Swiped right - go to previous
                    prevCards();
                }
            }
        }
        
        // Add touch events to carousel track
        carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Keyboard support (desktop)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevCards();
            } else if (e.key === 'ArrowRight') {
                nextCards();
            }
        });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Reset to start position on resize to avoid display issues
                currentIndex = 0;
                updateCarousel(false);
                console.log('Carousel reset after resize, cards to show:', getCardsToShow());
            }, 100);
        });
        
        console.log('Infinite carousel initialized successfully');
        
    }, 100);
});
