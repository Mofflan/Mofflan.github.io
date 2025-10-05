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

// Add fade-in animation for project cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Project Manager for external file loading
class ProjectManager {
    constructor() {
        this.projects = {};
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            this.projects = data.projects;
            console.log('Projects loaded successfully');
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    async getProjectDetails(projectId) {
        const project = this.projects[projectId];
        if (!project) {
            console.error(`Project ${projectId} not found`);
            return this.getDefaultProject();
        }

        // Load content for each section
        const sectionsWithContent = [];
        
        for (const [sectionId, section] of Object.entries(project.sections)) {
            try {
                const contentResponse = await fetch(section.contentFile);
                const content = await contentResponse.text();
                
                sectionsWithContent.push({
                    id: sectionId,
                    title: section.title,
                    content: content
                });
            } catch (error) {
                console.error(`Error loading content for ${sectionId}:`, error);
                sectionsWithContent.push({
                    id: sectionId,
                    title: section.title,
                    content: `<p>Error loading content for ${section.title}</p>`
                });
            }
        }

        return {
            ...project,
            sections: sectionsWithContent
        };
    }

    getDefaultProject() {
        return {
            sections: [{
                id: "default",
                title: "Description",
                content: "Detailed description coming soon..."
            }],
            screenshots: []
        };
    }
}

// Initialize project manager
const projectManager = new ProjectManager();

// Observe project cards for animation
document.addEventListener('DOMContentLoaded', async () => {
    // Load projects first
    await projectManager.loadProjects();
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Initialize modals and lightbox
    initModals();
    initLightbox();
    initModalTabsSidebar();
});

// Create floating pixel particles in hero section
function createPixelParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create particles
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'pixel-particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        const delay = Math.random() * 3;
        const duration = 6 + Math.random() * 4;
        particle.style.animation = `floatPixel ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = delay + 's';
        
        hero.appendChild(particle);
    }
}

// Simple projects particles
function createProjectParticles() {
    const projectsArea = document.querySelector('.projects-area');
    const host = projectsArea || document.querySelector('.projects');
    if (!host) return;
    
    for (let i = 0; i < 130; i++) {
        const particle = document.createElement('div');
        particle.className = 'project-particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 3;
        particle.style.animation = `floatProjectParticle ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = delay + 's';
        
        host.appendChild(particle);
    }
}

