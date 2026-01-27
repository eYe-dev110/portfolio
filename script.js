/**
 * Alex Hu Portfolio - Interactive JavaScript
 * Senior-level animations and interactions
 */

// ==========================================
// Custom Cursor
// ==========================================
class CustomCursor {
    constructor() {
        this.follower = document.querySelector('.cursor-follower');
        this.dot = document.querySelector('.cursor-dot');
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        this.dotX = 0;
        this.dotY = 0;
        
        this.init();
    }
    
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.follower.style.display = 'none';
            this.dot.style.display = 'none';
            return;
        }
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        const interactiveElements = document.querySelectorAll('a, button, .skill-category, .timeline-content, .contact-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.follower.classList.remove('hover'));
        });
        
        this.animate();
    }
    
    animate() {
        this.followerX += (this.mouseX - this.followerX) * 0.1;
        this.followerY += (this.mouseY - this.followerY) * 0.1;
        
        this.dotX += (this.mouseX - this.dotX) * 0.2;
        this.dotY += (this.mouseY - this.dotY) * 0.2;
        
        this.follower.style.left = `${this.followerX - 20}px`;
        this.follower.style.top = `${this.followerY - 20}px`;
        
        this.dot.style.left = `${this.dotX - 4}px`;
        this.dot.style.top = `${this.dotY - 4}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Particle System
// ==========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouseX = 0;
        this.mouseY = 0;
        this.connectionDistance = 150;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.createParticles();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 245, 212, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections to nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
            
            // Mouse interaction
            const mouseDx = particle.x - this.mouseX;
            const mouseDy = particle.y - this.mouseY;
            const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            
            if (mouseDistance < 200) {
                const opacity = (1 - mouseDistance / 200) * 0.3;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouseX, this.mouseY);
                this.ctx.strokeStyle = `rgba(0, 187, 249, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                
                // Slight repulsion from cursor
                const force = (200 - mouseDistance) / 200 * 0.02;
                particle.vx += (mouseDx / mouseDistance) * force;
                particle.vy += (mouseDy / mouseDistance) * force;
            }
            
            // Dampen velocity
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Scroll Reveal Animation
// ==========================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-left, .reveal-right');
        this.init();
    }
    
    init() {
        // Create Intersection Observer
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay based on data attribute or index
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                }
            });
        }, options);
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// ==========================================
// Number Counter Animation
// ==========================================
class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
}

// ==========================================
// Navigation Hide/Show on Scroll
// ==========================================
class StickyNav {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.lastScroll = 0;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 100) {
                this.nav.classList.remove('hidden');
                return;
            }
            
            if (currentScroll > this.lastScroll && currentScroll > 200) {
                // Scrolling down
                this.nav.classList.add('hidden');
            } else {
                // Scrolling up
                this.nav.classList.remove('hidden');
            }
            
            this.lastScroll = currentScroll;
        });
    }
}

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ==========================================
// Magnetic Button Effect
// ==========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-primary, .cta-secondary');
        this.init();
    }
    
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ==========================================
// Typing Effect for Code Window
// ==========================================
class TypeWriter {
    constructor() {
        this.codeElement = document.querySelector('.window-code code');
        this.originalText = this.codeElement.innerHTML;
        this.typed = false;
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.typed) {
                    this.typed = true;
                    this.startTyping();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(this.codeElement);
    }
    
    startTyping() {
        // Add blinking cursor
        this.codeElement.innerHTML = '';
        this.codeElement.style.opacity = '1';
        
        const lines = this.originalText.split('\n');
        let lineIndex = 0;
        let charIndex = 0;
        let currentLine = '';
        
        const typeChar = () => {
            if (lineIndex >= lines.length) return;
            
            const line = lines[lineIndex];
            
            if (charIndex < line.length) {
                currentLine += line[charIndex];
                charIndex++;
                
                // Build current display
                let display = '';
                for (let i = 0; i < lineIndex; i++) {
                    display += lines[i] + '\n';
                }
                display += currentLine;
                this.codeElement.innerHTML = display + '<span class="cursor">|</span>';
                
                setTimeout(typeChar, 10);
            } else {
                // Move to next line
                lineIndex++;
                charIndex = 0;
                currentLine = '';
                
                let display = '';
                for (let i = 0; i < lineIndex; i++) {
                    display += lines[i] + '\n';
                }
                this.codeElement.innerHTML = display + '<span class="cursor">|</span>';
                
                setTimeout(typeChar, 50);
            }
        };
        
        setTimeout(typeChar, 500);
    }
}

