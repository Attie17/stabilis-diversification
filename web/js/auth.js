// Role-Based Access Control System
// Manages who can access AI Copilot for which milestones

const teamRoles = {
    // Leadership with full access
    admin: [
        { name: "Attie Nel", role: "CEO & Project Manager", access: "all", password: "attie2025" },
        { name: "Natasha Jacobs", role: "Finance Manager", access: "all", password: "natasha2025" },
        { name: "Berno Paul", role: "Clinical Lead", access: "all", password: "berno2025" }
    ],
    
    // Team members with specific milestone access
    team: [
        { name: "Lizette Botha", role: "Case Manager", milestones: [], password: "lizette2025" },
        { name: "Bertha Vorster", role: "Admin & Admissions Officer", milestones: [], password: "bertha2025" },
        { name: "Sne Khonyane", role: "Youth Clinical Lead & Wellness Coordinator", milestones: [], password: "sne2025" },
        { name: "Ilse Booysen", role: "After Care Coordinator", milestones: [], password: "ilse2025" },
        { name: "Suzanne Gelderblom", role: "Senior Therapist & Wellness Champion", milestones: [], password: "suzanne2025" }
    ]
};

// Milestone ownership mapping
const milestoneOwners = {
    // TURNAROUND PROJECT
    "T1-M1": ["Natasha Jacobs"], // File VAT Returns - Finance Manager
    "T1-M2": ["Natasha Jacobs"], // SARS Payment Plan - Finance Manager
    "T1-M3": ["Berno Paul"], // Maintenance Cap - Clinical Lead
    "T1-M4": ["Natasha Jacobs"], // 13-Week Cash Forecast - Finance Manager
    "T1-M5": ["Lizette Botha"], // AR Collections Blitz - Case Manager
    "T1-M6": ["Bertha Vorster"], // Pre-Admission Deposits - Admissions Officer
    "T1-M7": ["Attie Nel"], // Headcount Freeze - CEO
    "T1-M8": ["Natasha Jacobs"], // Renegotiate Supplier Terms - Finance Manager
    "T1-M9": ["Berno Paul"], // Clinical Throughput Audit - Clinical Lead
    "T1-M10": ["Lizette Botha"], // Billing & Auth Compliance - Case Manager
    "T1-M11": ["Natasha Jacobs"], // Weekly Cash Meeting - Finance Manager
    "T1-M12": ["Bertha Vorster"], // Patient Satisfaction Survey - Admin
    "T1-M13": ["Berno Paul"], // Staff Retention Strategy - Clinical Lead
    "T1-M14": ["Natasha Jacobs"], // Cost Allocation Model - Finance Manager
    "T1-M15": ["Lizette Botha"], // Medical Aid Panel Review - Case Manager
    "T1-M16": ["Berno Paul"], // Quality Assurance Framework - Clinical Lead
    "T1-M17": ["Natasha Jacobs"], // Financial Controls Documentation - Finance Manager
    "T1-M18": ["Attie Nel"], // 180-Day Review & Handover - CEO & PM
    
    // DIVERSIFICATION PROJECT
    "P1-M1": ["Attie Nel"], // Kick-off Meeting - CEO
    "P1-M2": ["Attie Nel"], // Appoint Leads - CEO
    "P1-M3": ["Berno Paul"], // Operational Mapping - Clinical Lead
    "P1-M4": ["Natasha Jacobs", "Bertha Vorster"], // Pricing & Billing Policy - Finance & Admin
    "P1-M5": ["Lizette Botha"], // Compliance Check - Case Manager
    "P1-M6": ["Attie Nel"], // Finalize Implementation Calendar - Project Manager
    "P2-M1": ["Berno Paul"], // Adult Outpatient Pilot - Adult Clinical Lead
    "P2-M2": ["Bertha Vorster"], // 28-Day Admissions Optimisation - Admissions Officer
    "P2-M3": ["Sne Khonyane"], // Adolescent Outpatient Prep - Youth Clinical Lead
    "P2-M4": ["Ilse Booysen"], // Aftercare Structure - After Care Coordinator
    "P2-M5": ["Attie Nel"], // Revenue Tracking System - Project Manager
    "P2-M6": ["Natasha Jacobs"], // Phase 2 Financial Review - Finance Manager
    "P3-M1": ["Berno Paul"], // Adult Groups Expansion - Clinical Lead
    "P3-M2": ["Sne Khonyane"], // Youth Outpatient Launch - Youth Clinical Lead
    "P3-M3": ["Ilse Booysen"], // Aftercare Pilot - After Care Coordinator
    "P3-M4": ["Sne Khonyane"], // School Outreach Prep - School Outreach Facilitator
    "P3-M5": ["Attie Nel"], // Staff Training Programme - Project Manager
    "P3-M6": ["Natasha Jacobs"], // Phase 3 Financial Review - Finance Manager
    "P4-M1": ["Sne Khonyane"], // School Outreach Launch - School Outreach Facilitator
    "P4-M2": ["Lizette Botha"], // Medical Panel Expansion - Case Manager
    "P4-M3": ["Berno Paul"], // Clinical Protocol Update - Clinical Lead
    "P4-M4": ["Bertha Vorster"], // Admissions Workflow Optimisation - Admissions Officer
    "P4-M5": ["Attie Nel"], // Marketing Campaign - Project Manager
    "P4-M6": ["Natasha Jacobs"], // Phase 4 Financial Review - Finance Manager
    "P5-M1": ["Berno Paul"], // Full Adult Programme Suite - Clinical Lead
    "P5-M2": ["Sne Khonyane"], // Full Youth Programme Suite - Youth Clinical Lead
    "P5-M3": ["Ilse Booysen"], // Aftercare Full Rollout - After Care Coordinator
    "P5-M4": ["Sne Khonyane"], // School Outreach Expansion - School Outreach Facilitator
    "P5-M5": ["Lizette Botha"], // Medical Aid Contracting Review - Case Manager
    "P5-M6": ["Attie Nel"], // Final Project Review - Project Manager
    "P5-M7": ["Natasha Jacobs"], // Financial Performance Report - Finance Manager
    
    // WELLNESS CENTRE PROJECT - PHASE 1
    "W1-M1": ["Sne Khonyane"], // Operational Setup - Coordinator handles day-to-day setup
    "W1-M2": ["Suzanne Gelderblom"], // Practitioner Onboarding - Champion vets and contracts practitioners
    "W1-M3": ["Suzanne Gelderblom"], // Adult Wellness OP Launch - Champion develops curriculum
    "W1-M4": ["Suzanne Gelderblom"], // Adolescent Wellness OP Launch - Champion develops youth curriculum
    "W1-M5": ["Suzanne Gelderblom", "Sne Khonyane"], // School & Corporate Packages - Champion designs, Coordinator delivers
    "W1-M6": ["Sne Khonyane"], // Online/Hybrid Therapy Setup - Coordinator handles tech/scheduling
    "W1-M7": ["Sne Khonyane"], // Launch Marketing & Referral Campaign - Coordinator does outreach
    "W1-M8": ["Suzanne Gelderblom", "Sne Khonyane"], // First 90-Day Review - Both review together
    
    // WELLNESS CENTRE PROJECT - PHASE 1B (Behavioural Addictions)
    "W1B-M1": ["Suzanne Gelderblom"], // Programme Framework & Curriculum Build - Champion designs curricula
    "W1B-M2": ["Suzanne Gelderblom"], // Practitioner Training & Assignment - Champion trains team
    "W1B-M3": ["Sne Khonyane"], // Launch Behavioural Addictions OP Tracks - Coordinator executes
    "W1B-M4": ["Sne Khonyane"], // Develop Teen & Parent Companion Modules - Coordinator develops
    "W1B-M5": ["Sne Khonyane"], // School & Professional Referral Activation - Coordinator does outreach
    "W1B-M6": ["Sne Khonyane"], // Behavioural Addictions Marketing - Coordinator markets
    
    // WELLNESS CENTRE PROJECT - PHASE 2
    "W2-M1": ["Suzanne Gelderblom"], // Scale Practitioner Capacity - Champion recruits and supervises
    "W2-M2": ["Sne Khonyane"], // Strengthen Referral Pipelines - Coordinator does school/GP visits
    "W2-M3": ["Suzanne Gelderblom"], // Launch Specialty Groups - Champion designs group curricula
    "W2-M4": ["Suzanne Gelderblom"], // Add Multi-Modal Services - Champion coordinates multidisciplinary team
    "W2-M5": ["Sne Khonyane"], // Corporate Wellbeing Programme - Coordinator pitches and executes
    "W2-M6": ["Sne Khonyane"], // Digital Presence & Client Experience - Coordinator manages marketing
    "W2-M7": ["Suzanne Gelderblom"], // Clinical Audit & Documentation Review - Champion ensures compliance
    "W2-M8": ["Suzanne Gelderblom", "Natasha Jacobs"], // Financial Review & Pricing - Champion + Finance
    "W2-M9": ["Suzanne Gelderblom", "Sne Khonyane"], // Annual Strategy Review - Both strategize
    
    // WELLNESS CENTRE PROJECT - PHASE 3
    "W3-M1": ["Suzanne Gelderblom"], // Expand Physical Footprint - Champion plans expansion
    "W3-M2": ["Sne Khonyane"], // Open Regional School Partnerships - Coordinator builds partnerships
    "W3-M3": ["Suzanne Gelderblom"], // Launch Family Services Unit - Champion develops family protocols
    "W3-M4": ["Suzanne Gelderblom"], // Develop Online Courses - Champion creates content
    "W3-M5": ["Suzanne Gelderblom"], // External Accreditation - Champion handles professional recognition
    "W3-M6": ["Suzanne Gelderblom", "Sne Khonyane"] // 18-Month Impact Report - Both compile data
};

