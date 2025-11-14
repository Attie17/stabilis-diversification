// Role-Based Access Control System
// Manages who can access AI Copilot for which milestones

const teamRoles = {
    // Leadership with full access
    admin: [
        { name: "Attie Nel", role: "CEO & Project Manager", access: "all" },
        { name: "Natasha Jacobs", role: "Finance Manager", access: "all" },
        { name: "Berno Paul", role: "Clinical Lead", access: "all" }
    ],
    
    // Team members with specific milestone access
    team: [
        { name: "Lizette Botha", role: "Case Manager", milestones: [] },
        { name: "Bertha Vorster", role: "Admin & Admissions Officer", milestones: [] },
        { name: "Sne Khonyane", role: "Youth Clinical Lead & Wellness Coordinator", milestones: [] },
        { name: "Ilse Booysen", role: "After Care Coordinator", milestones: [] },
        { name: "Suzanne Gelderblom", role: "Senior Therapist & Wellness Champion", milestones: [] }
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
                    <p>Please identify yourself to continue</p>
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
                    <button onclick="loginUser()" class="login-btn" id="login-btn" disabled>
                        Continue
                    </button>
                </div>
                <div class="login-footer">
                    <p>⚠️ Select your name to access milestone information and AI Copilot features</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loginHTML);
    
    // Enable login button when selection is made
    document.getElementById('user-select').addEventListener('change', (e) => {
        document.getElementById('login-btn').disabled = !e.target.value;
    });
}

// Login user
window.loginUser = function() {
    const selectedName = document.getElementById('user-select').value;
    if (!selectedName) return;
    
    // Find user in team data
    const adminUser = teamRoles.admin.find(u => u.name === selectedName);
    const teamUser = teamRoles.team.find(u => u.name === selectedName);
    
    currentUser = adminUser || teamUser;
    if (currentUser) {
        currentUser.name = selectedName;
        localStorage.setItem('stabilis-user', JSON.stringify(currentUser));
        
        // Remove login screen
        document.querySelector('.login-overlay').remove();
        
        // Redirect to landing page
        if (!window.location.pathname.includes('landing.html') && window.location.pathname !== '/') {
            window.location.href = '/';
        } else {
            // Update UI if already on landing
            updateUIForUser();
        }
    }
};

// Logout user
window.logoutUser = function() {
    if (confirm('Are you sure you want to log out?')) {
        currentUser = null;
        localStorage.removeItem('stabilis-user');
        location.reload();
    }
};

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
            <button onclick="logoutUser()" class="logout-btn">Logout</button>
        `;
        header.appendChild(userInfo);
    }
}

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
