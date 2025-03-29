function initMagicLine() {
    const navLinks = document.querySelector('.navLinks');
    const navItems = document.querySelectorAll('.navLinks div');
    
    // Create magic line
    const magicLine = document.createElement('div');
    magicLine.id = 'magic-line';
    navLinks.appendChild(magicLine);
    
    // Initialize after animations
    setTimeout(() => {
        navLinks.classList.add('visible');
        updateMagicLine(navItems[0]);
    }, 2500);
    
    // Hover handler
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            updateMagicLine(item);
        });
        
        item.addEventListener('mouseleave', () => {
            updateMagicLine(document.querySelector('.navLinks div:first-child'));
        });
    });
    
    // Update position
    function updateMagicLine(element) {
        const magicLine = document.getElementById('magic-line');
        if (!magicLine || !element) return;
        
        const itemRect = element.getBoundingClientRect();
        const navRect = navLinks.getBoundingClientRect();
        
        magicLine.style.width = `${itemRect.width}px`;
        magicLine.style.left = `${itemRect.left - navRect.left}px`;
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        updateMagicLine(document.querySelector('.navLinks div:first-child'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cursor
    const circle = document.getElementById('circle');
    const interactiveElements = document.querySelectorAll('.navLinks div, .name span, .subTitle, .logo');
    initMagicLine();
    
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