// Session management
let currentUser = null;

// Initialize - check if user is already logged in
function initAuth() {
    const savedUser = localStorage.getItem('stabilis-user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser();
        initInactivityTracking(); // Start tracking inactivity
    } else {
        showLoginScreen();
    }
}

// Show login screen
function showLoginScreen() {
    const loginHTML = `
        <div class="login-overlay">
            <div class="login-modal">
                <div class="login-header">
                    <h2>🔐 Stabilis Project Access</h2>
                    <p>Sign in to continue</p>
                </div>
                <div class="login-body">
                    <label for="user-select">Select Your Name:</label>
                    <select id="user-select" class="login-select">
                        <option value="">-- Choose Your Name --</option>
                        <optgroup label="Leadership Team">
                            ${teamRoles.admin.map(user => 
                                `<option value="${user.name}">${user.name} (${user.role})</option>`
                            ).join('')}
                        </optgroup>
                        <optgroup label="Project Team">
                            ${teamRoles.team.map(user => 
                                `<option value="${user.name}">${user.name} (${user.role})</option>`
                            ).join('')}
                        </optgroup>
                    </select>
                    
                    <label for="user-password">Password:</label>
                    <input 
                        type="password" 
                        id="user-password" 
                        class="login-input" 
                        placeholder="Use default: firstname2025"
                        autocomplete="current-password"
                    />
                    <div id="login-error" class="login-error" style="display: none;"></div>
                    <div id="login-info" class="login-info" style="display: none;"></div>
                    
                    <button onclick="loginUser()" class="login-btn" id="login-btn" disabled>
                        Sign In
                    </button>
                </div>
                <div class="login-footer">
                    <p>🔒 Default passwords: <strong>firstname2025</strong> (e.g., attie2025)</p>
                    <p class="login-hint">Example: Attie Nel → attie2025, Suzanne Gelderblom → suzanne2025</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loginHTML);
    
    const userSelect = document.getElementById('user-select');
    const passwordInput = document.getElementById('user-password');
    const loginBtn = document.getElementById('login-btn');
    const loginInfo = document.getElementById('login-info');
    
    // Show password hint when user selects their name
    userSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            const firstName = e.target.value.split(' ')[0].toLowerCase();
            loginInfo.innerHTML = `💡 Your default password is: <strong>${firstName}2025</strong>`;
            loginInfo.style.display = 'block';
            loginInfo.style.background = 'rgba(16, 185, 129, 0.2)';
            loginInfo.style.border = '1px solid #10b981';
            loginInfo.style.color = '#6ee7b7';
            loginInfo.style.padding = '0.75rem';
            loginInfo.style.borderRadius = '6px';
            loginInfo.style.marginBottom = '1rem';
            loginInfo.style.fontSize = '0.9rem';
            loginInfo.style.textAlign = 'center';
        } else {
            loginInfo.style.display = 'none';
        }
        checkFormValidity();
    });
    
    // Enable login button when both fields are filled
    function checkFormValidity() {
        loginBtn.disabled = !userSelect.value || !passwordInput.value;
    }
    
    passwordInput.addEventListener('input', checkFormValidity);
    
    // Allow Enter key to submit
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !loginBtn.disabled) {
            loginUser();
        }
    });
}

// Login user
window.loginUser = function() {
    const selectedName = document.getElementById('user-select').value;
    const enteredPassword = document.getElementById('user-password').value;
    const errorDiv = document.getElementById('login-error');
    
    if (!selectedName || !enteredPassword) return;
    
    // Find user in team data
    const adminUser = teamRoles.admin.find(u => u.name === selectedName);
    const teamUser = teamRoles.team.find(u => u.name === selectedName);
    
    const foundUser = adminUser || teamUser;
    
    if (foundUser) {
        // Verify password
        if (foundUser.password === enteredPassword) {
            // Password correct
            currentUser = { ...foundUser };
            currentUser.name = selectedName;
            // Don't store password in localStorage for security
            const userToStore = { ...currentUser };
            delete userToStore.password;
            localStorage.setItem('stabilis-user', JSON.stringify(userToStore));
            
            // Remove login screen
            document.querySelector('.login-overlay').remove();
            
            // Start inactivity tracking
            initInactivityTracking();
            
            // Redirect to landing page
            if (!window.location.pathname.includes('landing.html') && window.location.pathname !== '/') {
                window.location.href = '/';
            } else {
                // Update UI if already on landing
                updateUIForUser();
            }
        } else {
            // Password incorrect
            errorDiv.textContent = '❌ Incorrect password. Please try again.';
            errorDiv.style.display = 'block';
            document.getElementById('user-password').value = '';
            document.getElementById('user-password').focus();
            
            // Hide error after 3 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }
};

// Inactivity timeout configuration
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

// Logout user
window.logoutUser = function(autoLogout = false) {
    const message = autoLogout 
        ? 'Your session has expired due to inactivity. Please sign in again.'
        : 'Are you sure you want to log out?';
    
    if (autoLogout || confirm(message)) {
        currentUser = null;
        localStorage.removeItem('stabilis-user');
        
        // Clear inactivity timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
        
        // Always redirect to landing page (root)
        if (autoLogout) {
            alert(message);
        }
        window.location.href = '/';
    }
};

// Reset inactivity timer
function resetInactivityTimer() {
    // Clear existing timer
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    // Set new timer for 15 minutes
    inactivityTimer = setTimeout(() => {
        logoutUser(true); // Auto-logout
    }, INACTIVITY_TIMEOUT);
}

// Track user activity
function initInactivityTracking() {
    // Events that indicate user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Reset timer on any activity
    activityEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });
    
    // Start initial timer
    resetInactivityTimer();
}

// Update UI based on logged-in user
function updateUIForUser() {
    if (!currentUser) return;
    
    // Add user info to header
    const header = document.querySelector('.header-content') || document.querySelector('header');
    if (header && !document.getElementById('user-info')) {
        const userInfo = document.createElement('div');
        userInfo.id = 'user-info';
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <span class="user-name">👤 ${currentUser.name}</span>
            <button onclick="showChangePasswordModal()" class="change-password-btn" title="Change Password">🔒</button>
            <button onclick="logoutUser()" class="logout-btn">Logout</button>
        `;
        header.appendChild(userInfo);
    }
}

