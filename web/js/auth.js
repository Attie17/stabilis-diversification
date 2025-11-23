// Role-Based Access Control System
// Manages who can access AI Copilot for which milestones

const teamRoles = {
    // Developer with full access
    developer: [
        { name: "Developer", role: "System Administrator", access: "all", password: null }
    ],

    // Leadership with full access
    admin: [
        { name: "Attie Nel", role: "CEO & Project Manager", access: "all", password: null },
        { name: "Nastasha Jacobs", role: "Finance Manager", access: "all", password: null },
        { name: "Lydia Gittens", role: "Medical Manager", access: "all", password: null },
        { name: "Berno Paul", role: "Clinical Manager", access: "all", password: null }
    ],

    // Board members with view-only access
    board: [
        { name: "Ds. Danie van Rensburg", role: "Chairperson", access: "view-only", password: null },
        { name: "Ds. Wynand van Niekerk", role: "SKDBM", access: "view-only", password: null }
    ],

    // Team members with specific milestone access
    team: [
        { name: "Karin Weideman", role: "Operational Manager", milestones: [], password: null },
        { name: "Lizette Botha", role: "Case Manager", milestones: [], password: null },
        { name: "Bertha Vorster", role: "Admin & Admissions Officer", milestones: [], password: null },
        { name: "Sne Khonyane", role: "Youth Clinical Lead & Wellness Coordinator", milestones: [], password: null },
        { name: "Ilse Booysen", role: "After Care Coordinator", milestones: [], password: null },
        { name: "Suzanne Gelderblom", role: "Senior Therapist & Wellness Champion", milestones: [], password: null }
    ]
};

