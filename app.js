// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }

    // Toggle mobile menu
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked');
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

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Cookie consent handling
(function() {
    const CONSENT_KEY = 'balancedesign_cookie_consent_v1';
    let consentPanelCreated = false; // Flag to prevent duplicate creation

    function hasConsent() {
        try {
            const consent = localStorage.getItem(CONSENT_KEY);
            return consent === 'accepted' || consent === 'declined';
        } catch (e) {
            return false;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(CONSENT_KEY, value);
            console.log('Cookie consent set to:', value);
        } catch (e) {
            console.error('Cookie consent storage error:', e);
        }
    }

    function createCookieConsent() {
        // Prevent duplicate creation
        if (consentPanelCreated) {
            console.warn('Cookie consent panel already created, skipping');
            return;
        }
        
        // Check if panel already exists in DOM
        const existingPanel = document.querySelector('.cookie-consent');
        if (existingPanel) {
            console.warn('Cookie consent panel already exists in DOM, skipping');
            return;
        }
        
        consentPanelCreated = true;
        console.log('Creating cookie consent panel');
        
        const consentPanel = document.createElement('div');
        consentPanel.className = 'cookie-consent';
        consentPanel.id = 'cookieConsentPanel';
        consentPanel.innerHTML = `
            <div class="cookie-consent-inner">
                <div class="cookie-consent-text">
                    <strong>Az oldal sütiket használ</strong>
                    <p>Weboldalunk sütiket (cookie-kat) használ a jobb felhasználói élmény és analitika érdekében. Folytatással jóváhagyja a sütik használatát.</p>
                </div>
                <div class="cookie-consent-actions">
                    <button type="button" id="cookieDecline" class="btn btn-secondary">Elutasítom</button>
                    <button type="button" id="cookieAccept" class="btn btn-primary">Elfogadom</button>
                </div>
            </div>
        `;

        document.body.appendChild(consentPanel);

        // Use setTimeout to ensure elements are in DOM
        setTimeout(() => {
            const acceptBtn = consentPanel.querySelector('#cookieAccept');
            const declineBtn = consentPanel.querySelector('#cookieDecline');

            console.log('Cookie buttons:', { acceptBtn, declineBtn });
            console.log('Panel in DOM?', document.body.contains(consentPanel));

            function handleAccept(e) {
                console.log('===== ACCEPT HANDLER FIRED =====');
                console.log('Event type:', e ? e.type : 'no event');
                
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
                
                console.log('Setting consent to accepted...');
                setConsent('accepted');
                
                console.log('Calling removeCookieConsent...');
                removeCookieConsent(consentPanel);
                
                console.log('===== ACCEPT HANDLER COMPLETE =====');
                return false;
            }

            function handleDecline(e) {
                console.log('===== DECLINE HANDLER FIRED =====');
                console.log('Event type:', e ? e.type : 'no event');
                
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
                
                console.log('Setting consent to declined...');
                setConsent('declined');
                
                console.log('Calling removeCookieConsent...');
                removeCookieConsent(consentPanel);
                
                console.log('===== DECLINE HANDLER COMPLETE =====');
                return false;
            }

            if (acceptBtn) {
                console.log('Attaching events to Accept button');
                // Remove any existing listeners
                acceptBtn.onclick = null;
                // Add both click and touch events for mobile
                acceptBtn.addEventListener('click', handleAccept, { once: true });
                acceptBtn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    handleAccept(e);
                }, { once: true });
                // Also add ontouchend as backup
                acceptBtn.ontouchend = function(e) {
                    e.preventDefault();
                    handleAccept(e);
                };
            } else {
                console.error('Accept button NOT FOUND');
            }

            if (declineBtn) {
                console.log('Attaching events to Decline button');
                // Remove any existing listeners
                declineBtn.onclick = null;
                // Add both click and touch events for mobile
                declineBtn.addEventListener('click', handleDecline, { once: true });
                declineBtn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    handleDecline(e);
                }, { once: true });
                // Also add ontouchend as backup
                declineBtn.ontouchend = function(e) {
                    e.preventDefault();
                    handleDecline(e);
                };
            } else {
                console.error('Decline button NOT FOUND');
            }
        }, 50);
    }

    function removeCookieConsent(panel) {
        console.log('======================================');
        console.log('removeCookieConsent CALLED');
        console.log('======================================');
        
        // Remove ALL cookie consent panels (in case of duplicates)
        const allPanels = document.querySelectorAll('.cookie-consent');
        console.log('Found ' + allPanels.length + ' cookie consent panel(s)');
        
        allPanels.forEach((p, index) => {
            console.log('Removing panel #' + (index + 1));
            
            // Method 1: Hide immediately with display none
            p.style.display = 'none';
            
            // Method 2: Hide with visibility
            p.style.visibility = 'hidden';
            
            // Method 3: Move off screen
            p.style.position = 'fixed';
            p.style.left = '-9999px';
            
            // Method 4: Set opacity to 0
            p.style.opacity = '0';
            
            // Disable interaction
            p.style.pointerEvents = 'none';
            
            // Try to remove from DOM
            try {
                if (p.parentNode) {
                    p.parentNode.removeChild(p);
                    console.log('✓✓✓ Panel #' + (index + 1) + ' REMOVED with removeChild');
                } else {
                    p.remove();
                    console.log('✓✓✓ Panel #' + (index + 1) + ' REMOVED with remove()');
                }
            } catch (e) {
                console.error('✗✗✗ ERROR removing panel #' + (index + 1) + ':', e);
            }
        });
        
        // Verify removal after a delay
        setTimeout(() => {
            const stillThere = document.querySelectorAll('.cookie-consent');
            console.log('Verification check - Panels still in DOM:', stillThere.length);
            if (stillThere.length > 0) {
                console.warn('!!! ' + stillThere.length + ' PANEL(S) STILL EXIST, forcing removal !!!');
                stillThere.forEach((p, i) => {
                    p.style.display = 'none';
                    try {
                        p.remove();
                        console.log('Force removed panel #' + (i + 1));
                    } catch (e) {
                        console.error('Force removal failed for panel #' + (i + 1) + ':', e);
                    }
                });
            } else {
                console.log('✓✓✓ VERIFIED: All panels successfully removed');
            }
        }, 100);
        
        console.log('======================================');
        console.log('removeCookieConsent COMPLETE');
        console.log('======================================');
    }

    // Initialize when DOM is ready - only once!
    let initialized = false;
    
    function initCookieConsent() {
        if (initialized) {
            console.log('Cookie consent already initialized, skipping');
            return;
        }
        initialized = true;
        
        if (!hasConsent()) {
            console.log('No consent found, showing panel after delay');
            setTimeout(createCookieConsent, 500);
        } else {
            console.log('Consent already given, not showing panel');
            // Remove any existing panels that might be in the DOM
            setTimeout(() => {
                const existingPanels = document.querySelectorAll('.cookie-consent');
                if (existingPanels.length > 0) {
                    console.warn('Found ' + existingPanels.length + ' existing panel(s) even though consent was given! Removing...');
                    existingPanels.forEach((panel, i) => {
                        panel.style.display = 'none';
                        try {
                            panel.remove();
                            console.log('Removed existing panel #' + (i + 1));
                        } catch (e) {
                            console.error('Error removing existing panel:', e);
                        }
                    });
                }
            }, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent, { once: true });
    } else {
        initCookieConsent();
    }
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
    
    // Load gallery images dynamically from the folder
    async function loadGalleryImages() {
        try {
            // Try to fetch from PHP endpoint first
            const response = await fetch('get-gallery-images.php');
            if (response.ok) {
                const imagePaths = await response.json();
                
                // Load images into galleryImages array
                imagePaths.forEach((path, index) => {
                    const filename = path.split('/').pop();
                    galleryImages.push({
                        src: path,
                        alt: `Balance Design projekt ${index + 1}`,
                        title: `Referencia munka ${index + 1}`,
                        description: 'Egyedi faipari és belsőépítészeti megoldás - Balance Design Kft.'
                    });
                });
            } else {
                throw new Error('PHP endpoint not available');
            }
        } catch (error) {
            console.log('Using fallback gallery images');
            // Fallback: Use static list if PHP is not available
            const fallbackImages = [
                'assets/gallery/IMG_0208.png',
                'assets/gallery/IMG_0570.png',
                'assets/gallery/IMG_0594.png',
                'assets/gallery/IMG_0804.png',
                'assets/gallery/IMG_0813.png',
                'assets/gallery/IMG_1139.png',
                'assets/gallery/IMG_1148.png',
                'assets/gallery/IMG_2127.png',
                'assets/gallery/IMG_2130.png',
                'assets/gallery/IMG_2159.png',
                'assets/gallery/IMG_2265.png',
                'assets/gallery/IMG_2274.png',
                'assets/gallery/IMG_2348.png',
                'assets/gallery/IMG_2591.png',
                'assets/gallery/IMG_2792.png',
                'assets/gallery/IMG_4124.png',
                'assets/gallery/IMG_4149.png',
                'assets/gallery/IMG_5461.png',
                'assets/gallery/IMG_5463.png',
                'assets/gallery/IMG_5564.png',
                'assets/gallery/IMG_5567.png',
                'assets/gallery/IMG_7328.png',
                'assets/gallery/IMG_7457.png',
                'assets/gallery/IMG_7479.png',
                'assets/gallery/IMG_7481.png',
                'assets/gallery/IMG_7738.png',
                'assets/gallery/IMG_8065.png',
                'assets/gallery/IMG_8069.png',
                'assets/gallery/IMG_8350.png',
                'assets/gallery/IMG_8351.png',
                'assets/gallery/IMG_9742.png',
                'assets/gallery/IMG_9745.png'
            ];
            
            fallbackImages.forEach((path, index) => {
                galleryImages.push({
                    src: path,
                    alt: `Balance Design projekt ${index + 1}`,
                    title: `Referencia munka ${index + 1}`,
                    description: 'Egyedi faipari és belsőépítészeti megoldás - Balance Design Kft.'
                });
            });
        }
    }
    
    // Initialize gallery
    loadGalleryImages().then(() => {
        console.log(`Loaded ${galleryImages.length} gallery images`);
    });
    
    // Prepare gallery data from visible preview items
    galleryItems.forEach((item, index) => {
        // Add click event to gallery items
        item.addEventListener('click', function() {
            // Find the clicked image in the full gallery
            const clickedSrc = item.getAttribute('data-src');
            const fullGalleryIndex = galleryImages.findIndex(img => img.src === clickedSrc);
            currentImageIndex = fullGalleryIndex >= 0 ? fullGalleryIndex : 0;
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
        
        // Update counter
        const counter = document.getElementById('galleryCounter');
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        }
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

// Service Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const serviceData = {
        kitchen: {
            title: 'Konyhaszekrények',
            image: 'assets/services_kitchen.jpg',
            description: `
                <p>Egyedi, modern konyhabútorokat tervezünk és gyártunk, amelyek tökéletesen illeszkednek az Ön igényeihez és a konyha adottságaihoz. Minden konyhaszekrényünk prémium minőségű anyagokból készül, figyelembe véve a funkcionalitást és az esztétikát.</p>
                <p>A tervezés során kiemelt figyelmet fordítunk a maximális helykihasználásra, a praktikus tárolási megoldásokra és a tartósságra. Választhat különböző ajtólapok, munkalapok és kiegészítők közül.</p>
            `,
            features: [
                'Egyedi tervezés és méretezés',
                'Prémium minőségű anyagok (MDF, tömör fa, laminált lap)',
                'Modern vasalatok és soft-close rendszerek',
                'Beépített spotlámpák és LED világítás',
                'Munkalap tervezés és beépítés',
                'Gépek beépítése (sütő, hűtő, mosogatógép)',
            ]
        },
        wardrobe: {
            title: 'Gardróbok, előszoba szekrények',
            image: 'assets/services_wardrobe.jpg',
            description: `
                <p>Praktikus és stílusos gardróbokat, beépített szekrényeket és előszoba bútorokat készítünk, amelyek maximálisan kihasználják a rendelkezésre álló teret. Minden gardróbunk egyedi tervezésű, figyelembe véve az Ön igényeit és a helyiség adottságait.</p>
                <p>Tárolási megoldásaink között szerepelnek ruhatartó rudak, polcok, fiókok, cipőtartók és egyéb praktikus kiegészítők.</p>
            `,
            features: [
                'Beépített és szabadon álló gardróbok',
                'Tolóajtós és nyíló ajtós megoldások',
                'Belső elosztás tervezése (polcok, fiókok, rudak)',
                'Tükrös ajtólapok',
                'Előszoba szekrények cipőtartóval',
                'LED világítás és szenzoros kapcsolók',
                'Minőségi vasalatok és sínek'
            ]
        },
        bathroom: {
            title: 'Fürdőszobabútorok',
            image: 'assets/services_bathroom_cabinets.jpg',
            description: `
                <p>Vízálló, tartós fürdőszobabútorokat készítünk, amelyek egyszerre funkcionálisak és esztétikusak. Fürdőszobai megoldásaink tökéletesen ellenállnak a magas páratartalomnak és a nedvességnek.</p>
                <p>Komplett fürdőszoba berendezéseket tervezünk, beleértve a mosdószekrényeket, tükrös faliszekrényeket, polcrendszereket és egyéb tárolási megoldásokat.</p>
            `,
            features: [
                'Vízálló, nedvességálló anyagok',
                'Mosdó alatti szekrények',
                'Tükrös fürdőszoba szekrények',
                'Beépített vagy szabadon álló megoldások',
                'Modern, könnyen tisztítható felületek',
                'Egyedi méretezés és tervezés'
            ]
        },
        doors: {
            title: 'Beltéri ajtók',
            image: 'assets/unsorted/IMG_0809.jpg',
            description: `
                <p>Egyedi beltéri ajtókat tervezünk és gyártunk, amelyek harmonizálnak otthona stílusával. Széles választék áll rendelkezésre: modern, klasszikus, minimalista vagy rusztikus kivitelben.</p>
                <p>Ajtóink készülhetnek tömör fából, furnérozott MDF-ből vagy laminált anyagokból, mindig a legmagasabb minőségi követelményeknek megfelelően.</p>
            `,
            features: [
                'Egyedi méretű ajtók gyártása',
                'Különböző anyagok (tömör fa, MDF, CPL)',
                'Üvegbetétes változatok',
                'Tokkal együtt szállítva',
                'Minőségi zárszerkezetek',
                'Színre fényezés vagy lakkozás',
                'Szakszerű beszerelés'
            ]
        },
        interior: {
            title: 'Belsőépítészeti kivitelezések',
            image: 'assets/unsorted/IMG_2270.jpg',
            description: `
                <p>Komplex belsőépítészeti projekteket valósítunk meg, az ötlettől a befejezésig. Lakások, házak, irodák és üzlethelyiségek teljes felújítását és átalakítását vállaljuk.</p>
                <p>Csapatunk magában foglalja a tervezőket, asztalosokat, villanyszerelőket és egyéb szakembereket, így minden munkát egy kézből kaphat.</p>
            `,
            features: [
                'Gipszkarton munkák',
                'Parketta és burkolat lerakás',
            ]
        },
        '3d': {
            title: '3D látványterv kivitelezés',
            image: 'assets/3dplan.jpg',
            description: `
                <p>Fotorealisztikus 3D látványterveket készítünk, amelyek segítségével még a kivitelezés előtt láthatja, milyen lesz otthona vagy irodája. A terveinket a legmodernebb szoftverekkel készítjük.</p>
                <p>A 3D tervek segítenek a döntéshozatalban: megtekintheti a különböző színeket, anyagokat, elrendezéseket, mielőtt még bármit is elkezdene.</p>
            `,
            features: [
                'Fotorealisztikus 3D vizualizáció',
                'Teljes helyiségek megtervezése',
                'Anyagok, színek, kipróbálása',
                'Bútorrajzok és alaprajzok',
                'A kivitelezés pontos előkészítése'
            ]
        },
        microcement: {
            title: 'Mikrocement',
            image: 'assets/unsorted/IMG_7328.jpg',
            description: `
                <p>A mikrocement egy modern, varrat nélküli bevonat, amely egyedülálló megjelenést kölcsönöz otthonának. Falakra, padlókra, fürdőszobákba, konyhákba egyaránt alkalmazható.</p>
                <p>Vízálló, tartós és könnyen tisztítható felületet biztosít. A mikrocement kiválóan alkalmas modern, indusztriális vagy minimalista stílusú terekhez.</p>
            `,
            features: [
                'Varrat nélküli, modern megjelenés',
                'Falakra és padlókra egyaránt',
                'Vízálló, fürdőszobába is alkalmas',
                'Különböző színek és textúrák',
                'Tartós és könnyen tisztítható',
                'Meglévő burkolatra is felvihető',
                'Egyedi, modern design'
            ]
        }
    };

    const modal = document.getElementById('serviceModal');
    const modalOverlay = modal.querySelector('.service-modal-overlay');
    const modalClose = modal.querySelector('.service-modal-close');
    const serviceTiles = document.querySelectorAll('.service-tile');
    const morphWrapper = document.querySelector('.morph-wrapper');
    let morphInterval = null;

    // Auto morph function
    function startAutoMorph() {
        if (morphWrapper && !morphInterval) {
            // Initial delay before first morph
            setTimeout(() => {
                morphWrapper.classList.add('morphing');
            }, 800);

            // Set up interval for continuous morphing
            morphInterval = setInterval(() => {
                morphWrapper.classList.toggle('morphing');
            }, 3500);
        }
    }

    function stopAutoMorph() {
        if (morphInterval) {
            clearInterval(morphInterval);
            morphInterval = null;
        }
        if (morphWrapper) {
            morphWrapper.classList.remove('morphing');
        }
    }

    // Open modal
    serviceTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            const service = serviceData[serviceId];

            if (service) {
                // Check if this is the 3D service
                const is3DService = serviceId === '3d';
                
                // Toggle modal layout class
                if (is3DService) {
                    modal.classList.add('modal-3d');
                } else {
                    modal.classList.remove('modal-3d');
                }

                // Populate modal content
                document.getElementById('serviceModalTitle').textContent = service.title;
                document.getElementById('serviceModalImg').src = service.image;
                document.getElementById('serviceModalImg').alt = service.title;
                document.getElementById('serviceModalDescription').innerHTML = service.description;

                // Populate features
                const featuresList = document.getElementById('serviceModalFeatures');
                featuresList.innerHTML = '';
                service.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });

                // Reset scroll position to top
                const modalBody = modal.querySelector('.service-modal-body');
                if (modalBody) {
                    modalBody.scrollTop = 0;
                }

                // Show modal with animation
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    modal.classList.add('show');
                    
                    // Start auto morph for 3D service
                    if (is3DService) {
                        startAutoMorph();
                    }
                }, 10);
            }
        });
    });

    // Close modal function
    function closeModal() {
        // Stop morphing animation
        stopAutoMorph();
        
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            modal.classList.remove('modal-3d');
            
            // Reset scroll position when closing
            const modalBody = modal.querySelector('.service-modal-body');
            if (modalBody) {
                modalBody.scrollTop = 0;
            }
        }, 300);
    }

    // Close on X button
    modalClose.addEventListener('click', closeModal);

    // Close on overlay click
    modalOverlay.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Smooth scroll when clicking contact button in modal
    modal.querySelector('.service-modal-actions a').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
        setTimeout(() => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 400);
    });
});