// ==========================================
// Tilt Effect for Cards
// ==========================================
class TiltCards {
    constructor() {
        this.cards = document.querySelectorAll('.skill-category, .timeline-content');
        this.init();
    }
    
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

// ==========================================
// Parallax Effect for Hero Section
// ==========================================
class ParallaxHero {
    constructor() {
        this.hero = document.querySelector('.hero-content');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                this.hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                this.hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }
}

// ==========================================
// Active Nav Link Highlight
// ==========================================
class ActiveNavLink {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    
    init() {
        const options = {
            root: null,
            rootMargin: '-50% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, options);
        
        this.sections.forEach(section => observer.observe(section));
    }
}

// ==========================================
// Text Scramble Effect (Hacker Terminal Style)
// ==========================================
class TextScramble {
    constructor() {
        this.element = document.querySelector('.hero-name');
        if (!this.element) return;
        
        this.originalText = this.element.dataset.text || this.element.textContent;
        this.chars = '!<>-_\\/[]{}—=+*^?#_アイウエオカキクケコサシスセソ';
        this.init();
    }
    
    init() {
        // Run scramble on page load
        setTimeout(() => this.scramble(), 800);
        
        // Also run on hover
        this.element.addEventListener('mouseenter', () => this.scramble());
    }
    
    scramble() {
        this.element.classList.add('scrambling');
        let iterations = 0;
        const maxIterations = this.originalText.length;
        
        const interval = setInterval(() => {
            this.element.textContent = this.originalText
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iterations) {
                        return this.originalText[index];
                    }
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');
            
            iterations += 1/3;
            
            if (iterations >= maxIterations) {
                clearInterval(interval);
                this.element.textContent = this.originalText;
                this.element.classList.remove('scrambling');
            }
        }, 30);
    }
}

// ==========================================
// Cursor Trail Effect
// ==========================================
class CursorTrail {
    constructor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.points = [];
        this.maxPoints = 20;
        this.init();
    }
    
    init() {
        // Create trail elements
        for (let i = 0; i < this.maxPoints; i++) {
            const point = document.createElement('div');
            point.className = 'trail-point';
            point.style.cssText = `
                position: fixed;
                width: ${8 - (i * 0.3)}px;
                height: ${8 - (i * 0.3)}px;
                background: rgba(0, 245, 212, ${0.6 - (i * 0.03)});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9997;
                transition: transform 0.1s ease;
                opacity: 0;
            `;
            document.body.appendChild(point);
            this.points.push({ element: point, x: 0, y: 0 });
        }
        
        document.addEventListener('mousemove', (e) => {
            this.points[0].x = e.clientX;
            this.points[0].y = e.clientY;
            this.points[0].element.style.opacity = '1';
        });
        
        this.animate();
    }
    
    animate() {
        for (let i = this.points.length - 1; i > 0; i--) {
            this.points[i].x += (this.points[i-1].x - this.points[i].x) * 0.3;
            this.points[i].y += (this.points[i-1].y - this.points[i].y) * 0.3;
            this.points[i].element.style.left = `${this.points[i].x - 4}px`;
            this.points[i].element.style.top = `${this.points[i].y - 4}px`;
            this.points[i].element.style.opacity = '1';
        }
        
        this.points[0].element.style.left = `${this.points[0].x - 4}px`;
        this.points[0].element.style.top = `${this.points[0].y - 4}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Enhanced Magnetic Buttons
// ==========================================
class EnhancedMagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .contact-card');
        this.init();
    }
    
    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Stronger magnetic pull
                const pull = 0.3;
                button.style.transform = `translate(${x * pull}px, ${y * pull}px) scale(1.02)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }
}