// Contact section particles
function createContactParticles() {
    const contact = document.querySelector('#contact.contact');
    if (!contact) return;

    // Use a moderate number so it feels alive but not busy
    const count = 22;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'contact-particle';

        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 3;
        particle.style.animation = `floatProjectParticle ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = delay + 's';

        contact.appendChild(particle);
    }
}

// Update your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    createPixelParticles();
    createProjectParticles();
    createContactParticles();
});

// Modal tabs sidebar functionality
function initModalTabsSidebar() {
    const modalTabsSidebar = document.getElementById('modalTabsSidebar');
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modalTabsSidebar || !modal) return;
    
    function hideSidebar() {
        modalTabsSidebar.classList.remove('show');
    }
    
    function handleModalClose() {
        hideSidebar();
        if (window.modalTabObserver) {
            window.modalTabObserver.disconnect();
        }
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target.closest('.project-link[href=" "]')) {
            setTimeout(() => {
                setupModalTabsSidebar();
            }, 100);
        }
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', handleModalClose);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            handleModalClose();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            handleModalClose();
        }
    });
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (modal.classList.contains('show')) {
                    setTimeout(() => {
                        setupModalTabsSidebar();
                    }, 100);
                } else {
                    handleModalClose();
                }
            }
        });
    });
    
    observer.observe(modal, { attributes: true });
}

function setupModalTabsSidebar() {
    const modalTabsSidebar = document.getElementById('modalTabsSidebar');
    const modal = document.getElementById('projectModal');
    const tabButtons = modal.querySelectorAll('.tab-button');
    
    if (!tabButtons.length) return;
    
    // Compact-mode detection by viewport width
    const isCompact = () => window.innerWidth <= 1400; // tweak threshold as you prefer

    // If compact, disable and bail out
    if (isCompact()) {
        modalTabsSidebar.classList.add('is-disabled');
        if (window.modalTabObserver) {
            window.modalTabObserver.disconnect();
            delete window.modalTabObserver;
        }
        return;
    } else {
        modalTabsSidebar.classList.remove('is-disabled');
    }

    modalTabsSidebar.innerHTML = '<h4>Navigation</h4>';
    
    tabButtons.forEach((button, index) => {
        const sidebarButton = document.createElement('button');
        sidebarButton.className = 'modal-tab-sidebar-button';
        if (button.classList.contains('active')) {
            sidebarButton.classList.add('active');
        }
        sidebarButton.textContent = button.textContent.trim();
        sidebarButton.setAttribute('data-tab', button.getAttribute('data-tab'));
        sidebarButton.setAttribute('title', button.textContent.trim());
        
        sidebarButton.addEventListener('click', () => {
            switchToTab(button.getAttribute('data-tab'));
        });
        
        modalTabsSidebar.appendChild(sidebarButton);
    });
    
    function alignSidebarToModal() {
        const content = modal.querySelector('.modal-content');
        if (!content || !modalTabsSidebar) return;
        const rect = content.getBoundingClientRect();
        const sidebarRect = modalTabsSidebar.getBoundingClientRect();
        const gap = 0;
        const left = Math.max(0, rect.left - sidebarRect.width - gap);
        const top = rect.top + (rect.height / 2) - (sidebarRect.height / 2);
        modalTabsSidebar.style.left = `${left}px`;
        modalTabsSidebar.style.top = `${Math.max(8, top)}px`;
    }

    const firstTabButton = modal.querySelector('.tab-buttons');
    if (firstTabButton) {
        if (window.modalTabObserver) {
            window.modalTabObserver.disconnect();
        }
        
        window.modalTabObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Respect compact mode on the fly
                    if (isCompact()) {
                        modalTabsSidebar.classList.remove('show');
                        modalTabsSidebar.classList.add('is-disabled');
                        return;
                    }
                    if (!entry.isIntersecting) {
                        alignSidebarToModal();
                        requestAnimationFrame(() => {
                            modalTabsSidebar.classList.add('show');
                        });
                        const rect = modal.querySelector('.modal-content').getBoundingClientRect();
                        const sidebarRect = modalTabsSidebar.getBoundingClientRect();
                        if (rect.left - sidebarRect.width < 0) {
                            modalTabsSidebar.classList.remove('show');
                        }
                    } else {
                        modalTabsSidebar.classList.remove('show');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '60px 0px 0px 0px'
            }
        );
        
        window.modalTabObserver.observe(firstTabButton);
    }
    
    function updateSidebarActiveState() {
        const activeTab = modal.querySelector('.tab-button.active');
        if (activeTab) {
            const activeTabId = activeTab.getAttribute('data-tab');
            modalTabsSidebar.querySelectorAll('.modal-tab-sidebar-button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-tab') === activeTabId) {
                    btn.classList.add('active');
                }
            });
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', updateSidebarActiveState);
    });

    const alignNow = () => {
        if (isCompact()) {
            modalTabsSidebar.classList.remove('show');
            modalTabsSidebar.classList.add('is-disabled');
            return;
        }
        modalTabsSidebar.classList.remove('is-disabled');
        requestAnimationFrame(alignSidebarToModal);
    };
    alignNow();
    window.addEventListener('resize', alignNow, { passive: true });
    window.__modalSidebarAlignHandler = alignNow;
}

function switchToTab(tabId) {
    const modal = document.getElementById('projectModal');
    const container = modal.querySelector('.modal-content');
    const targetButton = modal.querySelector(`.tab-button[data-tab="${tabId}"]`);
    const targetPane = modal.querySelector(`#${tabId}`);
    
    if (targetButton && targetPane) {
        modal.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        modal.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        targetButton.classList.add('active');
        targetPane.classList.add('active');
        
        updateSidebarActiveState();
        
        setTimeout(() => {
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const paneRect = targetPane.getBoundingClientRect();
                const currentScroll = container.scrollTop;
                const offset = 16;
                const deltaTop = (paneRect.top - containerRect.top) + currentScroll - offset;
                container.scrollTo({ top: deltaTop, behavior: 'smooth' });
            } else {
                targetPane.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        }, 50);
    }
}

