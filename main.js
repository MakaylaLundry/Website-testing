// Aerotype Developmental Systems - Main JavaScript
// Advanced animations and interactions for modern engineering website

class AerotypeAnimations {
    constructor() {
        this.isInitialized = false;
        this.swarmParticles = [];
        this.connections = [];
        this.scrollProgress = 0;
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.setupScrollEffects();
        this.setupHeroAnimations();
        this.setupSwarmVisualization();
        this.setupProjectSlider();
        this.setupMobileMenu();
        this.setupParallaxEffects();
        
        this.isInitialized = true;
        console.log('Aerotype animations initialized');
    }
    
    setupScrollEffects() {
        const scrollIndicator = document.getElementById('scrollIndicator');
        const gradientBg = document.getElementById('gradientBg');
        
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollProgress = Math.min(scrollTop / docHeight, 1);
            
            // Update scroll indicator
            if (scrollIndicator) {
                scrollIndicator.style.transform = `scaleX(${this.scrollProgress})`;
            }
            
            // Update gradient background
            if (gradientBg) {
                const angle = 135 + (this.scrollProgress * 90);
                const opacity = 0.1 + (this.scrollProgress * 0.2);
                gradientBg.style.background = `
                    linear-gradient(${angle}deg, 
                        #000000 0%, 
                        #1a1a1a ${30 + (this.scrollProgress * 20)}%, 
                        #2a2a2a ${50 + (this.scrollProgress * 30)}%, 
                        #000000 100%
                    )
                `;
            }
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        updateScrollEffects(); // Initial call
    }
    
    setupHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-text');
        
        // Animate hero elements on load
        anime({
            targets: heroElements,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1000,
            delay: anime.stagger(200),
            easing: 'easeOutQuart'
        });
        
        // Re-animate on scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'easeOutQuart'
                    });
                }
            });
        }, { threshold: 0.1 });
        
        heroElements.forEach(el => observer.observe(el));
    }
    
    setupSwarmVisualization() {
        const container = document.getElementById('swarmContainer');
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const numDrones = 25;
        const swarmCenter = { x: containerRect.width / 2, y: containerRect.height / 2 };
        
        // Create drone particles
        for (let i = 0; i < numDrones; i++) {
            const drone = document.createElement('div');
            drone.className = 'drone-particle';
            drone.style.left = Math.random() * containerRect.width + 'px';
            drone.style.top = Math.random() * containerRect.height + 'px';
            container.appendChild(drone);
            
            this.swarmParticles.push({
                element: drone,
                x: Math.random() * containerRect.width,
                y: Math.random() * containerRect.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                id: i
            });
        }
        
        this.animateSwarm();
    }
    
    animateSwarm() {
        const container = document.getElementById('swarmContainer');
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        const time = Date.now() * 0.001;
        
        this.swarmParticles.forEach((particle, index) => {
            // Calculate swarm behavior
            const angle = (index / this.swarmParticles.length) * Math.PI * 2 + time * 0.5;
            const radius = 100 + Math.sin(time + index) * 50;
            
            const targetX = centerX + Math.cos(angle) * radius;
            const targetY = centerY + Math.sin(angle) * radius;
            
            // Smooth movement towards target
            particle.x += (targetX - particle.x) * 0.02;
            particle.y += (targetY - particle.y) * 0.02;
            
            // Boundary checking
            if (particle.x < 0) particle.x = containerRect.width;
            if (particle.x > containerRect.width) particle.x = 0;
            if (particle.y < 0) particle.y = containerRect.height;
            if (particle.y > containerRect.height) particle.y = 0;
            
            // Update position
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            
            // Add pulsing effect
            const pulse = 0.5 + Math.sin(time * 2 + index) * 0.3;
            particle.element.style.opacity = pulse;
            particle.element.style.transform = `scale(${pulse})`;
        });
        
        // Create connection lines between nearby drones
        this.updateConnections();
        
        this.animationFrame = requestAnimationFrame(() => this.animateSwarm());
    }
    
    updateConnections() {
        // Remove old connections
        document.querySelectorAll('.connection-line').forEach(line => line.remove());
        
        const container = document.getElementById('swarmContainer');
        const maxDistance = 80;
        
        for (let i = 0; i < this.swarmParticles.length; i++) {
            for (let j = i + 1; j < this.swarmParticles.length; j++) {
                const p1 = this.swarmParticles[i];
                const p2 = this.swarmParticles[j];
                
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                );
                
                if (distance < maxDistance) {
                    const line = document.createElement('div');
                    line.className = 'connection-line';
                    
                    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                    const opacity = 1 - (distance / maxDistance);
                    
                    line.style.left = p1.x + 'px';
                    line.style.top = p1.y + 'px';
                    line.style.width = distance + 'px';
                    line.style.transform = `rotate(${angle}rad)`;
                    line.style.opacity = opacity * 0.3;
                    
                    container.appendChild(line);
                }
            }
        }
    }
    
    setupProjectSlider() {
        const slider = document.getElementById('projectSlider');
        if (!slider) return;
        
        new Splide(slider, {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            breakpoints: {
                1024: { perPage: 2 },
                768: { perPage: 1 }
            }
        }).mount();
    }
    
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.querySelector('nav');
        
        if (!mobileMenuBtn || !nav) return;
        
        mobileMenuBtn.addEventListener('click', () => {
            // Create mobile menu if it doesn't exist
            let mobileMenu = document.getElementById('mobileMenu');
            
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.id = 'mobileMenu';
                mobileMenu.className = 'md:hidden bg-black bg-opacity-95 backdrop-blur-md border-b border-white border-opacity-10';
                mobileMenu.innerHTML = `
                    <div class="px-6 py-4 space-y-4">
                        <a href="index.html" class="block text-white hover:text-gray-300">Home</a>
                        <a href="projects.html" class="block text-white hover:text-gray-300">Projects</a>
                        <a href="portfolio.html" class="block text-white hover:text-gray-300">Portfolio</a>
                        <a href="about.html" class="block text-white hover:text-gray-300">About</a>
                    </div>
                `;
                nav.appendChild(mobileMenu);
            }
            
            // Toggle menu visibility
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-text');
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }
    
    // Smooth scroll to section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Cleanup function
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.updateScrollEffects);
        window.removeEventListener('scroll', this.updateParallax);
        
        // Clean up swarm particles
        this.swarmParticles = [];
        this.connections = [];
    }
}