// ==========================================
// Skill Tag Explosion Effect
// ==========================================
class SkillTagEffects {
    constructor() {
        this.tags = document.querySelectorAll('.skill-tag');
        this.init();
    }
    
    init() {
        this.tags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.05}s`;
            
            tag.addEventListener('click', (e) => {
                this.createParticles(e.clientX, e.clientY);
            });
        });
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = 0, posY = 0, opacity = 1;
            
            const animate = () => {
                posX += vx * 0.02;
                posY += vy * 0.02 + 2; // gravity
                opacity -= 0.02;
                
                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}

// ==========================================
// Scroll Progress Indicator
// ==========================================
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.init();
    }
    
    createProgressBar() {
        this.bar = document.createElement('div');
        this.bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
            z-index: 10000;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(0, 245, 212, 0.5);
        `;
        document.body.appendChild(this.bar);
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            this.bar.style.width = `${progress}%`;
        });
    }
}

// ==========================================
// Section Reveal with Counter
// ==========================================
class SectionCounter {
    constructor() {
        this.sections = document.querySelectorAll('.section-number');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateNumber(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.sections.forEach(section => observer.observe(section));
    }
    
    animateNumber(element) {
        const text = element.textContent;
        element.textContent = '00';
        
        setTimeout(() => {
            element.textContent = text;
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = 'numberPulse 2s ease-in-out infinite';
        }, 500);
    }
}

// ==========================================
// IMAGE PARTICLE PORTRAIT - The WOW Factor!
// ==========================================
class ImageParticles {
    constructor() {
        this.canvas = document.getElementById('particle-portrait');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 80 };
        this.imageLoaded = false;
        this.animationPhase = 'assembling'; // 'assembling', 'idle', 'exploding'
        
        // Configuration - Water Cup Fill Effect
        this.particleGap = 2;
        this.particleSize = 2;
        this.returnSpeed = 0.1;
        this.mouseRepelForce = 5;
        
        // Water fill settings
        this.waterLevel = 0; // 0 = empty, 1 = full
        this.fillPerDrop = 0.0008; // Water rises when drops land
        this.phase = 'filling'; // 'filling', 'complete', 'idle'
        this.waveTime = 0;
        this.waveAmplitude = 0;
        this.waveDecay = 0.97;
        
        // Waterfall drops
        this.waterfallDrops = [];
        this.dropSpawnRate = 4; // Drops per frame
        
        // Bubbles
        this.bubbles = [];
        
        // Splash particles at water surface
        this.splashes = [];
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.loadImage();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(dpr, dpr);
        
        this.width = rect.width;
        this.height = rect.height;
    }
    