function updateSidebarActiveState() {
    const modal = document.getElementById('projectModal');
    const modalTabsSidebar = document.getElementById('modalTabsSidebar');
    
    if (!modal || !modalTabsSidebar) return;
    
    const activeTab = modal.querySelector('.tab-button.active');
    if (activeTab) {
        const activeTabId = activeTab.getAttribute('data-tab');
        modalTabsSidebar.querySelectorAll('.modal-tab-sidebar-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === activeTabId) {
                btn.classList.add('active');
            }
        });
    }
}

// Lightbox functionality
function initLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImages = [];
    let currentIndex = 0;
    
    closeLightbox.addEventListener('click', () => {
        closeLightboxModal();
    });
    
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightboxModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
            closeLightboxModal();
        }
        if (lightboxModal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    function showPrevImage() {
        if (currentImages.length > 1) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        }
    }
    
    function showNextImage() {
        if (currentImages.length > 1) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightboxImage();
        }
    }
    
    function updateLightboxImage() {
        lightboxImage.src = currentImages[currentIndex].src;
        lightboxCaption.textContent = currentImages[currentIndex].caption;
        
        lightboxPrev.style.display = currentImages.length > 1 ? 'flex' : 'none';
        lightboxNext.style.display = currentImages.length > 1 ? 'flex' : 'none';
    }
    
    window.openLightbox = function(images, startIndex) {
        currentImages = images;
        currentIndex = startIndex;
        updateLightboxImage();
        lightboxModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    
    function closeLightboxModal() {
        lightboxModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Updated modal functionality
function initModals() {
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', () => {
        closeProjectModal();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeProjectModal();
        }
    });
    
    // Add click handlers to project links - UPDATED FOR PROJECT IDS
    document.querySelectorAll('.project-link[href=" "]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = link.closest('.project-card');
            openProjectModal(projectCard);
        });
    });
}

