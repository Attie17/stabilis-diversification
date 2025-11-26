// PWA Install Prompt Banner
// Shows "Add to Home Screen" prompt for mobile users

let deferredPrompt = null;
let installBannerDismissed = false;

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Install prompt available');
    
    // Prevent default mini-infobar
    e.preventDefault();
    
    // Store event for later use
    deferredPrompt = e;
    
    // Check if user dismissed banner before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Show banner if not dismissed or dismissed more than 7 days ago
    if (!dismissed || dismissedTime < sevenDaysAgo) {
        showInstallBanner();
    }
});

// Show install banner
function showInstallBanner() {
    if (installBannerDismissed) return;
    
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
        <div class="pwa-banner-content">
            <div class="pwa-banner-icon">📱</div>
            <div class="pwa-banner-text">
                <strong>Install Stabilis PMS</strong>
                <p>Add to home screen for quick access</p>
            </div>
            <div class="pwa-banner-actions">
                <button class="pwa-install-btn" onclick="installPWA()">Install</button>
                <button class="pwa-dismiss-btn" onclick="dismissInstallBanner()">×</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add CSS if not already present
    if (!document.getElementById('pwa-install-styles')) {
        const style = document.createElement('style');
        style.id = 'pwa-install-styles';
        style.textContent = `
            .pwa-install-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                z-index: 9999;
                box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
                animation: slideUp 0.3s ease-out;
                padding: env(safe-area-inset-bottom, 0);
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            
            .pwa-banner-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .pwa-banner-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .pwa-banner-text {
                flex: 1;
                min-width: 0;
            }
            
            .pwa-banner-text strong {
                display: block;
                font-size: 1rem;
                margin-bottom: 0.25rem;
            }
            
            .pwa-banner-text p {
                font-size: 0.875rem;
                opacity: 0.9;
                margin: 0;
            }
            
            .pwa-banner-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }
            
            .pwa-install-btn {
                background: white;
                color: #667eea;
                border: none;
                padding: 0.625rem 1.25rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                min-height: 44px;
                font-size: 0.9375rem;
                transition: transform 0.2s;
            }
            
            .pwa-install-btn:active {
                transform: scale(0.95);
            }
            
            .pwa-dismiss-btn {
                background: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                min-width: 44px;
                min-height: 44px;
                border-radius: 50%;
                transition: background 0.2s;
            }
            
            .pwa-dismiss-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            @media (max-width: 640px) {
                .pwa-banner-content {
                    padding: 0.75rem;
                }
                
                .pwa-banner-icon {
                    font-size: 1.5rem;
                }
                
                .pwa-banner-text strong {
                    font-size: 0.9375rem;
                }
                
                .pwa-banner-text p {
                    font-size: 0.8125rem;
                }
                
                .pwa-install-btn {
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Install PWA
window.installPWA = async function() {
    if (!deferredPrompt) {
        console.warn('[PWA] Install prompt not available');
        return;
    }
    
    console.log('[PWA] Showing install prompt');
    
    // Show install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response: ${outcome}`);
    
    // Clear deferred prompt
    deferredPrompt = null;
    
    // Remove banner
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
        banner.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => banner.remove(), 300);
    }
    
    // Track installation
    if (outcome === 'accepted') {
        console.log('[PWA] User accepted install');
        localStorage.setItem('pwa-installed', 'true');
    }
};

// Dismiss banner
window.dismissInstallBanner = function() {
    installBannerDismissed = true;
    
    // Store dismissal timestamp
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    
    // Remove banner with animation
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
        banner.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => banner.remove(), 300);
    }
    
    console.log('[PWA] Install banner dismissed');
};

// Listen for app installed event
window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    localStorage.setItem('pwa-installed', 'true');
    deferredPrompt = null;
    
    // Remove banner if visible
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.remove();
});

// Check if already installed
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('[PWA] Running in standalone mode');
    localStorage.setItem('pwa-installed', 'true');
}

// Add slideDown animation
const slideDownStyle = document.createElement('style');
slideDownStyle.textContent = `
    @keyframes slideDown {
        from { transform: translateY(0); }
        to { transform: translateY(100%); }
    }
`;
document.head.appendChild(slideDownStyle);

console.log('[PWA] Install prompt handler loaded');
