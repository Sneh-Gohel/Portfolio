document.addEventListener('DOMContentLoaded', () => {
    // Get all sections and nav links
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navLinks div');
    const magicLine = document.createElement('div');
    magicLine.id = 'magic-line';
    document.querySelector('.navLinks').appendChild(magicLine);
    
    let currentVisibleSection = 0;
    let isHovering = false;
    let hoveredItem = null;
    
    // Section data with colors
    const sectionData = {
        0: { 
            name: 'Home',
            link: document.querySelector('.navLinks .home'),
            color: '#6f7a74',
            textColor: '#2c2c2c'
        },
        1: { 
            name: 'About',
            link: document.querySelector('.navLinks .about'),
            color: '#8b5e3c',
            textColor: '#5a4a3b'
        },
        2: { 
            name: 'Work',
            link: document.querySelector('.navLinks .work'),
            color: '#ae6d4f',
            textColor: '#5a4a3b'
        },
        3: { 
            name: 'Contact',
            link: document.querySelector('.navLinks .contact'),
            color: '#5a4a3b',
            textColor: '#2c2c2c'
        }
    };

    // Initialize magic line
    function initMagicLine() {
        magicLine.style.position = 'absolute';
        magicLine.style.height = '2px';
        magicLine.style.bottom = '0';
        magicLine.style.backgroundColor = sectionData[0].color;
        magicLine.style.transition = 'all 0.3s ease';
        magicLine.style.opacity = '0';
        
        setTimeout(() => {
            magicLine.style.opacity = '1';
            updateMagicLinePosition(sectionData[0].link);
        }, 2500);
    }

    // Update magic line position
    function updateMagicLinePosition(element) {
        if (!element) return;
        
        const itemRect = element.getBoundingClientRect();
        const navRect = document.querySelector('.navLinks').getBoundingClientRect();
        
        magicLine.style.width = `${itemRect.width}px`;
        magicLine.style.left = `${itemRect.left - navRect.left}px`;
        magicLine.style.backgroundColor = sectionData[currentVisibleSection].color;
    }

    // Function to update the active nav link and colors
    function updateActiveNav(index) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.color = '';
        });
        
        // Add active class and colors to current link
        if (sectionData[index]) {
            const currentSection = sectionData[index];
            currentSection.link.classList.add('active');
            currentSection.link.style.color = currentSection.color;
            
            // Update magic line if not hovering
            if (!isHovering) {
                updateMagicLinePosition(currentSection.link);
            }
            
            // Update all nav links text color to match section
            navLinks.forEach(link => {
                link.style.color = currentSection.textColor;
            });
            
            // Active link gets the accent color
            currentSection.link.style.color = currentSection.color;
        }
    }

    // Function to log and update nav
    function updateVisibleSection() {
        // Find which section is most visible
        let maxVisibility = 0;
        let mostVisibleIndex = 0;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const visibility = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const normalizedVisibility = visibility / Math.min(rect.height, window.innerHeight);
            
            if (normalizedVisibility > maxVisibility) {
                maxVisibility = normalizedVisibility;
                mostVisibleIndex = index;
            }
        });
        
        // Only update if the section changed and it's at least 50% visible
        if (mostVisibleIndex !== currentVisibleSection && maxVisibility > 0.5) {
            currentVisibleSection = mostVisibleIndex;
            console.log(`Current section: ${sectionData[currentVisibleSection].name}`);
            updateActiveNav(currentVisibleSection);
        }
    }

    // Hover handlers for nav links
    navLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            isHovering = true;
            hoveredItem = link;
            updateMagicLinePosition(link);
        });
        
        link.addEventListener('mouseleave', () => {
            isHovering = false;
            hoveredItem = null;
            updateMagicLinePosition(sectionData[currentVisibleSection].link);
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections[index].scrollIntoView({ behavior: 'smooth' });
            currentVisibleSection = index;
            updateActiveNav(index);
        });
    });

    // Initialize
    initMagicLine();
    updateActiveNav(0);

    // Use Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0.1, 0.5, 0.9]
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                const index = Array.from(sections).indexOf(entry.target);
                if (index !== -1 && index !== currentVisibleSection) {
                    currentVisibleSection = index;
                    console.log(`Current section: ${sectionData[currentVisibleSection].name}`);
                    updateActiveNav(currentVisibleSection);
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => observer.observe(section));

    // Scroll event listener
    window.addEventListener('scroll', () => {
        if (!window.scrollTimeout) {
            window.scrollTimeout = setTimeout(() => {
                window.scrollTimeout = null;
                updateVisibleSection();
            }, 100);
        }
    });

    // Handle resize
    window.addEventListener('resize', () => {
        updateMagicLinePosition(isHovering ? hoveredItem : sectionData[currentVisibleSection].link);
    });});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cursor
    const circle = document.getElementById('circle');
    const interactiveElements = document.querySelectorAll('.navLinks div, .name span, .subTitle, .logo');
    
    // Position circle at center initially
    circle.style.transform = `translate3d(${window.innerWidth/2}px, ${window.innerHeight/2}px, 0)`;
    circle.style.display = 'block';

    let kinet = new Kinet({
        acceleration: 0.06,  // Slightly higher for quicker response
        friction: 0.25,      // Lower friction for tighter follow
        names: ["x", "y"],
    });

    // Cursor interaction effect
    function handleHoverEffect(x, y) {
        // Text interactions
        interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(x - (rect.left + rect.width/2), 2) + 
                Math.pow(y - (rect.top + rect.height/2), 2)
            );
            
            if (distance < 100) {
                const scale = 1 + (1 - distance/100) * 0.2;
                el.style.transform = `scale(${scale})`;
                el.style.transition = 'transform 0.2s ease';
                
                // Special effect for logo
                if (el.classList.contains('logo')) {
                    el.style.transform += ` rotate(${5 + (1 - distance/100) * 10}deg)`;
                    el.style.filter = `drop-shadow(0 ${(1 - distance/100) * 6}px ${(1 - distance/100) * 12}px rgba(111, 122, 116, 0.3))`;
                }
            } else {
                el.style.transform = 'scale(1)';
                if (el.classList.contains('logo')) {
                    el.style.filter = '';
                }
            }
        });

        // Image 3D effect
        const imageContainer = document.querySelector('.photoFrame');
        const image = document.querySelector('.photoFrame .image');
        if (!imageContainer || !image) return;
        
        const rect = imageContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width/2;
        const centerY = rect.top + rect.height/2;
        const relX = x - centerX;
        const relY = y - centerY;
        
        // Only apply effects when cursor is near the image
        const distanceToImage = Math.sqrt(relX*relX + relY*relY);
        if (distanceToImage < 300) {
            const rotateX = (relY / rect.height * -10).toFixed(2);
            const rotateY = (relX / rect.width * 10).toFixed(2);
            const translateZ = Math.min(distanceToImage * 0.1, 20);
            
            imageContainer.style.transform = `
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
            
            image.style.transform = `
                translateZ(${translateZ}px)
                scale(${1 + translateZ * 0.002})
            `;
            
            image.style.setProperty('--x', `${(x - rect.left)}px`);
            image.style.setProperty('--y', `${(y - rect.top)}px`);
            
            image.style.filter = `drop-shadow(0 0 ${Math.min(distanceToImage/20, 10)}px rgba(111, 122, 116, 0.3))`;
        } else {
            // Reset when cursor is far
            imageContainer.style.transform = '';
            image.style.transform = '';
            image.style.filter = '';
        }
    }

    kinet.on('tick', function(instances) {
        const x = instances.x.current + window.innerWidth/2;
        const y = instances.y.current + window.innerHeight/2;
        
        circle.style.transform = `translate3d(${x}px, ${y}px, 0) 
                                scale(${1 + Math.abs(instances.x.velocity/50)})`;
        
        handleHoverEffect(x, y);
    });

    document.addEventListener('mousemove', function(event) {
        kinet.animate('x', event.clientX - window.innerWidth/2);
        kinet.animate('y', event.clientY - window.innerHeight/2);
    });


    // 2. Create Particles
    function createParticles() {
        const particlesContainer = document.querySelector('.bottom-particles');
        if (!particlesContainer) return;
        
        const particleCount = 80;
        
        for (let i = 0; i < particleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            const size = Math.random() * 0.8 + 0.4;
            const left = Math.random() * 100;
            const delay = Math.random() * 12000;
            const duration = 8000 + Math.random() * 12000;
            const opacity = Math.random() * 0.4 + 0.1;
            
            bubble.style.cssText = `
                left: ${left}%;
                width: ${size}rem;
                height: ${size}rem;
                animation-delay: ${delay}ms;
                animation-duration: ${duration}ms;
                opacity: ${opacity};
                background-color: rgba(241, 239, 230, ${opacity});
            `;
            
            particlesContainer.appendChild(bubble);
        }
    }

    // 3. Typed.js Initialization
    function initTyped() {
        const subtitleElement = document.querySelector('.subTitle');
        if (!subtitleElement) return;
        
        new Typed(subtitleElement, {
            strings: [
                'Full Stack Flutter Developer',
                'Website Developer',
                'Python Developer',
                'VB.NET Developer',
                'AI/ML Developer'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true,
            showCursor: false,
            preStringTyped: (arrayPos, self) => {
                self.el.classList.remove(
                    'role-flutter', 'role-web', 'role-python', 'role-vbnet', 'role-aiml'
                );
                const colors = ['role-flutter', 'role-web', 'role-python', 'role-vbnet', 'role-aiml'];
                self.el.classList.add(colors[arrayPos]);
            }
        });
    }

    // 4. Sequence all animations
    setTimeout(() => {
        createParticles();
    }, 3500);

    setTimeout(initTyped, 3800);

    // 5. Handle resize
    window.addEventListener('resize', () => {
        const bubbles = document.querySelectorAll('.bubble');
        if (bubbles.length) {
            bubbles.forEach(bubble => bubble.remove());
            createParticles();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;

    // Function to scroll to a specific section
    function scrollToSection(index) {
        sections[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        currentSection = index;
    }

    // Use wheel event to detect scroll
    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            e.preventDefault();
            scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            e.preventDefault();
            scrollToSection(currentSection - 1);
        }
    }, {
        passive: false
    });

    // Touch events for mobile devices
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;

        if (deltaY < 0 && currentSection < sections.length - 1) {
            e.preventDefault();
            scrollToSection(currentSection + 1);
        } else if (deltaY > 0 && currentSection > 0) {
            e.preventDefault();
            scrollToSection(currentSection - 1);
        }
    }, {
        passive: false
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const aboutSection = document.getElementById("about");
    const rows = document.querySelectorAll(".styling");

    window.addEventListener("scroll", () => {
        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Calculate when the about section is in view
        const sectionStart = sectionTop - windowHeight;
        const sectionEnd = sectionTop + sectionHeight;

        // Ensure we only animate when within the about section
        if (scrollY > sectionStart && scrollY < sectionEnd) {
            const scrollPositionInSection = scrollY - sectionStart; // Current scroll within the section
            const maxScrollInSection = sectionEnd - sectionStart;     // Max scroll distance within the section
            const scrollProgress = scrollPositionInSection / maxScrollInSection; // Normalized scroll progress

            rows.forEach(row => {
                const direction = row.dataset.direction;
                const speed = parseFloat(row.dataset.speed) || 1; // Get speed multiplier from data attribute
                const movement = scrollProgress * 70 * speed; // Reduced movement range

                if (direction === "left") {
                    row.style.transform = `translateX(-${movement}px)`;
                } else if (direction === "right") {
                    row.style.transform = `translateX(${movement}px)`;
                }
            });
        } else {
            // Reset the position when the user scrolls out of the section
            rows.forEach(row => {
                row.style.transform = 'translateX(0)';
            });
        }
    });
});

// Add this to your script.js
document.addEventListener('DOMContentLoaded', () => {
    // Interactive background effect
    const interactiveBg = document.querySelector('.interactive-bg');
    const aboutSection = document.querySelector('.about-section');
    const portrait = document.querySelector('.portrait');

    aboutSection.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Move gradient positions
        interactiveBg.style.backgroundPosition = 
            `${x * 20}% ${y * 20}%, ${(1 - x) * 20}% ${(1 - y) * 20}%`;
        
        // Slight parallax effect on portrait
        portrait.style.transform = `translate(${x * 10 - 5}px, ${y * 10 - 5}px)`;
    });

    // Reset position when mouse leaves
    aboutSection.addEventListener('mouseleave', () => {
        interactiveBg.style.backgroundPosition = 'center center';
        portrait.style.transform = 'translate(0, 0)';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const bg = document.querySelector('.interactive-bg');
    const leafCount = 12;
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-particle';
        
        const size = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;
        const left = Math.random() * 100;
        const leafDelay = 1.2 + (i * 0.1);
        
        leaf.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-delay: ${delay}s;
            opacity: 0; /* Start hidden */
        `;
        
        // Only add fadeIn animation when section is visible
        if (document.querySelector('.about-section').classList.contains('visible')) {
            leaf.style.animation = `
                float-leaf ${duration}s linear infinite,
                fadeIn 1s ease-out ${leafDelay}s forwards
            `;
        }
        
        bg.appendChild(leaf);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about-section');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'visible' class when section comes into view
                entry.target.classList.add('visible');
                
                // Remove observer after triggering once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% of element is visible

    // Start observing the about section
    if (aboutSection) {
        observer.observe(aboutSection);
    }
});
