// UI Interaction Handler for NEXUS Agency
'use strict';

document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
});

function initializeUI() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPanels = document.querySelectorAll('.content-panel');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            switchSection(targetSection);
        });
    });

    // VR Button handling
    const vrButton = document.getElementById('vr-button');
    const exitVRButton = document.getElementById('exit-vr');
    
    if (vrButton) {
        vrButton.addEventListener('click', function() {
            if (typeof window.enterVRMode === 'function') {
                window.enterVRMode();
            }
        });
    }
    
    if (exitVRButton) {
        exitVRButton.addEventListener('click', function() {
            if (typeof window.exitVRMode === 'function') {
                window.exitVRMode();
            }
        });
    }

    // CTA Buttons handling
    const ctaButtons = document.querySelectorAll('[data-action]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleCTAAction(action);
        });
    });

    // Service cards interaction
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            handleServiceClick(service);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 245, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 245, 255, 0.2)';
        });
    });

    // Portfolio items interaction
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const project = this.getAttribute('data-project');
            handleProjectClick(project);
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Mouse cursor effects
    initializeCursorEffects();

    // Scroll effects for mobile
    initializeScrollEffects();

    // Auto-hide navigation on mobile
    initializeMobileNavigation();
}

function switchSection(targetSection) {
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPanels = document.querySelectorAll('.content-panel');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === targetSection) {
            link.classList.add('active');
        }
    });

    // Update content panels
    contentPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetSection + '-panel') {
            panel.classList.add('active');
        }
    });

    // Update 3D scene
    if (typeof window.setCurrentSection === 'function') {
        window.setCurrentSection(targetSection);
    }

    // Trigger panel animation
    animatePanelTransition(targetSection);
}

function animatePanelTransition(section) {
    const activePanel = document.getElementById(section + '-panel');
    if (activePanel) {
        // Add entrance animation
        activePanel.style.transform = 'translateY(100%)';
        activePanel.style.opacity = '0';
        
        setTimeout(() => {
            activePanel.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            activePanel.style.transform = 'translateY(0)';
            activePanel.style.opacity = '1';
        }, 50);
    }
}

function handleCTAAction(action) {
    switch(action) {
        case 'explore':
            switchSection('portfolio');
            break;
        case 'contact':
            switchSection('contact');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function handleServiceClick(service) {
    // Create floating information tooltip
    createServiceTooltip(service);
}

function createServiceTooltip(service) {
    const serviceInfo = {
        webgl: {
            title: "Experiências WebGL",
            description: "Criamos mundos 3D interativos que funcionam nativamente no navegador, oferecendo experiências imersivas sem necessidade de plugins.",
            technologies: ["Three.js", "WebGL2", "GLSL Shaders", "Web Workers"]
        },
        vr: {
            title: "Realidade Virtual",
            description: "Desenvolvemos experiências VR para web que funcionam em qualquer dispositivo, desde smartphones até headsets profissionais.",
            technologies: ["WebXR", "A-Frame", "Oculus SDK", "Google Cardboard"]
        },
        ar: {
            title: "Realidade Aumentada",
            description: "Soluções AR que transformam a interação com produtos e serviços, criando conexões únicas entre digital e físico.",
            technologies: ["WebAR", "AR.js", "MediaPipe", "Computer Vision"]
        },
        web: {
            title: "Desenvolvimento Web",
            description: "Sites e aplicações de alta performance com design inovador e tecnologias de ponta para experiências memoráveis.",
            technologies: ["React", "Node.js", "Progressive Web Apps", "WebAssembly"]
        }
    };

    const info = serviceInfo[service];
    if (!info) return;

    // Remove existing tooltip
    const existingTooltip = document.querySelector('.service-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'service-tooltip';
    tooltip.innerHTML = `
        <h4>${info.title}</h4>
        <p>${info.description}</p>
        <div class="tech-list">
            ${info.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <button class="close-tooltip">×</button>
    `;

    // Add styles
    tooltip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid #00f5ff;
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        z-index: 1000;
        backdrop-filter: blur(20px);
        box-shadow: 0 20px 60px rgba(0, 245, 255, 0.3);
        animation: tooltipAppear 0.3s ease-out;
    `;

    document.body.appendChild(tooltip);

    // Add styles for tech tags
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tooltipAppear {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        .service-tooltip h4 {
            color: #00f5ff;
            margin-bottom: 15px;
            font-family: 'Orbitron', monospace;
        }
        .service-tooltip p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .tech-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }
        .tech-tag {
            background: rgba(0, 245, 255, 0.2);
            color: #00f5ff;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            border: 1px solid rgba(0, 245, 255, 0.3);
        }
        .close-tooltip {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: #ff006e;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .close-tooltip:hover {
            background: rgba(255, 0, 110, 0.2);
            border-radius: 50%;
        }
    `;
    document.head.appendChild(style);

    // Close tooltip event
    tooltip.querySelector('.close-tooltip').addEventListener('click', function() {
        tooltip.remove();
        style.remove();
    });

    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closeTooltip(e) {
            if (!tooltip.contains(e.target)) {
                tooltip.remove();
                style.remove();
                document.removeEventListener('click', closeTooltip);
            }
        });
    }, 100);
}