// Milestone ownership mapping
const milestoneOwners = {
    // TURNAROUND PROJECT
    "T1-M1": ["Nastasha Jacobs"], // File VAT Returns - Finance Manager
    "T1-M2": ["Nastasha Jacobs"], // SARS Payment Plan - Finance Manager
    "T1-M3": ["Berno Paul"], // Maintenance Cap - Clinical Lead
    "T1-M4": ["Nastasha Jacobs"], // 13-Week Cash Forecast - Finance Manager
    "T1-M5": ["Lizette Botha"], // AR Collections Blitz - Case Manager
    "T1-M6": ["Lydia Gittens"], // Enforce Pre-Admission Deposits - Medical Manager
    "T1-M7": ["Attie Nel"], // Headcount Freeze - CEO
    "T1-M8": ["Nastasha Jacobs"], // Renegotiate Supplier Terms - Finance Manager
    "T1-M9": ["Berno Paul"], // Clinical Throughput Audit - Clinical Lead
    "T1-M10": ["Lizette Botha"], // Billing & Auth Compliance - Case Manager
    "T1-M11": ["Nastasha Jacobs"], // Weekly Cash Meeting - Finance Manager
    "T1-M12": ["Bertha Vorster"], // Patient Satisfaction Survey - Admin
    "T1-M13": ["Berno Paul"], // Staff Retention Strategy - Clinical Lead
    "T1-M14": ["Nastasha Jacobs"], // Cost Allocation Model - Finance Manager
    "T1-M15": ["Lizette Botha"], // Medical Aid Panel Review - Case Manager
    "T1-M16": ["Berno Paul"], // Quality Assurance Framework - Clinical Lead
    "T1-M17": ["Nastasha Jacobs"], // Financial Controls Documentation - Finance Manager
    "T1-M18": ["Attie Nel"], // 180-Day Review & Handover - CEO & PM
    "T3-M4": ["Lydia Gittens"], // Embed Payer-Aligned Care Pathways - Medical Manager

    // DIVERSIFICATION PROJECT
    "P1-M1": ["Attie Nel"], // Kick-off Meeting - CEO
    "P1-M2": ["Attie Nel"], // Appoint Leads - CEO
    "P1-M3": ["Berno Paul"], // Operational Mapping - Clinical Lead
    "P1-M4": ["Nastasha Jacobs", "Bertha Vorster"], // Pricing & Billing Policy - Finance & Admin
    "P1-M5": ["Lydia Gittens"], // Compliance & Licensing Check - Medical Manager
    "P1-M6": ["Attie Nel"], // Finalize Implementation Calendar - Project Manager
    "P2-M1": ["Berno Paul"], // Adult Outpatient Pilot - Adult Clinical Lead
    "P2-M2": ["Lydia Gittens", "Bertha Vorster"], // 28-Day Admissions Optimisation - Medical Manager & Admissions
    "P2-M3": ["Sne Khonyane"], // Adolescent Outpatient Prep - Youth Clinical Lead
    "P2-M4": ["Ilse Booysen"], // Aftercare Structure - After Care Coordinator
    "P2-M5": ["Attie Nel"], // Revenue Tracking System - Project Manager
    "P2-M6": ["Nastasha Jacobs"], // Phase 2 Financial Review - Finance Manager
    "P3-M1": ["Berno Paul"], // Adult Groups Expansion - Clinical Lead
    "P3-M2": ["Sne Khonyane"], // Youth Outpatient Launch - Youth Clinical Lead
    "P3-M3": ["Ilse Booysen"], // Aftercare Pilot - After Care Coordinator
    "P3-M4": ["Sne Khonyane"], // School Outreach Prep - School Outreach Facilitator
    "P3-M5": ["Attie Nel"], // Staff Training Programme - Project Manager
    "P3-M6": ["Nastasha Jacobs"], // Phase 3 Financial Review - Finance Manager
    "P4-M1": ["Sne Khonyane"], // School Outreach Launch - School Outreach Facilitator
    "P4-M2": ["Lydia Gittens", "Lizette Botha"], // Medical Panel Expansion - Medical Manager & Case Manager
    "P4-M3": ["Berno Paul"], // Clinical Protocol Update - Clinical Lead
    "P4-M4": ["Lydia Gittens"], // Quality Audit - Medical Manager
    "P4-M5": ["Attie Nel"], // Marketing Campaign - Project Manager
    "P4-M6": ["Nastasha Jacobs"], // Phase 4 Financial Review - Finance Manager
    "P5-M1": ["Berno Paul"], // Full Adult Programme Suite - Clinical Lead
    "P5-M2": ["Sne Khonyane"], // Full Youth Programme Suite - Youth Clinical Lead
    "P5-M3": ["Ilse Booysen"], // Aftercare Full Rollout - After Care Coordinator
    "P5-M4": ["Sne Khonyane"], // School Outreach Expansion - School Outreach Facilitator
    "P5-M5": ["Lizette Botha"], // Medical Aid Contracting Review - Case Manager
    "P5-M6": ["Attie Nel"], // Final Project Review - Project Manager
    "P5-M7": ["Nastasha Jacobs"], // Financial Performance Report - Finance Manager

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
    "W2-M8": ["Suzanne Gelderblom", "Nastasha Jacobs"], // Financial Review & Pricing - Champion + Finance
    "W2-M9": ["Suzanne Gelderblom", "Sne Khonyane"], // Annual Strategy Review - Both strategize

    // WELLNESS CENTRE PROJECT - PHASE 3
    "W3-M1": ["Suzanne Gelderblom"], // Expand Physical Footprint - Champion plans expansion
    "W3-M2": ["Sne Khonyane"], // Open Regional School Partnerships - Coordinator builds partnerships
    "W3-M3": ["Suzanne Gelderblom"], // Launch Family Services Unit - Champion develops family protocols
    "W3-M4": ["Suzanne Gelderblom"], // Develop Online Courses - Champion creates content
    "W3-M5": ["Suzanne Gelderblom"], // External Accreditation - Champion handles professional recognition
    "W3-M6": ["Suzanne Gelderblom", "Sne Khonyane"] // 18-Month Impact Report - Both compile data
};