// Advanced hover effects for project cards
class HoverEffects {
    static init() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                anime({
                    targets: e.target,
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: 5,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });
            
            card.addEventListener('mouseleave', (e) => {
                anime({
                    targets: e.target,
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });
        });
    }
}

// Text animation effects
class TextAnimations {
    static init() {
        // Split text into characters for advanced animations
        const headings = document.querySelectorAll('h1, h2');
        
        headings.forEach(heading => {
            const text = heading.textContent;
            heading.innerHTML = text.split('').map(char => 
                char === ' ' ? ' ' : `<span class="char">${char}</span>`
            ).join('');
            
            // Animate characters on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const chars = entry.target.querySelectorAll('.char');
                        anime({
                            targets: chars,
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 600,
                            delay: anime.stagger(50),
                            easing: 'easeOutQuart'
                        });
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(heading);
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        
        this.monitor();
    }
    
    monitor() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Log performance issues
            if (this.fps < 30) {
                console.warn('Performance warning: FPS below 30');
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main animations
    const aerotypeAnimations = new AerotypeAnimations();
    
    // Initialize additional effects
    HoverEffects.init();
    TextAnimations.init();
    
    // Initialize performance monitor in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
    
    // Global functions for navigation
    window.aerotype = {
        scrollToSection: (id) => aerotypeAnimations.scrollToSection(id),
        animations: aerotypeAnimations
    };
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when page is hidden
            if (aerotypeAnimations.animationFrame) {
                cancelAnimationFrame(aerotypeAnimations.animationFrame);
            }
        } else {
            // Resume animations when page is visible
            if (aerotypeAnimations.swarmParticles.length > 0) {
                aerotypeAnimations.animateSwarm();
            }
        }
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        aerotypeAnimations.destroy();
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AerotypeAnimations, HoverEffects, TextAnimations };
}