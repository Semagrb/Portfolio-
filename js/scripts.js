// Modern Portfolio JavaScript with 3D Effects and Smooth Interactions

// Smooth scroll and navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(255, 107, 157, 0.1)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-cube, .floating-sphere');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Individual parallax for floating elements
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Animated counter for stats
    const observerOptions = {
        threshold: 0.7
    };

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent);
                    const increment = target / 100;
                    let current = 0;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.ceil(current) + (counter.textContent.includes('%') ? '%' : '+');
                            setTimeout(updateCounter, 20);
                        } else {
                            counter.textContent = target + (counter.textContent.includes('%') ? '%' : '+');
                        }
                    };
                    updateCounter();
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateCounters, observerOptions);
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Scroll animations for sections
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(animateOnScroll, {
        threshold: 0.1
    });

    // Apply scroll animations to various elements
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .project-card, .skill-item, .about-text, .about-visual'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(el);
    });

    // Interactive cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-inner"></div>';
    document.body.appendChild(cursor);

    const cursorInner = cursor.querySelector('.cursor-inner');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll(
        'a, button, .project-card, .skill-item, .social-link, .social-link-contact'
    );

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Form handling with real email functionality
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default submission initially
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Animate button during submission
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message 🌸';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';
            
            // Try Formspree first
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showSuccessMessage();
                    this.reset();
                } else {
                    throw new Error('Formspree failed');
                }
            }).catch(error => {
                console.log('Formspree failed, using mailto fallback');
                // Fallback to mailto
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');
                
                const mailtoLink = `mailto:fithisalma@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
                window.open(mailtoLink);
                
                showSuccessMessage('Your email client should open now. If not, please email me directly at fithisalma@gmail.com');
            }).finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
            });
        });
    }
    
    function showSuccessMessage(customMessage = null) {
        // Create success overlay
        const successOverlay = document.createElement('div');
        successOverlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(26, 26, 46, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.5s ease;
            ">
                <div style="
                    text-align: center;
                    background: linear-gradient(135deg, #1a1a2e 0%, #2a2a40 100%);
                    padding: 3rem;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 107, 157, 0.3);
                    box-shadow: 0 20px 40px rgba(255, 107, 157, 0.2);
                    max-width: 500px;
                    margin: 1rem;
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🌸✨</div>
                    <h2 style="color: #ff6b9d; font-family: 'Playfair Display', serif; margin-bottom: 1rem;">Message Sent Successfully!</h2>
                    <p style="color: #b8b8b8; margin-bottom: 2rem;">
                        ${customMessage || "Thank you for reaching out! I'll get back to you soon 💅🏻"}
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 15px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Close 🎀
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(successOverlay);
    }

    // Emoji rain animation (celebration effect)
    function dropEmoji() {
        const emojis = ['🌸', '💅🏻', '✨', '💖', '🎀', '💄', '👑', '💍'];
        const emoji = document.createElement('div');
        emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: fixed;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            left: ${Math.random() * window.innerWidth}px;
            top: -50px;
            animation: emojiDrop 3s linear forwards;
        `;
        document.body.appendChild(emoji);
        
        setTimeout(() => {
            if (emoji.parentNode) {
                emoji.parentNode.removeChild(emoji);
            }
        }, 3000);
    }

    // Floating animation for tech icons
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
        
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(360deg)';
            icon.style.boxShadow = '0 20px 40px rgba(255, 107, 157, 0.4)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
            icon.style.boxShadow = '';
        });
    });

    // Dynamic background particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #ff6b9d, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight + 10}px;
            animation: floatUp ${3 + Math.random() * 4}s linear forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 7000);
    }

    // Create particles periodically
    setInterval(createParticle, 2000);

    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            to {
                transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
        }
        
        .cursor-inner {
            width: 100%;
            height: 100%;
            background: #ff6b9d;
            border-radius: 50%;
            transition: transform 0.2s ease;
        }
        
        .custom-cursor.cursor-hover .cursor-inner {
            transform: scale(2);
            background: #ffffff;
        }
        
        .particle {
            opacity: 0.6;
        }
        
        @media (max-width: 768px) {
            .custom-cursor {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);

    // Typewriter effect for hero text
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                heroSubtitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }

    // 3D tilt effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Glitch effect for name
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                heroName.style.textShadow = `
                    2px 0 #ff6b9d,
                    -2px 0 #6c5ce7,
                    0 0 20px #ff6b9d
                `;
                setTimeout(() => {
                    heroName.style.textShadow = '';
                }, 100);
            }
        }, 1000);
    }

    // Create Snake Path Animation
    function createSnakePath() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const snakePath = document.createElement('div');
            snakePath.className = 'snake-path';
            
            for (let i = 0; i < 5; i++) {
                const snakeElement = document.createElement('div');
                snakeElement.className = 'snake-element';
                snakePath.appendChild(snakeElement);
            }
            
            section.appendChild(snakePath);
        });
    }

    // Create Floating Hearts and Emojis
    function createFloatingHearts() {
        const heartsContainer = document.createElement('div');
        heartsContainer.className = 'floating-hearts';
        document.body.appendChild(heartsContainer);

        function addHeart() {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.animationDuration = (5 + Math.random() * 3) + 's';
            heartsContainer.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, 8000);
        }

        // Add hearts periodically
        setInterval(addHeart, 3000);
        
        // Initial hearts
        for (let i = 0; i < 3; i++) {
            setTimeout(addHeart, i * 1000);
        }
    }

    // Add Sparkles to Elements
    function addSparkles(element) {
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            element.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
    }

    // Enhanced Project Card Interactions
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            addSparkles(card);
        });
    });

    // Emoji Rain Effect
    function createEmojiRain() {
        const emojis = ['🌸', '💅🏻', '🦄', '🎀', '💖', '✨', '💎', '🌙'];
        
        function dropEmoji() {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}vw;
                font-size: ${1 + Math.random()}rem;
                pointer-events: none;
                z-index: 1000;
                animation: emojiDrop ${3 + Math.random() * 2}s linear forwards;
            `;
            
            document.body.appendChild(emoji);
            
            setTimeout(() => {
                if (emoji.parentNode) {
                    emoji.remove();
                }
            }, 5000);
        }
        
        // Trigger emoji rain on special interactions
        const specialElements = document.querySelectorAll('.btn-primary, .submit-btn, .social-link');
        specialElements.forEach(el => {
            el.addEventListener('click', () => {
                for (let i = 0; i < 10; i++) {
                    setTimeout(dropEmoji, i * 100);
                }
            });
        });
    }

    // Enhanced Section Emoji Animations
    const sectionEmojis = document.querySelectorAll('.section-emoji');
    sectionEmojis.forEach(emoji => {
        emoji.addEventListener('mouseenter', () => {
            emoji.style.animation = 'none';
            emoji.style.transform = 'scale(1.3) rotate(360deg)';
            emoji.style.filter = 'drop-shadow(0 0 30px rgba(255, 107, 157, 0.8)) hue-rotate(45deg)';
            
            setTimeout(() => {
                emoji.style.animation = '';
                emoji.style.transform = '';
                emoji.style.filter = '';
            }, 1000);
        });
    });

    // Aesthetic Loading Animation
    function createLoadingAnimation() {
        const loader = document.createElement('div');
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeOut 2s ease-in-out 1s forwards;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounceEmoji 1s ease-in-out infinite;">🌸</div>
                    <div style="color: #ff6b9d; font-family: 'Playfair Display', serif; font-size: 1.5rem;">Loading Beautiful Things...</div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    // Magic Cursor Trail
    const magicTrail = [];
    const trailLength = 15;

    function createMagicTrail(e) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #ff6b9d, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: trailFade 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        magicTrail.push(trail);
        
        if (magicTrail.length > trailLength) {
            const oldTrail = magicTrail.shift();
            if (oldTrail.parentNode) {
                oldTrail.remove();
            }
        }
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.remove();
            }
        }, 1000);
    }

    document.addEventListener('mousemove', createMagicTrail);

    // Add floating graduation caps to education section
    function addFloatingCaps() {
        const educationSection = document.querySelector('.education-section');
        if (educationSection) {
            const floatingElements = document.createElement('div');
            floatingElements.className = 'floating-elements';
            
            const caps = ['🎓', '📚', '📜', '🏆'];
            for (let i = 0; i < 4; i++) {
                const cap = document.createElement('div');
                cap.className = 'floating-cap';
                cap.textContent = caps[i];
                cap.style.animationDelay = `${i * 2}s`;
                floatingElements.appendChild(cap);
            }
            
            educationSection.appendChild(floatingElements);
        }
    }

    // Enhanced certification hover effects
    const certItems = document.querySelectorAll('.cert-item');
    certItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            addSparkles(item);
        });
    });

    // Language proficiency animation
    const languageItems = document.querySelectorAll('.language-item');
    languageItems.forEach((item, index) => {
        const level = item.querySelector('.language-level').textContent.toLowerCase();
        
        // Add different colors based on proficiency level
        item.addEventListener('mouseenter', () => {
            if (level.includes('proficiency')) {
                item.style.borderColor = '#00d4aa';
                item.style.boxShadow = '0 15px 30px rgba(0, 212, 170, 0.3)';
            } else if (level.includes('advanced')) {
                item.style.borderColor = '#ff6b9d';
                item.style.boxShadow = '0 15px 30px rgba(255, 107, 157, 0.3)';
            } else if (level.includes('intermediate')) {
                item.style.borderColor = '#6c5ce7';
                item.style.boxShadow = '0 15px 30px rgba(108, 92, 231, 0.3)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.borderColor = '';
            item.style.boxShadow = '';
        });
    });

    // Initialize floating caps
    addFloatingCaps();

    // Initialize all aesthetic features
    createSnakePath();
    createFloatingHearts();
    createEmojiRain();
    // createLoadingAnimation(); // Uncomment if you want loading animation

    // Add new CSS animations
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent += `
        @keyframes emojiDrop {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                visibility: hidden;
            }
        }
        
        @keyframes trailFade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.3);
            }
        }
        
        .section-emoji {
            cursor: pointer;
            user-select: none;
        }
        
        /* Aesthetic text selection */
        ::selection {
            background: rgba(255, 107, 157, 0.3);
            color: #ffffff;
        }
        
        ::-moz-selection {
            background: rgba(255, 107, 157, 0.3);
            color: #ffffff;
        }
    `;
    document.head.appendChild(additionalStyles);

    console.log('🌸 Salma Fithi Portfolio - Dark Feminine 3D Design Loaded Successfully! 🌸');
});