function buildUserOptions() {
    return `
        <optgroup label="System Access">
            ${teamRoles.developer.map(user =>
        `<option value="${user.name}">${user.name} (${user.role})</option>`
    ).join('')}
        </optgroup>
        <optgroup label="Leadership Team">
            ${teamRoles.admin.map(user =>
        `<option value="${user.name}">${user.name} (${user.role})</option>`
    ).join('')}
        </optgroup>
        <optgroup label="Board Members">
            ${teamRoles.board.map(user =>
        `<option value="${user.name}">${user.name} (${user.role})</option>`
    ).join('')}
        </optgroup>
        <optgroup label="Project Team">
            ${teamRoles.team.map(user =>
        `<option value="${user.name}">${user.name} (${user.role})</option>`
    ).join('')}
        </optgroup>
    `;
}

const STEERING_COMMITTEE = ['Attie Nel', 'Nastasha Jacobs', 'Lydia Gittens', 'Berno Paul'];
const BOARD_MEMBERS = ['Ds. Danie van Rensburg', 'Ds. Wynand van Niekerk'];
const EXECUTIVE_USERS = ['Developer', ...STEERING_COMMITTEE, ...BOARD_MEMBERS];
window.EXECUTIVE_USERS = EXECUTIVE_USERS;
window.STEERING_COMMITTEE = STEERING_COMMITTEE;
window.BOARD_MEMBERS = BOARD_MEMBERS;
const DEV_AUTO_LOGIN_KEY = 'stabilis-dev-auto-login';
const DEV_AUTO_LOGIN_DEFAULT_USER = 'Attie Nel';
const DEV_AUTO_LOGIN_PASSWORD = 'stabilis-dev';

function isLocalDevEnvironment() {
    if (typeof window === 'undefined') return false;
    const host = window.location.hostname || '';
    return host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host === '';
}

// Session management
let currentUser = null;
if (typeof window !== 'undefined') {
    window.currentUser = null;
}

function dispatchUserChange(eventType) {
    if (typeof window === 'undefined') return;
    try {
        const detail = {
            user: currentUser ? { ...currentUser } : null,
            type: eventType
        };
        window.dispatchEvent(new CustomEvent('stabilis-user-changed', { detail }));
    } catch (error) {
        console.warn('Failed to broadcast user change', error);
    }
}

function persistLoggedInUser(userObj) {
    currentUser = { ...userObj };
    delete currentUser.password;
    localStorage.setItem('stabilis-user', JSON.stringify(currentUser));
    sessionStorage.setItem('stabilis-session-active', 'true'); // Mark session as active
    if (typeof window !== 'undefined') {
        window.currentUser = currentUser;
    }
    updateUIForUser();
    initInactivityTracking();
    dispatchUserChange('login');
}

function ensureDefaultPassword(userName) {
    const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');
    if (!userPasswords[userName]) {
        userPasswords[userName] = btoa(DEV_AUTO_LOGIN_PASSWORD);
        localStorage.setItem('stabilis-passwords', JSON.stringify(userPasswords));
    }
}

function isExecutiveUser(userName) {
    return EXECUTIVE_USERS.includes(userName);
}

function navigateAfterLogin(fromAutoLogin = false) {
    if (!currentUser) return;
    const onExecutivePage = window.location.pathname.includes('executive-dashboard.html');
    const onProjectPage = window.location.pathname.match(/\/(wellness|turnaround|index)\.html/);
    const onLandingPage = window.location.pathname === '/' || window.location.pathname.includes('landing');

    // After login, immediately redirect to appropriate dashboard
    if (!fromAutoLogin) {
        if (isExecutiveUser(currentUser.name) && !onExecutivePage) {
            // Executive users go to Executive Command
            window.location.href = 'executive-dashboard.html';
            return;
        } else if (!isExecutiveUser(currentUser.name) && (onLandingPage || onExecutivePage)) {
            // Non-executive users go to Project Hub
            window.location.href = 'index.html';
            return;
        }
    }

    // Auto-login: stay on current page unless access denied
    if (fromAutoLogin && onExecutivePage && !isExecutiveUser(currentUser.name)) {
        window.location.href = 'index.html';
    }
}

function shouldAutoLogin() {
    if (!isLocalDevEnvironment()) {
        return false;
    }
    if (sessionStorage.getItem('stabilis-skip-auto-login') === 'true') {
        sessionStorage.removeItem('stabilis-skip-auto-login');
        return false;
    }
    const pref = localStorage.getItem(DEV_AUTO_LOGIN_KEY);
    if (pref === null) {
        localStorage.setItem(DEV_AUTO_LOGIN_KEY, 'true');
        return true;
    }
    return pref === 'true';
}