function handleProjectClick(project) {
    const projectInfo = {
        cosmic: "Exploração espacial interativa com física realista e áudio 3D posicional",
        neural: "Visualização imersiva de redes neurais com dados em tempo real",
        dreams: "Arte generativa responsiva que evolui com a interação do usuário",
        quantum: "Simulação quântica interativa para educação científica"
    };

    showProjectModal(project, projectInfo[project] || "Projeto em desenvolvimento");
}

function showProjectModal(project, description) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Projeto: ${project.charAt(0).toUpperCase() + project.slice(1)}</h3>
            <p>${description}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="window.open('#', '_blank')">Ver Demo</button>
                <button class="btn btn-secondary modal-close">Fechar</button>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #00f5ff;
        border-radius: 15px;
        padding: 40px;
        max-width: 500px;
        text-align: center;
        backdrop-filter: blur(20px);
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        submitBtn.textContent = 'Mensagem Enviada!';
        submitBtn.style.background = 'linear-gradient(135deg, #06ffa5, #00d4aa)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(135deg, #00f5ff, #0066cc)';
            form.reset();
        }, 2000);
    }, 1500);
}

function initializeCursorEffects() {
    if (window.innerWidth > 768) { // Only on desktop
        document.body.style.cursor = 'none';
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #00f5ff, #ff006e);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .service-card, .portfolio-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', function() {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
}

function initializeScrollEffects() {
    // Add scroll behavior for mobile panels
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => {
        panel.addEventListener('scroll', function() {
            const scrollPercent = this.scrollTop / (this.scrollHeight - this.clientHeight);
            // Could add visual feedback based on scroll position
        });
    });
}

function initializeMobileNavigation() {
    if (window.innerWidth <= 768) {
        // Auto-hide navigation after selection on mobile
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => {
                    document.querySelector('.nav-overlay').style.transform = 'translateY(-100%)';
                    setTimeout(() => {
                        document.querySelector('.nav-overlay').style.transform = 'translateY(0)';
                    }, 3000);
                }, 500);
            });
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case '1':
            switchSection('home');
            break;
        case '2':
            switchSection('services');
            break;
        case '3':
            switchSection('portfolio');
            break;
        case '4':
            switchSection('team');
            break;
        case '5':
            switchSection('contact');
            break;
        case 'Escape':
            // Close any open modals/tooltips
            document.querySelectorAll('.service-tooltip, .project-modal').forEach(el => el.remove());
            break;
    }
});

// Performance monitoring
let frameCount = 0;
let lastTime = Date.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = Date.now();
    
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
            // Reduce visual complexity on low-end devices
            console.log('Low performance detected, optimizing...');
            document.body.classList.add('low-performance');
        }
        
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(monitorPerformance);
}

monitorPerformance();