// Show change password modal
window.showChangePasswordModal = function() {
    const modal = document.createElement('div');
    modal.className = 'login-overlay';
    modal.id = 'change-password-modal';
    modal.innerHTML = `
        <div class="login-modal">
            <div class="login-header">
                <h2>🔒 Change Your Password</h2>
                <p>Create a secure password that only you know</p>
            </div>
            <div class="login-body">
                <label for="current-password">Current Password:</label>
                <input 
                    type="password" 
                    id="current-password" 
                    class="login-input" 
                    placeholder="Enter current password"
                />
                
                <label for="new-password">New Password:</label>
                <input 
                    type="password" 
                    id="new-password" 
                    class="login-input" 
                    placeholder="Enter new password (min 6 characters)"
                />
                
                <label for="confirm-password">Confirm New Password:</label>
                <input 
                    type="password" 
                    id="confirm-password" 
                    class="login-input" 
                    placeholder="Re-enter new password"
                />
                
                <div id="password-error" class="login-error" style="display: none;"></div>
                <div id="password-success" class="login-info" style="display: none;"></div>
                
                <button onclick="changePassword()" class="login-btn" id="change-password-btn">
                    Change Password
                </button>
                <button onclick="closeChangePasswordModal()" class="login-btn" style="background: #64748b; margin-top: 0.5rem;">
                    Cancel
                </button>
            </div>
            <div class="login-footer">
                <p>💡 Choose a strong password with letters, numbers, and symbols</p>
                <p class="login-hint">Minimum 6 characters required</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

// Close change password modal
window.closeChangePasswordModal = function() {
    const modal = document.getElementById('change-password-modal');
    if (modal) modal.remove();
};

// Change password function
window.changePassword = function() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorDiv = document.getElementById('password-error');
    const successDiv = document.getElementById('password-success');
    
    // Clear previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        errorDiv.textContent = '❌ All fields are required';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Find current user's stored password
    const adminUser = teamRoles.admin.find(u => u.name === currentUser.name);
    const teamUser = teamRoles.team.find(u => u.name === currentUser.name);
    const userWithPassword = adminUser || teamUser;
    
    // Verify current password
    if (userWithPassword.password !== currentPassword) {
        errorDiv.textContent = '❌ Current password is incorrect';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Validate new password length
    if (newPassword.length < 6) {
        errorDiv.textContent = '❌ New password must be at least 6 characters';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = '❌ New passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Update password in memory
    userWithPassword.password = newPassword;
    
    // Store encrypted indicator (not the actual password)
    const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');
    userPasswords[currentUser.name] = btoa(newPassword); // Basic encoding, not real encryption
    localStorage.setItem('stabilis-passwords', JSON.stringify(userPasswords));
    
    // Show success message
    successDiv.textContent = '✅ Password changed successfully!';
    successDiv.style.display = 'block';
    
    // Close modal after 2 seconds
    setTimeout(() => {
        closeChangePasswordModal();
    }, 2000);
};

// Load custom passwords on init
function loadCustomPasswords() {
    const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');
    
    // Apply custom passwords to teamRoles
    Object.keys(userPasswords).forEach(userName => {
        const password = atob(userPasswords[userName]); // Basic decoding
        
        const adminUser = teamRoles.admin.find(u => u.name === userName);
        const teamUser = teamRoles.team.find(u => u.name === userName);
        const user = adminUser || teamUser;
        
        if (user) {
            user.password = password;
        }
    });
}

// Call this on page load
loadCustomPasswords();

// Check if user can access AI Copilot for a milestone
function canAccessCopilot(milestoneId) {
    if (!currentUser) return false;
    
    // Admin users (CEO, PM, Finance Manager, Clinical Lead) have full access
    if (currentUser.access === "all") return true;
    
    // Check if user is owner of this milestone
    const owners = milestoneOwners[milestoneId] || [];
    return owners.includes(currentUser.name);
}

// Get copilot button HTML based on access
function getCopilotButton(milestoneId, projectType = 'diversification') {
    if (!currentUser) {
        return ''; // No button if not logged in
    }
    
    if (canAccessCopilot(milestoneId)) {
        // User has access - show the button
        const toggleFunction = projectType === 'turnaround' ? 'toggleTurnaroundCopilot' : 'toggleCopilot';
        return `
            <button class="copilot-toggle-btn" onclick="${toggleFunction}('${milestoneId}', event)">
                🤖 AI Copilot - Get Help
            </button>
        `;
    } else {
        // User doesn't have access - show locked message
        const owners = milestoneOwners[milestoneId] || [];
        const ownerNames = owners.join(', ');
        return `
            <div class="copilot-locked">
                <span class="lock-icon">🔒</span>
                <p class="lock-message">AI Copilot available to: <strong>${ownerNames}</strong></p>
                <p class="lock-hint">Contact the milestone owner if you need guidance</p>
            </div>
        `;
    }
}

// Get milestone owner display
function getMilestoneOwnerBadge(milestoneId) {
    const owners = milestoneOwners[milestoneId] || [];
    if (owners.length === 0) return '';
    
    const isCurrentUserOwner = currentUser && owners.includes(currentUser.name);
    const badgeClass = isCurrentUserOwner ? 'owner-badge-you' : 'owner-badge';
    
    return `
        <span class="${badgeClass}" title="Milestone Owner">
            ${isCurrentUserOwner ? '👤 You' : '👤 ' + owners[0]}
        </span>
    `;
}

// Export functions
window.initAuth = initAuth;
window.canAccessCopilot = canAccessCopilot;
window.getCopilotButton = getCopilotButton;
window.getMilestoneOwnerBadge = getMilestoneOwnerBadge;
window.currentUser = () => currentUser;