function autoLoginForDev() {
    if (!shouldAutoLogin()) return false;
    const fallbackUser = teamRoles.admin.find(user => user.name === DEV_AUTO_LOGIN_DEFAULT_USER) || teamRoles.developer[0];
    if (!fallbackUser) return false;
    const autoUser = { ...fallbackUser };
    autoUser.name = fallbackUser.name;
    ensureDefaultPassword(autoUser.name);
    persistLoggedInUser(autoUser);
    console.info(`🔐 Auto-login enabled: signed in as ${autoUser.name}`);
    navigateAfterLogin(true);
    return true;
}

window.enableDevAutoLogin = function () {
    localStorage.setItem(DEV_AUTO_LOGIN_KEY, 'true');
};

window.disableDevAutoLogin = function () {
    localStorage.setItem(DEV_AUTO_LOGIN_KEY, 'false');
};

// Initialize - check if user is already logged in
function initAuth() {
    // Check if this is a fresh session (page reload/refresh)
    const sessionActive = sessionStorage.getItem('stabilis-session-active');
    
    // If no active session marker, this is a reload - sign out and require fresh login
    if (!sessionActive) {
        localStorage.removeItem('stabilis-user');
        currentUser = null;
        if (typeof window !== 'undefined') {
            window.currentUser = null;
        }
    }
    
    // Now check for saved user (will be null if we just cleared it above)
    const savedUser = localStorage.getItem('stabilis-user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (typeof window !== 'undefined') {
            window.currentUser = currentUser;
        }
        sessionStorage.setItem('stabilis-session-active', 'true'); // Mark session as active
        updateUIForUser();
        initInactivityTracking(); // Start tracking inactivity
        return;
    }
    
    // Try auto-login for dev environment
    if (autoLoginForDev()) {
        sessionStorage.setItem('stabilis-session-active', 'true');
        return;
    }
    
    showLoginScreen();
}

