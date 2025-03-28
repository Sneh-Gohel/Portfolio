document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cursor
    const circle = document.getElementById('circle');
    const interactiveElements = document.querySelectorAll('.navLinks div, .name span, .subTitle');
    
    let kinet = new Kinet({
        acceleration: 0.06,
        friction: 0.25,
        names: ["x", "y"],
    });

    // Cursor interaction effect
    function handleHoverEffect(x, y) {
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
            } else {
                el.style.transform = 'scale(1)';
            }
        });
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
        new Typed('.subTitle', {
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
        circle.style.display = 'block';
        createParticles();
    }, 3500);

    setTimeout(initTyped, 3800);

    // 5. Handle resize
    window.addEventListener('resize', () => {
        document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
        createParticles();
    });
});