    loadImage() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.processImage(img);
            this.imageLoaded = true;
            this.animate();
        };
        img.onerror = () => {
            console.log('Image loading failed, creating placeholder effect');
            this.createPlaceholderParticles();
            this.imageLoaded = true;
            this.animate();
        };
        img.src = 'photo.png';
    }
    
    processImage(img) {
        // Create temporary canvas for image processing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Calculate aspect ratio fitting
        const imgAspect = img.width / img.height;
        const canvasAspect = this.width / this.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspect > canvasAspect) {
            drawHeight = this.height;
            drawWidth = this.height * imgAspect;
            offsetX = (this.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = this.width;
            drawHeight = this.width / imgAspect;
            offsetX = 0;
            offsetY = (this.height - drawHeight) / 2;
        }
        
        tempCanvas.width = this.width;
        tempCanvas.height = this.height;
        
        // Draw image centered
        tempCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Get pixel data
        const imageData = tempCtx.getImageData(0, 0, this.width, this.height);
        const pixels = imageData.data;
        
        // Create particles from pixels
        this.particles = [];
        
        for (let y = 0; y < this.height; y += this.particleGap) {
            for (let x = 0; x < this.width; x += this.particleGap) {
                const index = (y * this.width + x) * 4;
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];
                const a = pixels[index + 3];
                
                // Skip transparent pixels only
                if (a < 30) continue;
                const brightness = (r + g + b) / 3;
                if (brightness < 8) continue; // Lower threshold = more detail in dark areas
                
                // Calculate HSL for color enhancement
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const lightness = (max + min) / 2;
                
                // Enhance with accent color for darker areas
                let finalR = r, finalG = g, finalB = b;
                if (brightness < 80) {
                    // Add teal tint to shadows
                    finalR = Math.min(255, r + 10);
                    finalG = Math.min(255, g + 30);
                    finalB = Math.min(255, b + 25);
                }
                
                // Water fill - particles are at their final position from the start
                // They become visible as the water level rises
                
                this.particles.push({
                    x: x,
                    y: y,
                    originX: x,
                    originY: y,
                    vx: 0,
                    vy: 0,
                    color: `rgb(${finalR}, ${finalG}, ${finalB})`,
                    size: this.particleSize,
                    brightness: brightness,
                    // Normalized Y position (0 = top, 1 = bottom)
                    normalizedY: y / this.height,
                    // For wave and idle animation
                    floatPhase: Math.random() * Math.PI * 2,
                    floatSpeed: 0.02 + Math.random() * 0.02,
                    floatRadius: 0.3 + Math.random() * 0.5
                });
            }
        }
        
        console.log(`Created ${this.particles.length} particles`);
    }
    
    createPlaceholderParticles() {
        // Fallback: create a simple particle pattern
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.35;
        
        for (let i = 0; i < 2000; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * radius;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            // Random starting position
            const startAngle = Math.random() * Math.PI * 2;
            const startDist = Math.random() * 500 + 200;
            
            this.particles.push({
                x: centerX + Math.cos(startAngle) * startDist,
                y: centerY + Math.sin(startAngle) * startDist,
                targetX: x,
                targetY: y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0,
                color: `rgba(0, ${Math.random() * 100 + 155}, ${Math.random() * 50 + 180}, 0.8)`,
                size: Math.random() * 2 + 1,
                brightness: 150,
                assembled: false
            });
        }
    }
    
    setupEventListeners() {
        // Mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Mouse leave
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Click to explode
        this.canvas.addEventListener('click', () => {
            this.explode();
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            if (this.imageLoaded) {
                // Recalculate particle positions on resize
                const img = new Image();
                img.onload = () => this.processImage(img);
                img.src = 'photo.png';
            }
        });
    }
    
    explode() {
        // Trigger wave effect
        this.waveAmplitude = 15;
        this.waveTime = 0;
        
        // Create bubbles rising from bottom
        this.createBubbles(30);
    }
    
    createBubbles(count) {
        for (let i = 0; i < count; i++) {
            this.bubbles.push({
                x: Math.random() * this.width,
                y: this.height + Math.random() * 50,
                size: 3 + Math.random() * 8,
                speed: 1 + Math.random() * 3,
                wobblePhase: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.05 + Math.random() * 0.1,
                opacity: 0.3 + Math.random() * 0.5
            });
        }
    }
    
    animate() {
        if (!this.imageLoaded) return;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Spawn waterfall drops (water level rises when drops land, not automatically)
        if (this.phase === 'filling') {
            this.spawnWaterfallDrops();
            
            if (this.waterLevel >= 1) {
                this.waterLevel = 1;
                this.phase = 'complete';
                setTimeout(() => { this.phase = 'idle'; }, 300);
            }
        }
        
        // Update wave
        this.waveTime += 0.1;
        this.waveAmplitude *= this.waveDecay;
        
        // Update and draw waterfall
        this.updateWaterfall();
        
        // Update and draw splashes
        this.updateSplashes();
        
        // Update and draw bubbles
        this.updateBubbles();
        
        // Draw water surface line (during filling)
        if (this.phase === 'filling') {
            this.drawWaterSurface();
        }
        
        this.particles.forEach(particle => {
            // Update float phase
            particle.floatPhase += particle.floatSpeed;
            
            // Calculate if particle is "underwater" (visible)
            // Water fills from bottom (normalizedY = 1) to top (normalizedY = 0)
            const waterLineY = 1 - this.waterLevel; // 1 = bottom, 0 = top
            const isUnderwater = particle.normalizedY >= waterLineY;
            
            if (!isUnderwater && this.phase === 'filling') {
                // Particle is above water - not visible yet
                return;
            }
            
            // Wave effect on particles
            let waveOffsetX = 0;
            let waveOffsetY = 0;
            
            if (this.waveAmplitude > 0.5) {
                // Wave travels from left to right
                const wavePhase = particle.originX * 0.02 - this.waveTime;
                waveOffsetX = Math.sin(wavePhase) * this.waveAmplitude * 0.5;
                waveOffsetY = Math.cos(wavePhase) * this.waveAmplitude * 0.3;
            }
            
            // Gentle floating animation (always)
            const floatX = Math.cos(particle.floatPhase) * particle.floatRadius;
            const floatY = Math.sin(particle.floatPhase * 0.7) * particle.floatRadius;
            
            // Target position with wave and float
            let targetX = particle.originX + floatX + waveOffsetX;
            let targetY = particle.originY + floatY + waveOffsetY;
            
            // Smooth movement to target
            particle.vx += (targetX - particle.x) * this.returnSpeed;
            particle.vy += (targetY - particle.y) * this.returnSpeed;
            
            // Mouse interaction removed
            
            // Apply velocity with friction
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.85;
            particle.vy *= 0.85;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Slight glow for particles near water surface during filling
            if (this.phase === 'filling' && Math.abs(particle.normalizedY - waterLineY) < 0.05) {
                this.ctx.shadowBlur = 6;
                this.ctx.shadowColor = 'rgba(0, 245, 212, 0.8)';
            } else {
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Spawn waterfall drops from top
    spawnWaterfallDrops() {
        const centerX = this.width / 2;
        const spoutWidth = 40;
        
        for (let i = 0; i < this.dropSpawnRate; i++) {
            this.waterfallDrops.push({
                x: centerX + (Math.random() - 0.5) * spoutWidth,
                y: -5,
                vx: (Math.random() - 0.5) * 2,
                vy: 2 + Math.random() * 3,
                size: 2 + Math.random() * 3,
                opacity: 0.6 + Math.random() * 0.4
            });
        }
    }
    
    // Update waterfall drops
    updateWaterfall() {
        const waterSurfaceY = this.height * (1 - this.waterLevel);
        const gravity = 0.3;
        
        this.waterfallDrops = this.waterfallDrops.filter(drop => {
            // Apply gravity
            drop.vy += gravity;
            drop.x += drop.vx;
            drop.y += drop.vy;
            
            // Add slight wobble
            drop.vx += (Math.random() - 0.5) * 0.3;
            
            // Check if hit water surface (or bottom if no water yet)
            const hitSurface = this.waterLevel > 0 ? drop.y >= waterSurfaceY : drop.y >= this.height - 10;
            
            if (hitSurface) {
                // WATER RISES when drop lands!
                this.waterLevel += this.fillPerDrop;
                
                // Create splash
                this.createSplash(drop.x, this.waterLevel > 0 ? waterSurfaceY : this.height - 10);
                // Create small bubbles
                if (Math.random() > 0.6) {
                    this.bubbles.push({
                        x: drop.x + (Math.random() - 0.5) * 10,
                        y: (this.waterLevel > 0 ? waterSurfaceY : this.height - 10) + 10,
                        size: 2 + Math.random() * 4,
                        speed: 0.5 + Math.random() * 1.5,
                        wobblePhase: Math.random() * Math.PI * 2,
                        wobbleSpeed: 0.05 + Math.random() * 0.1,
                        opacity: 0.2 + Math.random() * 0.3
                    });
                }
                return false; // Remove drop
            }
            
            // Draw the drop with trail effect
            this.ctx.save();
            
            // Trail
            const trailLength = Math.min(drop.vy * 3, 20);
            const gradient = this.ctx.createLinearGradient(
                drop.x, drop.y - trailLength,
                drop.x, drop.y
            );
            gradient.addColorStop(0, 'rgba(0, 245, 212, 0)');
            gradient.addColorStop(1, `rgba(0, 245, 212, ${drop.opacity})`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = drop.size;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y - trailLength);
            this.ctx.lineTo(drop.x, drop.y);
            this.ctx.stroke();
            
            // Drop head
            this.ctx.beginPath();
            this.ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 245, 212, ${drop.opacity})`;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = 'rgba(0, 245, 212, 0.5)';
            this.ctx.fill();
            
            this.ctx.restore();
            
            return drop.y < this.height + 50;
        });
    }
    
    // Create splash effect when drop hits water
    createSplash(x, y) {
        const splashCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < splashCount; i++) {
            const angle = -Math.PI + Math.random() * Math.PI; // Upward spread
            const speed = 2 + Math.random() * 4;
            this.splashes.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: 1 + Math.random() * 2,
                opacity: 0.8,
                life: 1
            });
        }
    }
    
    // Update splash particles
    updateSplashes() {
        this.splashes = this.splashes.filter(splash => {
            // Apply gravity
            splash.vy += 0.15;
            splash.x += splash.vx;
            splash.y += splash.vy;
            splash.life -= 0.03;
            splash.opacity = splash.life * 0.8;
            
            // Draw splash
            this.ctx.beginPath();
            this.ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 245, 212, ${splash.opacity})`;
            this.ctx.fill();
            
            return splash.life > 0;
        });
    }
    
    // Draw animated water surface line
    drawWaterSurface() {
        const waterY = this.height * (1 - this.waterLevel);
        
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 245, 212, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(0, 245, 212, 0.5)';
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, waterY);
        
        // Wavy line
        for (let x = 0; x <= this.width; x += 5) {
            const waveY = waterY + Math.sin(x * 0.05 + this.waveTime * 2) * 3;
            this.ctx.lineTo(x, waveY);
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    // Update and draw bubbles
    updateBubbles() {
        this.bubbles = this.bubbles.filter(bubble => {
            // Update position
            bubble.wobblePhase += bubble.wobbleSpeed;
            bubble.x += Math.sin(bubble.wobblePhase) * 1.5; // Wobble side to side
            bubble.y -= bubble.speed; // Rise up
            
            // Slowly shrink as they rise
            bubble.size *= 0.998;
            
            // Draw bubble
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            
            // Bubble gradient for 3D effect
            const gradient = this.ctx.createRadialGradient(
                bubble.x - bubble.size * 0.3, 
                bubble.y - bubble.size * 0.3, 
                0,
                bubble.x, 
                bubble.y, 
                bubble.size
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(0, 245, 212, ${bubble.opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(0, 187, 249, ${bubble.opacity * 0.1})`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Bubble highlight
            this.ctx.beginPath();
            this.ctx.arc(
                bubble.x - bubble.size * 0.3, 
                bubble.y - bubble.size * 0.3, 
                bubble.size * 0.2, 
                0, Math.PI * 2
            );
            this.ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Remove if off screen or too small
            return bubble.y > -bubble.size && bubble.size > 1;
        });
    }
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Wait for fonts to load
    document.fonts.ready.then(() => {
        new CustomCursor();
        new ParticleSystem();
        new ScrollReveal();
        new NumberCounter();
        new StickyNav();
        new SmoothScroll();
        new MagneticButtons();
        new TypeWriter();
        new TiltCards();
        new ParallaxHero();
        new ActiveNavLink();
        
        // NEW: Impressive animations
        new TextScramble();
        new CursorTrail();
        new EnhancedMagneticButtons();
        new SkillTagEffects();
        new ScrollProgress();
        new SectionCounter();
        
        // PHOTO PARTICLE PORTRAIT - The showstopper!
        new ImageParticles();
        
        // Add loaded class for any initial animations
        document.body.classList.add('loaded');
        
        // Console Easter Egg
        console.log('%c🚀 Alex Hu Portfolio', 'font-size: 24px; font-weight: bold; color: #00f5d4;');
        console.log('%cBuilt with passion and precision', 'font-size: 14px; color: #00bbf9;');
        console.log('%cLooking for the source code? Let\'s connect!', 'font-size: 12px; color: #9b5de5;');
    });
});

// Add CSS for typing cursor
const style = document.createElement('style');
style.textContent = `
    .cursor {
        animation: blink 0.8s infinite;
        color: var(--accent-primary);
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .nav-link.active {
        color: var(--accent-primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