// Show login screen
function showLoginScreen() {
    const loginHTML = `
        <div class="login-overlay">
            <div class="login-modal">
                <div class="login-header">
                    <h2>🔐 Stabilis Turnaround Strategy</h2>
                    <p>Sign in to continue</p>
                </div>
                <div class="login-mission">
                    <p>Stabilis exists to end the unbearable pain that makes people self-destruct — by building the resilience that makes that pain survivable.</p>
                </div>
                <div class="login-body">
                    <label for="user-select">Select Your Name:</label>
                    <select id="user-select" class="login-select">
                        <option value="">-- Choose Your Name --</option>
                        ${buildUserOptions()}
                    </select>
                    
                    <label for="user-password">Password:</label>
                    <input 
                        type="password" 
                        id="user-password" 
                        class="login-input" 
                        placeholder="Enter your password"
                        autocomplete="current-password"
                    />
                    <div id="login-error" class="login-error" style="display: none;"></div>
                    <div id="login-info" class="login-info" style="display: none;"></div>
                    
                    <button onclick="loginUser()" class="login-btn" id="login-btn" disabled>
                        Sign In
                    </button>
                    <button type="button" class="link-btn" onclick="resetSelectedUserPassword()">
                        Forgot your password? Reset it
                    </button>
                </div>
                <div class="login-footer">
                    <p>🔒 First time signing in? You'll be prompted to create a password.</p>
                    <button type="button" class="new-user-inline-btn" onclick="startNewUserFlow()">I am new here</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', loginHTML);

    const userSelect = document.getElementById('user-select');
    const passwordInput = document.getElementById('user-password');
    const loginBtn = document.getElementById('login-btn');
    const loginInfo = document.getElementById('login-info');

    // Enable form validation when user selects their name
    userSelect.addEventListener('change', checkFormValidity);

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

function showRegistrationScreen(defaultName = '') {
    document.querySelectorAll('.login-overlay').forEach(overlay => overlay.remove());
    const registrationHTML = `
        <div class="login-overlay" id="registration-overlay">
            <div class="login-modal">
                <div class="login-header">
                    <h2>🆕 Create Your Access</h2>
                    <p>Select your name and create a password to get started</p>
                </div>
                <div class="login-body">
                    <label for="registration-user-select">Select Your Name:</label>
                    <select id="registration-user-select" class="login-select">
                        <option value="">-- Choose Your Name --</option>
                        ${buildUserOptions()}
                    </select>

                    <label for="registration-password">Create Password:</label>
                    <input 
                        type="password" 
                        id="registration-password" 
                        class="login-input" 
                        placeholder="Minimum 6 characters"
                        autocomplete="new-password"
                    />

                    <label for="registration-confirm-password">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="registration-confirm-password" 
                        class="login-input" 
                        placeholder="Re-enter your password"
                        autocomplete="new-password"
                    />

                    <div class="login-info" style="display: block; margin-bottom: 1rem;">
                        You'll be signed in automatically after creating your password.
                    </div>
                    <div id="registration-error" class="login-error" style="display: none;"></div>

                    <button onclick="completeNewUserRegistration()" class="login-btn" id="registration-btn" disabled>
                        Create Password & Sign In
                    </button>
                    <button type="button" class="login-btn secondary-btn" onclick="returnToLoginFromRegistration()">
                        Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', registrationHTML);

    const userSelect = document.getElementById('registration-user-select');
    const passwordInput = document.getElementById('registration-password');
    const confirmInput = document.getElementById('registration-confirm-password');
    const submitBtn = document.getElementById('registration-btn');

    function validateRegistrationForm() {
        const hasSelection = Boolean(userSelect.value);
        const passwordsMatch = passwordInput.value && passwordInput.value === confirmInput.value;
        const meetsLength = passwordInput.value.length >= 6;
        submitBtn.disabled = !(hasSelection && passwordsMatch && meetsLength);
    }

    userSelect.addEventListener('change', validateRegistrationForm);
    passwordInput.addEventListener('input', validateRegistrationForm);
    confirmInput.addEventListener('input', validateRegistrationForm);
    confirmInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !submitBtn.disabled) {
            completeNewUserRegistration();
        }
    });

    if (defaultName) {
        userSelect.value = defaultName;
    }
    validateRegistrationForm();
}

window.returnToLoginFromRegistration = function () {
    const overlay = document.getElementById('registration-overlay');
    if (overlay) overlay.remove();
    showLoginScreen();
};

window.resetSelectedUserPassword = function () {
    const userSelect = document.getElementById('user-select');
    const errorDiv = document.getElementById('login-error');
    const infoDiv = document.getElementById('login-info');

    if (!userSelect) return;

    if (!userSelect.value) {
        if (errorDiv) {
            errorDiv.textContent = '❌ Select your name first so we know which password to reset.';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 3000);
        }
        return;
    }

    const userName = userSelect.value;
    const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');

    if (!userPasswords[userName]) {
        if (infoDiv) {
            infoDiv.textContent = 'ℹ️ No password saved yet. Use “I am new here” to register.';
            infoDiv.style.display = 'block';
        }
        startNewUserFlow(userName);
        return;
    }

    delete userPasswords[userName];
    localStorage.setItem('stabilis-passwords', JSON.stringify(userPasswords));

    if (infoDiv) {
        infoDiv.textContent = '✅ Password cleared. Create a fresh one now.';
        infoDiv.style.display = 'block';
    }

    setTimeout(() => startNewUserFlow(userName), 300);
};

