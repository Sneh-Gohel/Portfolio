// projects.js - Complete with all animations and functionality

document.addEventListener('DOMContentLoaded', function() {
    // ========== NAVIGATION ========== //
    const navLinks = document.querySelectorAll('.navLinks div');
    const magicLine = document.createElement('div');
    magicLine.id = 'magic-line';
    document.querySelector('.navLinks').appendChild(magicLine);
    
    // Section data with colors
    const sectionData = {
        2: {  // Focusing on Work section since this is projects page
            name: 'Work',
            link: document.querySelector('.navLinks .work'),
            color: '#ae6d4f',
            textColor: '#5a4a3b'
        }
    };

    // Initialize magic line with animation
    function initMagicLine() {
        magicLine.style.position = 'absolute';
        magicLine.style.height = '3px';
        magicLine.style.bottom = '0';
        magicLine.style.backgroundColor = sectionData[2].color;
        magicLine.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        magicLine.style.opacity = '0';
        magicLine.style.width = '0';
        magicLine.style.borderRadius = '3px';
        
        setTimeout(() => {
            magicLine.style.opacity = '1';
            updateMagicLinePosition(sectionData[2].link);
        }, 1200);
    }

    function updateMagicLinePosition(element) {
        if (!element) return;
        const itemRect = element.getBoundingClientRect();
        const navRect = document.querySelector('.navLinks').getBoundingClientRect();
        magicLine.style.width = `${itemRect.width}px`;
        magicLine.style.left = `${itemRect.left - navRect.left}px`;
    }

    function animateNavLinks() {
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(-15px) rotateX(45deg)';
            link.style.transformOrigin = 'top';
            link.style.filter = 'blur(2px)';
            
            setTimeout(() => {
                link.style.transition = `all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${index * 0.1}s`;
                link.style.opacity = '1';
                link.style.transform = 'translateY(0) rotateX(0)';
                link.style.filter = 'blur(0)';
            }, 500 + (index * 100));
        });
    }

    navLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            magicLine.style.backgroundColor = sectionData[2].color;
            updateMagicLinePosition(link);
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            updateMagicLinePosition(sectionData[2].link);
            link.style.transform = 'translateY(0)';
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.classList.contains('home') ? 'home' : 
                            link.classList.contains('about') ? 'about' :
                            link.classList.contains('work') ? 'work' :
                            link.classList.contains('contact') ? 'contact' : '';
            if (targetId) window.location.href = `index.html#${targetId}`;
        });
    });

    initMagicLine();
    animateNavLinks();

    // ========== PROJECT FILTERING ========== //
    const tabs = document.querySelectorAll('.category-tab');
    const projects = document.querySelectorAll('.project-tile');

    tabs.forEach(tab => {
        tab.style.opacity = '0';
        tab.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            tab.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            tab.style.opacity = '1';
            tab.style.transform = 'translateY(0)';
        }, 1000);
        
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            projects.forEach(project => {
                if (category === 'all' || project.dataset.category === category) {
                    project.style.display = 'grid';
                    // Re-trigger animation
                    project.classList.remove('visible');
                    void project.offsetWidth; // Trigger reflow
                    setTimeout(() => project.classList.add('visible'), 50);
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });

    // ========== CUSTOM CURSOR ========== //
    const circle = document.getElementById('circle');
    if (circle) {
        circle.style.display = 'block';
        circle.style.opacity = '0';
        circle.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            circle.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            circle.style.opacity = '0.7';
            circle.style.transform = 'scale(1)';
        }, 800);
        
        let kinet = new Kinet({
            acceleration: 0.06,
            friction: 0.25,
            names: ["x", "y"],
        });

        kinet.on('tick', function(instances) {
            const x = instances.x.current + window.innerWidth/2;
            const y = instances.y.current + window.innerHeight/2;
            circle.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 + Math.abs(instances.x.velocity/50)})`;
        });

        document.addEventListener('mousemove', function(event) {
            kinet.animate('x', event.clientX - window.innerWidth/2);
            kinet.animate('y', event.clientY - window.innerHeight/2);
        });
    }

    // ========== VIDEO MODAL ========== //
    const videoModal = document.querySelector('.video-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoIframe = document.querySelector('.video-iframe iframe');

    function setupVideoModals() {
    const demoButtons = document.querySelectorAll('.link-button:not(.outline)');
    
    demoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Check if it's a View Code button (has href)
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                return; // Let the link handle the navigation
            }
            
            e.preventDefault();
            
            // Get YouTube ID from data attribute
            const videoId = this.closest('.project-tile').dataset.videoId;
            
            // Validate YouTube ID format
            if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                console.error('Invalid YouTube video ID');
                return;
            }
            
            // Set iframe source with proper parameters
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
            videoIframe.src = embedUrl;
            
            // Show modal with animation
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add a class to the iframe parent for styling
            videoIframe.parentElement.classList.add('loading');
            
            // Handle when the video is ready
            videoIframe.onload = function() {
                this.parentElement.classList.remove('loading');
            };
        });
    });
    
    // Close modal handlers remain the same
    closeModal.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}

    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove iframe src to stop video playback
        setTimeout(() => {
            videoIframe.src = '';
        }, 500);
    }

    // ========== GITHUB REDIRECT ========== //
    function setupGithubLinks() {
        const githubButtons = document.querySelectorAll('.link-button.outline');
        
        githubButtons.forEach(button => {
            // Ensure links open in new tab
            if (button.href && !button.target) {
                button.target = '_blank';
                button.rel = 'noopener noreferrer';
            }
        });
    }

    // ========== ANIMATION SEQUENCE ========== //
    function startAnimationSequence() {
        // Animate showcase header first
        const header = document.querySelector('.showcase-header');
        const h2 = header.querySelector('h2');
        const decoration = header.querySelector('.header-decoration');
        const tabsContainer = header.querySelector('.category-tabs');
        
        setTimeout(() => {
            header.classList.add('visible');
            
            setTimeout(() => {
                h2.classList.add('visible');
                
                setTimeout(() => {
                    decoration.classList.add('visible');
                    
                    setTimeout(() => {
                        tabsContainer.classList.add('visible');
                        
                        // After header is fully loaded, animate project tiles
                        animateProjectTiles();
                    }, 300);
                }, 300);
            }, 300);
        }, 500);
    }

    function animateProjectTiles() {
        const tiles = document.querySelectorAll('.project-tile');
        
        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add('visible');
                
                // Animate tech bubbles with delay
                const bubbles = tile.querySelectorAll('.workBubble');
                bubbles.forEach((bubble, bubbleIndex) => {
                    setTimeout(() => {
                        bubble.classList.add('visible');
                    }, bubbleIndex * 100);
                });
                
                // Add hover effects
                tile.addEventListener('mouseenter', () => {
                    tile.style.transform = 'translateY(-10px)';
                    const visual = tile.querySelector('.project-visual');
                    if (visual) {
                        visual.style.transform = 'perspective(1000px) rotateX(0) translateZ(20px)';
                    }
                });
                
                tile.addEventListener('mouseleave', () => {
                    tile.style.transform = 'translateY(0)';
                    const visual = tile.querySelector('.project-visual');
                    if (visual) {
                        visual.style.transform = 'perspective(1000px) rotateX(0)';
                    }
                });
            }, index * 150);
        });
        
        // After projects animate CTA section
        setTimeout(animateCTASection, tiles.length * 150 + 500);
    }

    function animateCTASection() {
        const cta = document.querySelector('.cta-section');
        if (!cta) return;

        // Remove previous event listeners to avoid duplicates
        cta.removeEventListener('mouseenter', handleCtaHover);
        cta.removeEventListener('mouseleave', handleCtaUnhover);

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cta.classList.add('visible');
                    
                    // Animate shapes with delay
                    const shapes = cta.querySelectorAll('.floating-shape');
                    shapes.forEach((shape, index) => {
                        setTimeout(() => {
                            shape.style.transition = `all 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${index * 0.2}s`;
                            shape.classList.add('visible');
                        }, index * 200);
                    });

                    // Add new event listeners
                    cta.addEventListener('mouseenter', handleCtaHover);
                    cta.addEventListener('mouseleave', handleCtaUnhover);
                    
                    ctaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        ctaObserver.observe(cta);

        // Button ripple effects
        const buttons = cta.querySelectorAll('.link-button');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Don't interfere with actual links
                if (button.href && button.href !== '#') return;
                
                e.preventDefault();
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            });
        });
    }

    function handleCtaHover() {
        this.style.transform = 'translateY(-10px) translateZ(10px)';
        this.style.boxShadow = '0 30px 50px rgba(90, 74, 59, 0.3)';
        
        const shapes = this.querySelectorAll('.floating-shape');
        shapes.forEach(shape => {
            shape.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        });
    }

    function handleCtaUnhover() {
        this.style.transform = '';
        this.style.boxShadow = '';
        
        const shapes = this.querySelectorAll('.floating-shape');
        shapes.forEach(shape => {
            shape.style.transition = 'all 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            shape.classList.add('visible');
        });
    }

    // ========== INITIALIZE EVERYTHING ========== //
    startAnimationSequence();
    setupVideoModals();
    setupGithubLinks();
});