// UPDATED: Open project modal with external content
async function openProjectModal(projectCard) {
    const modal = document.getElementById('projectModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalBodyEl = modal.querySelector('.modal-body');
    
    // Reset scroll
    if (modalContent) modalContent.scrollTop = 0;
    if (modalBodyEl) modalBodyEl.scrollTop = 0;
    
    // Get project ID from data attribute - NEW
    const projectId = projectCard.getAttribute('data-project-id');
    if (!projectId) {
        console.error('Project card missing data-project-id attribute');
        return;
    }
    
    // Get project data from external files - UPDATED
    const projectData = await projectManager.getProjectDetails(projectId);
    
    // Get basic info from card
    const title = projectCard.querySelector('h3').textContent;
    const gifSrc = projectCard.querySelector('img').src;
    const engine = projectCard.querySelector('.engine-badge').dataset.engine;
    
    // Populate modal
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBanner').src = gifSrc;
    
    // Set engine badge
    const engineBadge = document.getElementById('modalEngine');
    engineBadge.className = 'engine-badge-modal';
    engineBadge.setAttribute('data-engine', engine);
    if (engine === 'FriendshipEngine') {
        engineBadge.style.backgroundImage = `url('assets/icons/friendshiplogo.svg')`;
    } else {
        engineBadge.style.backgroundImage = `url('assets/icons/white${engine.toLowerCase()}.svg')`;
    }
    
    // Build tabbed content
    buildTabbedModalContent(projectData);
    // Populate screenshots grid
    renderModalScreenshots(projectData, gifSrc, title);
    
    // Reset tabs to first one
    try {
        const firstTabBtn = modal.querySelector('.tab-button');
        if (firstTabBtn) {
            modal.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            modal.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            firstTabBtn.classList.add('active');
            const firstPaneId = firstTabBtn.getAttribute('data-tab');
            const firstPane = modal.querySelector(`#${firstPaneId}`);
            if (firstPane) firstPane.classList.add('active');
        }
    } catch {}
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Force-reset scroll
    requestAnimationFrame(() => {
        if (modalContent) modalContent.scrollTop = 0;
        if (modalBodyEl) modalBodyEl.scrollTop = 0;
    });
}

// Render modal screenshots - UNCHANGED
function renderModalScreenshots(projectData, bannerSrc, title) {
    const screenshotsGrid = document.getElementById('screenshotsGrid');
    if (!screenshotsGrid) return;

    if (typeof window.openLightbox !== 'function') {
        try { initLightbox(); } catch (e) { /* no-op */ }
    }

    screenshotsGrid.innerHTML = '';

    const lightboxImages = [
        { src: bannerSrc, caption: `${title} - Main Banner` }
    ];

    const shots = Array.isArray(projectData.screenshots) ? projectData.screenshots : [];

    const addGridItem = (imgSrc, captionText, lightboxIndex) => {
        const item = document.createElement('div');
        item.className = 'screenshot-item';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = captionText;
        img.className = 'screenshot-img clickable-image';
        img.addEventListener('click', () => {
            window.openLightbox(lightboxImages, lightboxIndex);
        });

        const caption = document.createElement('div');
        caption.className = 'screenshot-caption';
        caption.textContent = captionText;

        item.appendChild(img);
        item.appendChild(caption);
        screenshotsGrid.appendChild(item);
    };

    shots.forEach((shot) => {
        const shotObj = typeof shot === 'string' ? { src: shot, caption: '' } : shot;
        const caption = shotObj.caption || `${title}`;
        const idx = lightboxImages.push({ src: shotObj.src, caption }) - 1;
        addGridItem(shotObj.src, caption, idx);
    });

    if (shots.length === 0) {
        addGridItem(bannerSrc, `${title} - Main Banner`, 0);
    }
}

// Build tabbed content - UNCHANGED
function buildTabbedModalContent(projectData) {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="modal-tabs">
            <div class="tab-buttons">
                ${projectData.sections.map((section, index) => `
                    <button class="tab-button ${index === 0 ? 'active' : ''}" data-tab="${section.id}">
                        ${section.title}
                    </button>
                `).join('')}
            </div>
            <div class="tab-content">
                ${projectData.sections.map((section, index) => `
                    <div class="tab-pane ${index === 0 ? 'active' : ''}" id="${section.id}">
                        <div class="section-content">
                            ${section.content}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="modal-screenshots">
            <h3>Screenshots & Features</h3>
            <div class="screenshots-grid" id="screenshotsGrid"></div>
        </div>
    `;

    const tabButtons = modalBody.querySelectorAll('.tab-button');
    const tabPanes = modalBody.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentActiveTab = modalBody.querySelector('.tab-button.active');
            const currentActivePane = modalBody.querySelector('.tab-pane.active');
            const newTabId = button.getAttribute('data-tab');
            const newActivePane = modalBody.querySelector(`#${newTabId}`);
            
            const currentIndex = Array.from(tabButtons).indexOf(currentActiveTab);
            const newIndex = Array.from(tabButtons).indexOf(button);
            const slideDirection = newIndex > currentIndex ? 'slide-right' : 'slide-left';
            
            currentActiveTab.classList.remove('active');
            currentActivePane.classList.remove('active');
            
            currentActivePane.classList.add(slideDirection);
            newActivePane.classList.add(slideDirection);
            
            button.classList.add('active');
            
            setTimeout(() => {
                currentActivePane.classList.remove('slide-left', 'slide-right');
                newActivePane.classList.remove('slide-left', 'slide-right');
                newActivePane.classList.add('active');
            }, 50);
        });
    });
}

// Close project modal - UNCHANGED
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    const modalBodyEl = modal ? modal.querySelector('.modal-body') : null;
    const modalTabsSidebar = document.getElementById('modalTabsSidebar');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
    if (modalBodyEl) {
        modalBodyEl.scrollTop = 0;
    }
    if (modalTabsSidebar) {
        modalTabsSidebar.classList.remove('show');
    }
    if (window.modalTabObserver) {
        window.modalTabObserver.disconnect();
        delete window.modalTabObserver;
    }
    if (window.__modalSidebarAlignHandler) {
        window.removeEventListener('resize', window.__modalSidebarAlignHandler);
        delete window.__modalSidebarAlignHandler;
    }
}


// (Removed duplicate DOMContentLoaded initialization to avoid double setup)