window.completeNewUserRegistration = function () {
    const selectedName = document.getElementById('registration-user-select').value;
    const passwordInput = document.getElementById('registration-password');
    const confirmInput = document.getElementById('registration-confirm-password');
    const errorDiv = document.getElementById('registration-error');
    const submitBtn = document.getElementById('registration-btn');

    if (!selectedName || !passwordInput || !confirmInput) return;

    errorDiv.style.display = 'none';

    if (passwordInput.value.length < 6) {
        errorDiv.textContent = '❌ Password must be at least 6 characters.';
        errorDiv.style.display = 'block';
        return;
    }

    if (passwordInput.value !== confirmInput.value) {
        errorDiv.textContent = '❌ Passwords do not match.';
        errorDiv.style.display = 'block';
        return;
    }

    const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');
    if (userPasswords[selectedName]) {
        errorDiv.textContent = 'ℹ️ This account already has a password. Use Sign In instead.';
        errorDiv.style.display = 'block';
        submitBtn.disabled = true;
        setTimeout(() => {
            returnToLoginFromRegistration();
        }, 2000);
        return;
    }

    const developerUser = teamRoles.developer.find(u => u.name === selectedName);
    const adminUser = teamRoles.admin.find(u => u.name === selectedName);
    const teamUser = teamRoles.team.find(u => u.name === selectedName);
    const foundUser = developerUser || adminUser || teamUser;

    if (!foundUser) {
        errorDiv.textContent = '❌ Could not find that user. Please contact your administrator.';
        errorDiv.style.display = 'block';
        return;
    }

    userPasswords[selectedName] = btoa(passwordInput.value);
    localStorage.setItem('stabilis-passwords', JSON.stringify(userPasswords));

    const overlay = document.getElementById('registration-overlay');
    if (overlay) overlay.remove();

    const loggedInUser = { ...foundUser, name: selectedName };
    persistLoggedInUser(loggedInUser);
    navigateAfterLogin(false);
};

// Login user
window.loginUser = function () {
    const selectedName = document.getElementById('user-select').value;
    const enteredPassword = document.getElementById('user-password').value;
    const errorDiv = document.getElementById('login-error');

    if (!selectedName || !enteredPassword) return;

    // Find user in team data
    const developerUser = teamRoles.developer.find(u => u.name === selectedName);
    const adminUser = teamRoles.admin.find(u => u.name === selectedName);
    const teamUser = teamRoles.team.find(u => u.name === selectedName);

    const foundUser = developerUser || adminUser || teamUser;

    if (foundUser) {
        // Check if this is first login (no password set)
        const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');

        if (!userPasswords[selectedName]) {
            // First time login - create password
            showFirstLoginPasswordSetup(selectedName, enteredPassword, foundUser);
            return;
        }

        // Verify password
        const storedPassword = atob(userPasswords[selectedName]);
        if (storedPassword === enteredPassword) {
            // Password correct
            const overlay = document.querySelector('.login-overlay');
            if (overlay) overlay.remove();
            const loggedInUser = { ...foundUser, name: selectedName };
            persistLoggedInUser(loggedInUser);

            navigateAfterLogin(false);
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

// First login password setup
function showFirstLoginPasswordSetup(userName, attemptedPassword, userObj) {
    const setupHTML = `
        <div class="login-overlay" id="password-setup-overlay">
            <div class="login-modal">
                <div class="login-header">
                    <h2>👋 Welcome, ${userName}!</h2>
                    <p>Please create your password</p>
                </div>
                <div class="login-body">
                    <div class="login-info" style="display: block; background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; color: #93c5fd; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem;">
                        ℹ️ This is your first time signing in. Please create a secure password (minimum 6 characters).
                    </div>
                    
                    <label for="new-user-password">Create Password:</label>
                    <input 
                        type="password" 
                        id="new-user-password" 
                        class="login-input" 
                        placeholder="Minimum 6 characters"
                        autocomplete="new-password"
                    />
                    
                    <label for="confirm-user-password">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirm-user-password" 
                        class="login-input" 
                        placeholder="Re-enter your password"
                        autocomplete="new-password"
                    />
                    
                    <div id="setup-error" class="login-error" style="display: none;"></div>
                    
                    <button onclick="completePasswordSetup()" class="login-btn" id="setup-btn">
                        Create Password & Sign In
                    </button>
                </div>
            </div>
        </div>
    `;

    // Remove old login overlay and add setup
    document.querySelector('.login-overlay').remove();
    document.body.insertAdjacentHTML('beforeend', setupHTML);

    // Store user data temporarily
    window._pendingPasswordSetup = { userName, userObj };

    document.getElementById('new-user-password').focus();
}

// Complete password setup
window.completePasswordSetup = function () {
    if (!window._pendingPasswordSetup) return;

    const { userName, userObj } = window._pendingPasswordSetup;
    const newPassword = document.getElementById('new-user-password').value;
    const confirmPassword = document.getElementById('confirm-user-password').value;
    const errorDiv = document.getElementById('setup-error');

    // Clear previous errors
    errorDiv.style.display = 'none';

    // Validation
    if (!newPassword || !confirmPassword) {
        errorDiv.textContent = '❌ Please fill in both fields';
        errorDiv.style.display = 'block';
        return;
    }

    if (newPassword.length < 6) {
        errorDiv.textContent = '❌ Password must be at least 6 characters';
        errorDiv.style.display = 'block';
        return;
    }

    if (newPassword !== confirmPassword) {
        errorDiv.textContent = '❌ Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }

    // Store password
    const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');
    userPasswords[userName] = btoa(newPassword);
    localStorage.setItem('stabilis-passwords', JSON.stringify(userPasswords));

    // Log user in
    const loggedInUser = { ...userObj };
    loggedInUser.name = userName;
    const overlay = document.getElementById('password-setup-overlay');
    if (overlay) overlay.remove();
    delete window._pendingPasswordSetup;
    persistLoggedInUser(loggedInUser);
    navigateAfterLogin(false);
};

// Inactivity timeout configuration
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

// Logout user
window.logoutUser = function (autoLogout = false) {
    const message = autoLogout
        ? 'Your session has expired due to inactivity. Please sign in again.'
        : 'Are you sure you want to log out?';

    if (autoLogout || confirm(message)) {
        currentUser = null;
        if (typeof window !== 'undefined') {
            window.currentUser = null;
        }
        localStorage.removeItem('stabilis-user');
        sessionStorage.setItem('stabilis-skip-auto-login', 'true');
        dispatchUserChange('logout');

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
            <span class="user-name" style="color: white;">👤 ${currentUser.name}</span>
            <button onclick="showChangePasswordModal()" class="change-password-btn" title="Change Password">🔒</button>
            <button onclick="logoutUser()" class="logout-btn">Logout</button>
        `;
        header.appendChild(userInfo);
    }
}

// Show change password modal
window.showChangePasswordModal = function () {
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
window.closeChangePasswordModal = function () {
    const modal = document.getElementById('change-password-modal');
    if (modal) modal.remove();
};

// Change password function
window.changePassword = function () {
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

    // Get stored password
    const userPasswords = JSON.parse(localStorage.getItem('stabilis-passwords') || '{}');
    const storedPassword = userPasswords[currentUser.name] ? atob(userPasswords[currentUser.name]) : null;

    if (!storedPassword) {
        errorDiv.textContent = '❌ No password found. Please contact administrator.';
        errorDiv.style.display = 'block';
        return;
    }

    // Verify current password
    if (storedPassword !== currentPassword) {
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

    // Store new password
    userPasswords[currentUser.name] = btoa(newPassword);
    localStorage.setItem('stabilis-passwords', JSON.stringify(userPasswords));

    // Show success message
    successDiv.textContent = '✅ Password changed successfully!';
    successDiv.style.display = 'block';

    // Close modal after 2 seconds
    setTimeout(() => {
        closeChangePasswordModal();
    }, 2000);
};

// Explicit entry point for first-time visitors who need to register
window.startNewUserFlow = function (preselectedName = '') {
    sessionStorage.setItem('stabilis-skip-auto-login', 'true');
    localStorage.setItem(DEV_AUTO_LOGIN_KEY, 'false');

    if (currentUser) {
        currentUser = null;
        localStorage.removeItem('stabilis-user');
    }

    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }

    showRegistrationScreen(preselectedName);
};

// Load custom passwords on init - no longer needed since passwords are only in localStorage
// Removed loadCustomPasswords function as all passwords are now stored in localStorage only

// Call initialization (removed loadCustomPasswords call)

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
window.getCurrentUser = () => currentUser;
window.milestoneOwners = milestoneOwners;
