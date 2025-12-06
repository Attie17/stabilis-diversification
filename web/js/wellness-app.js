// Wellness Centre App
// App State
let currentView = 'dashboard';
let currentRiskFilter = 'all';
const REPORT_TITLES = {
    'revenue-projection': 'Revenue Projection Report',
    'cost-analysis': 'Cost Analysis Report',
    'phase-progress': 'Phase Progress Report',
    'risk-assessment': 'Risk Assessment Report',
    'resource-utilization': 'Resource Utilization Report',
    'kpi-dashboard-report': 'KPI Dashboard',
    'timeline-analysis': 'Timeline Analysis Report',
    'budget-actual': 'Budget vs Actual Report',
    'cashflow-projection': 'Cashflow Projection Report',
    'budget-q1-2026': 'Budget Q1 2026 (Dec 2025 - Mar 2026)',
    'budget-fy-2026-27': 'Budget FY 2026-27 (Apr 2026 - Mar 2027)'
};
const PROJECT_REPORT_ACCESS = {
    'revenue-projection': ['Attie Nel', 'Nastasha Jacobs'],
    'cost-analysis': ['Nastasha Jacobs', 'Attie Nel'],
    'phase-progress': ['Attie Nel', 'Berno Paul', 'Lydia Gittens'],
    'risk-assessment': ['Attie Nel', 'Berno Paul', 'Lydia Gittens'],
    'resource-utilization': ['Attie Nel', 'Lydia Gittens'],
    'kpi-dashboard-report': ['Attie Nel', 'Nastasha Jacobs', 'Berno Paul', 'Lydia Gittens'],
    'timeline-analysis': ['Attie Nel'],
    'budget-actual': ['Nastasha Jacobs', 'Attie Nel'],
    'cashflow-projection': ['Nastasha Jacobs', 'Attie Nel']
};

// Utility functions
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return `R${(amount / 1000000).toFixed(1)}m`;
    }
    return `R${amount.toLocaleString()}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDaysUntil(dateString) {
    const target = new Date(dateString);
    const today = new Date();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
}

function getMilestoneStatus() {
    let total = 0;
    let complete = 0;

    wellnessProject.phases.forEach(phase => {
        total += phase.milestones.length;
        complete += phase.milestones.filter(m => m.status === 'complete').length;
    });

    return { total, complete };
}

function getSteeringMembers() {
    return window.STEERING_COMMITTEE || [];
}

function isDeveloperUser() {
    return currentUser && currentUser.name === 'Developer';
}

function ensureUserSession(actionLabel = 'this shortcut') {
    if (currentUser) return true;
    showModal('Sign In Required', `
        <p>Please sign in to use ${actionLabel}.</p>
        <p>Only authenticated steering members can open cross-project navigation.</p>
    `);
    return false;
}

function hasSteeringAccess() {
    if (!currentUser) return false;
    const steering = getSteeringMembers();
    return steering.includes(currentUser.name) || isDeveloperUser();
}

function showSteeringOnlyModal(actionLabel = 'this area') {
    const steering = getSteeringMembers();
    const listMarkup = steering.length
        ? `<ul style="margin-top:0.5rem;">${steering.map(name => `<li>${name}</li>`).join('')}</ul>`
        : '';
    showModal('Navigation Restricted', `
        <h3>${actionLabel} is locked</h3>
        <p>Only the steering committee may access this navigation.</p>
        ${listMarkup}
        <p style="margin-top:0.75rem;">Use the Executive Dashboard for compiled reporting.</p>
    `);
}

function navigateToIfSteering(url, actionLabel) {
    if (!ensureUserSession(actionLabel)) return;
    if (!hasSteeringAccess()) {
        showSteeringOnlyModal(actionLabel);
        return;
    }
    window.location.href = url;
}

function ensureReportAccess(reportKey) {
    if (!currentUser) return false;
    if (hasSteeringAccess()) return true;
    const allowed = PROJECT_REPORT_ACCESS[reportKey] || [];
    return allowed.includes(currentUser.name);
}

function showReportAccessDenied(reportKey) {
    const title = REPORT_TITLES[reportKey] || 'This report';
    const allowed = PROJECT_REPORT_ACCESS[reportKey] || getSteeringMembers();
    const listMarkup = allowed.length
        ? `<ul style="margin-top:0.5rem;">${allowed.map(name => `<li>${name}</li>`).join('')}</ul>`
        : '';
    showModal('Access Restricted', `
        <h3>${title}</h3>
        <p>This report stays limited to its assigned owners.</p>
        ${listMarkup}
        <p style="margin-top:0.75rem;">Executive summaries live on the steering-only dashboard.</p>
    `);
}

function handleReportNavigation(reportKey, url) {
    const label = REPORT_TITLES[reportKey] || 'This report';
    if (!ensureUserSession(label)) return;
    if (!ensureReportAccess(reportKey)) {
        showReportAccessDenied(reportKey);
        return;
    }
    window.location.href = url;
}

// Render copilot buttons based on user access
function renderCopilotButtons() {
    // Wait for getCopilotButton to be available
    if (typeof window.getCopilotButton !== 'function') {
        console.warn('getCopilotButton not yet loaded, retrying...');
        setTimeout(renderCopilotButtons, 100);
        return;
    }

    wellnessProject.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const container = document.getElementById(`copilot-btn-${m.id}`);
            if (container) {
                container.innerHTML = getCopilotButton(m.id, 'wellness');
            } else {
                console.warn(`Copilot container not found for ${m.id}`);
            }
        });
    });
}

// Event Handlers will be defined later - see bindEvents() function below

function switchView(viewName) {
    console.log('🔄 Switching to view:', viewName);
    currentView = viewName;

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const viewElement = document.getElementById(`${viewName}-view`);
    const tabElement = document.querySelector(`[data-view="${viewName}"]`);

    console.log('View element found:', !!viewElement, 'Tab element found:', !!tabElement);

    if (viewElement) viewElement.classList.add('active');
    if (tabElement) tabElement.classList.add('active');

    // Load view-specific content
    if (viewName === 'phases') renderPhases();
    if (viewName === 'risks') renderRisks();
    if (viewName === 'team') renderTeam();

    console.log('✅ View switched to:', viewName);
}

// Initialize
function init() {
    console.log('🚀 Wellness app initializing...');

    // Initialize authentication first
    initAuth();

    updateDashboardStats();
    renderPhases();
    renderCopilotButtons();
    bindEvents();

    console.log('✅ Wellness app initialized');
}

// Update dashboard stats
function updateDashboardStats() {
    const { total, complete } = getMilestoneStatus();
    const progress = total > 0 ? Math.round((complete / total) * 100) : 0;

    const progressEl = document.getElementById('progress-percent');
    const milestonesEl = document.getElementById('milestones-done');
    const riskCountEl = document.getElementById('risk-count');

    if (progressEl) progressEl.textContent = `${progress}%`;
    if (milestonesEl) milestonesEl.textContent = `${complete}/${total}`;
    if (riskCountEl) riskCountEl.textContent = wellnessProject.risks ? wellnessProject.risks.length : '5';

    // Update timeline
    updateTimeline();

    // Update current phase dashboard
    updateCurrentPhaseDashboard();

    // Update next milestones
    updateNextMilestones();
}

// Update timeline progress
function updateTimeline() {
    const projectStart = new Date('2025-11-01');
    const projectEnd = new Date('2027-06-30');
    const today = new Date();

    const totalDays = (projectEnd - projectStart) / (1000 * 60 * 60 * 24);
    const elapsedDays = (today - projectStart) / (1000 * 60 * 60 * 24);
    const progress = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));

    const timelineFill = document.getElementById('timeline-fill');
    if (timelineFill) {
        timelineFill.style.width = `${progress}%`;
    }
}

// Update current phase dashboard
function updateCurrentPhaseDashboard() {
    const currentPhase = wellnessProject.phases.find(p =>
        p.milestones.some(m => m.status !== 'complete')
    ) || wellnessProject.phases[0];

    if (!currentPhase) return;

    const completedMilestones = currentPhase.milestones.filter(m => m.status === 'complete').length;
    const totalMilestones = currentPhase.milestones.length;
    const phaseProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const progressFill = document.getElementById('current-phase-progress');
    const milestonesText = document.getElementById('current-phase-milestones');

    if (progressFill) progressFill.style.width = `${phaseProgress}%`;
    if (milestonesText) milestonesText.textContent = `${completedMilestones} of ${totalMilestones} milestones complete`;
}

// Update next milestones list
function updateNextMilestones() {
    const container = document.getElementById('next-milestones');
    if (!container) return;

    const today = new Date();
    const upcomingMilestones = [];

    wellnessProject.phases.forEach(phase => {
        phase.milestones.forEach(milestone => {
            if (milestone.status !== 'complete') {
                const dueDate = new Date(milestone.dueDate);
                const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                upcomingMilestones.push({
                    ...milestone,
                    phase: phase.name,
                    daysUntil: daysUntil
                });
            }
        });
    });

    // Sort by due date
    upcomingMilestones.sort((a, b) => a.daysUntil - b.daysUntil);

    // Show only next 5
    const nextFive = upcomingMilestones.slice(0, 5);

    if (nextFive.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">All milestones complete!</p>';
        return;
    }

    container.innerHTML = nextFive.map(m => `
        <div class="milestone-item">
            <div class="milestone-checkbox">
                <input type="checkbox" id="milestone-${m.id}" ${m.status === 'complete' ? 'checked' : ''}>
            </div>
            <div class="milestone-content">
                <div class="milestone-title">${m.title}</div>
                <div class="milestone-meta">${m.owner} • ${m.phase}</div>
            </div>
            <div class="milestone-date ${m.daysUntil < 0 ? 'overdue' : m.daysUntil <= 7 ? 'due-soon' : ''}">
                ${m.daysUntil < 0 ? `${Math.abs(m.daysUntil)}d overdue` : m.daysUntil === 0 ? 'Today' : `${m.daysUntil}d`}
            </div>
        </div>
    `).join('');
}

// Render risks view
function renderRisks() {
    const container = document.getElementById('risk-list');
    if (!container) return;

    const risks = wellnessProject.risks || [];
    const filtered = currentRiskFilter === 'all'
        ? risks
        : risks.filter(r => r.severity === currentRiskFilter);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No risks found.</p>';
        return;
    }

    container.innerHTML = filtered.map(risk => `
        <div class="risk-item ${risk.severity}" data-risk="${risk.id}">
            <div class="risk-header">
                <div class="risk-title">${risk.title}</div>
                <div class="risk-badge ${risk.severity}">${risk.impact}/${risk.likelihood}</div>
            </div>
            <div class="risk-description">${risk.description}</div>
            <div class="risk-owner">Owner: ${risk.owner}</div>
        </div>
    `).join('');
}

// Render team view
function renderTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;

    const team = wellnessProject.team || [];

    if (team.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No team members defined yet.</p>';
        return;
    }

    container.innerHTML = team.map(member => `
        <div class="team-card">
            <div class="team-role">${member.role}</div>
            <div class="team-name">${member.name}</div>
            <div class="team-tasks">${member.responsibilities}</div>
        </div>
    `).join('');
}

// Render Phases and Milestones
function renderPhases() {
    const container = document.getElementById('phases-container');
    if (!container) return;

    container.innerHTML = wellnessProject.phases.map(phase => {
        const complete = phase.milestones.filter(m => m.status === 'complete').length;
        const total = phase.milestones.length;
        const progress = Math.round((complete / total) * 100);

        return `
            <div class="phase-card" data-phase-id="${phase.id}">
                <div class="phase-header">
                    <div onclick="togglePhase('${phase.id}', event)" style="flex: 1; cursor: pointer;">
                        <div class="phase-badge">${phase.id}</div>
                        <div class="phase-title">${phase.name}</div>
                        <div class="phase-dates">${phase.timeline}</div>
                        <div class="phase-stats">
                            <div class="phase-stat">
                                <span>📊</span>
                                <span><strong>${complete}/${total}</strong> milestones</span>
                            </div>
                        </div>
                    </div>
                    <button class="expand-btn" onclick="togglePhase('${phase.id}', event)" data-phase="${phase.id}">▼</button>
                </div>
                <div class="phase-description-section" style="display: none;">
                    <button class="close-btn" onclick="togglePhase('${phase.id}', event)" title="Close">✕</button>
                    <div class="phase-outcome">
                        <strong>Expected Outcome:</strong> ${phase.outcome}
                    </div>
                    <div class="phase-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span>${complete}/${total} milestones • ${progress}%</span>
                    </div>
                </div>
                <div class="phase-milestones" style="display: none;">
                    ${phase.milestones.map(m => renderMilestone(m, phase.id)).join('')}
                </div>
            </div>
        `;
    }).join('');

    // Refresh AI Copilot buttons any time the phases UI re-renders
    renderCopilotButtons();
}

function renderPhase(phase) {
    // This function is no longer used but kept for compatibility
    const milestones = phase.milestones || [];
    const completedCount = milestones.filter(m => m.status === 'complete').length;
    const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

    return `
        <section class="phase" id="phase-${phase.id}">
            <div class="phase-header" onclick="togglePhase('${phase.id}')">
                <div class="phase-title">
                    <h2>${phase.name}</h2>
                    <span class="phase-timeline">${phase.timeline}</span>
                </div>
                <div class="phase-stats">
                    <span class="phase-progress">${completedCount}/${milestones.length} Complete</span>
                    <span class="expand-icon">▼</span>
                </div>
            </div>
            <div class="phase-body" id="phase-body-${phase.id}">
                <div class="phase-outcome">
                    <strong>Expected Outcome:</strong> ${phase.outcome}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                    <span class="progress-text">${progress}%</span>
                </div>
                <div class="milestones">
                    ${milestones.map(m => renderMilestone(m, phase.id)).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderMilestone(milestone, phaseId) {
    const daysUntil = getDaysUntil(milestone.due);
    const isOverdue = daysUntil < 0 && milestone.status !== 'complete';
    const statusClass = milestone.status || 'planned';

    return `
        <div class="milestone-card" data-milestone-id="${milestone.id}">
            <div class="milestone-header" onclick="toggleMilestoneDetails('${milestone.id}', event)">
                <input type="checkbox" 
                       class="milestone-checkbox" 
                       data-id="${milestone.id}" 
                       data-phase="${phaseId}"
                       ${milestone.status === 'complete' ? 'checked' : ''}>
                <div class="milestone-info">
                    <div class="milestone-title">
                        <strong>${milestone.id}</strong> - ${milestone.title}
                        ${getMilestoneOwnerBadge(milestone.id)}
                    </div>
                    <div class="milestone-meta">
                        ${milestone.owner} | Due: ${formatDate(milestone.due)}
                        ${isOverdue ? ' | <span style="color: var(--danger);">⚠️ Overdue</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="milestone-details" style="display: none;" data-milestone-details="${milestone.id}">
                <button class="close-btn" onclick="toggleMilestoneDetails('${milestone.id}', event)" title="Close">✕</button>
                <p>${milestone.description}</p>
                
                <!-- AI Copilot -->
                <div id="copilot-btn-${milestone.id}"></div>
                <div class="copilot-content" id="copilot-${milestone.id}" style="display: none;">
                    ${typeof showWellnessCopilot !== 'undefined' ? showWellnessCopilot(milestone.id) : ''}
                </div>
                
                <!-- Notes & Attachments Button -->
                <button class="notes-toggle-btn" onclick="toggleMilestoneNotes('${milestone.id}', event)">
                    📝 Notes & Attachments
                </button>
                
                <!-- Notes Section -->
                <div class="milestone-notes-section" id="notes-${milestone.id}" style="display: none;">
                    <button class="close-btn" onclick="toggleMilestoneNotes('${milestone.id}', event)" title="Close">✕</button>
                    <div class="notes-section">
                        <div class="notes-header">
                            <h4>📝 Milestone Notes</h4>
                        </div>
                        <textarea 
                            class="notes-textarea milestone-notes" 
                            placeholder="Add progress notes, decisions, blockers, or any relevant information..."
                            data-milestone="${milestone.id}"
                            id="note-text-${milestone.id}"
                        >${getMilestoneNotes(milestone.id) || ''}</textarea>
                        <button class="save-note-btn" onclick="saveMilestoneNoteAndClose('${milestone.id}')">
                            Save Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Toggle Functions
let currentOpenMilestone = null;
let currentOpenNotes = null;

window.togglePhase = function (phaseId, event) {
    if (event) event.stopPropagation();

    const phaseCard = document.querySelector(`[data-phase-id="${phaseId}"]`);
    const description = phaseCard.querySelector('.phase-description-section');
    const milestones = phaseCard.querySelector('.phase-milestones');
    const arrow = phaseCard.querySelector('.expand-btn');

    // Toggle display
    const isOpen = description.style.display === 'block';
    description.style.display = isOpen ? 'none' : 'block';
    milestones.style.display = isOpen ? 'none' : 'block';
    arrow.textContent = isOpen ? '▼' : '▲';

    // Close all milestone details when closing phase
    if (isOpen) {
        milestones.querySelectorAll('.milestone-details').forEach(d => d.style.display = 'none');
        currentOpenMilestone = null;
        if (currentOpenNotes) {
            document.getElementById(`notes-${currentOpenNotes}`).style.display = 'none';
            currentOpenNotes = null;
        }
    }
};

window.toggleMilestoneDetails = function (milestoneId, event) {
    if (event) event.stopPropagation();

    const milestoneCard = document.querySelector(`[data-milestone-id="${milestoneId}"]`);
    const details = milestoneCard.querySelector('.milestone-details');

    // Close previous milestone if different
    if (currentOpenMilestone && currentOpenMilestone !== milestoneId) {
        const prevDetails = document.querySelector(`[data-milestone-details="${currentOpenMilestone}"]`);
        if (prevDetails) {
            prevDetails.style.display = 'none';
        }
    }

    // Toggle current
    const isOpen = details.style.display === 'block';
    details.style.display = isOpen ? 'none' : 'block';
    currentOpenMilestone = isOpen ? null : milestoneId;

    // Close notes when closing milestone
    if (isOpen && currentOpenNotes === milestoneId) {
        document.getElementById(`notes-${milestoneId}`).style.display = 'none';
        currentOpenNotes = null;
    }
};

window.toggleMilestoneNotes = function (milestoneId, event) {
    if (event) event.stopPropagation();

    const notesSection = document.getElementById(`notes-${milestoneId}`);
    const isOpen = notesSection.style.display === 'block';

    notesSection.style.display = isOpen ? 'none' : 'block';
    currentOpenNotes = isOpen ? null : milestoneId;
};

window.saveMilestoneNoteAndClose = function (milestoneId) {
    const textarea = document.getElementById(`note-text-${milestoneId}`);
    saveMilestoneNote(milestoneId, textarea.value);
    document.getElementById(`notes-${milestoneId}`).style.display = 'none';
    currentOpenNotes = null;
};

async function toggleMilestoneStatus(milestoneId) {
    // Check if user is view-only (board members)
    if (currentUser && window.BOARD_MEMBERS && window.BOARD_MEMBERS.includes(currentUser.name)) {
        showModal('View-Only Access', `
            <p>Board members have read-only access to project data.</p>
            <p>Contact the steering committee to request milestone updates.</p>
        `);
        return;
    }

    let found = false;
    let oldStatus = null;

    wellnessProject.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            oldStatus = milestone.status;
            milestone.status = milestone.status === 'complete' ? 'planned' : 'complete';

            // Track who completed it and when
            if (milestone.status === 'complete') {
                milestone.completedDate = new Date().toISOString();
                milestone.completedBy = window.currentUser?.name || 'Unknown';
            } else {
                milestone.completedDate = null;
                milestone.completedBy = null;
            }

            found = true;
            saveMilestoneStatus(milestoneId, milestone.status);
            renderPhases();
            renderCopilotButtons();
        }
    });

    if (!found) return;

    // Get the updated milestone object to access its current status
    const updatedMilestone = wellnessProject.phases
        .flatMap(p => p.milestones)
        .find(m => m.id === milestoneId);

    if (!updatedMilestone) return;

    // Sync to backend (optimistic update already done)
    try {
        const response = await fetch('/api/milestones/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                milestone_id: milestoneId,
                field: 'status',
                old_value: oldStatus,
                new_value: updatedMilestone.status === 'complete' ? 'completed' : updatedMilestone.status,
                changed_by: currentUser?.name || 'Unknown'
            })
        });

        if (!response.ok) {
            const data = await response.json();
            console.warn('Backend sync failed, using localStorage:', data.error);
        } else {
            console.log('✅ Wellness milestone synced to backend');
        }
    } catch (error) {
        console.warn('Backend not reachable, using localStorage only:', error.message);
    }
}

// Copilot
function toggleCopilot(milestoneId) {
    const details = document.getElementById(`details-${milestoneId}`);
    const copilotContainer = document.getElementById(`copilot-btn-${milestoneId}`);

    if (!copilotContainer) return;

    if (copilotContainer.innerHTML.includes('copilot-panel')) {
        copilotContainer.innerHTML = getCopilotButton(milestoneId, 'wellness');
    } else {
        copilotContainer.innerHTML = showWellnessCopilot(milestoneId);
        if (details.style.display === 'none') {
            details.style.display = 'block';
        }
    }
}

// LocalStorage Functions
function getMilestoneNotes(milestoneId) {
    const notes = localStorage.getItem(`wellness-notes-${milestoneId}`);
    return notes || '';
}

function saveMilestoneNotes(milestoneId) {
    const textarea = document.getElementById(`notes-text-${milestoneId}`);
    if (textarea) {
        localStorage.setItem(`wellness-notes-${milestoneId}`, textarea.value);
        alert('Notes saved successfully! ✓');
    }
}

function saveMilestoneStatus(milestoneId, status) {
    localStorage.setItem(`wellness-status-${milestoneId}`, status);
}

function uploadFile(milestoneId, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const files = JSON.parse(localStorage.getItem(`wellness-files-${milestoneId}`) || '[]');
        files.push({
            name: file.name,
            data: e.target.result,
            date: new Date().toISOString()
        });
        localStorage.setItem(`wellness-files-${milestoneId}`, JSON.stringify(files));
        renderPhases();
        renderCopilotButtons();
    };
    reader.readAsDataURL(file);
}

function renderUploadedFiles(milestoneId) {
    const files = JSON.parse(localStorage.getItem(`wellness-files-${milestoneId}`) || '[]');
    if (files.length === 0) return '<p class="no-files">No files uploaded yet</p>';

    return files.map((file, index) => `
        <div class="file-item">
            <span class="file-name">📄 ${file.name}</span>
            <span class="file-date">${formatDate(file.date)}</span>
            <button class="file-delete" onclick="deleteFile('${milestoneId}', ${index})">Delete</button>
        </div>
    `).join('');
}

function deleteFile(milestoneId, index) {
    const files = JSON.parse(localStorage.getItem(`wellness-files-${milestoneId}`) || '[]');
    files.splice(index, 1);
    localStorage.setItem(`wellness-files-${milestoneId}`, JSON.stringify(files));
    renderPhases();
    renderCopilotButtons();
}

// Load saved state on init
function loadSavedState() {
    wellnessProject.phases.forEach(phase => {
        phase.milestones.forEach(milestone => {
            const savedStatus = localStorage.getItem(`wellness-status-${milestone.id}`);
            if (savedStatus) {
                milestone.status = savedStatus;
            }
        });
    });
}

// Sidebar toggle functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Sidebar Events
function bindEvents() {
    console.log('🔗 Binding events...');

    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            console.log('📍 Nav tab clicked:', view);
            if (view) {
                switchView(view);
            }
        });
    });

    console.log('✅ Events bound, nav tabs found:', document.querySelectorAll('.nav-tab').length);

    // Milestone checkbox delegation
    const phasesContainer = document.getElementById('phases-container');
    if (phasesContainer) {
        phasesContainer.addEventListener('click', (event) => {
            const checkbox = event.target.closest('.milestone-checkbox');
            if (!checkbox) return;
            event.stopPropagation();
            const milestoneId = checkbox.dataset.id;
            if (milestoneId) {
                toggleMilestoneStatus(milestoneId);
            }
        });
    }

    // Milestone checkbox handler - restore persistence functionality
    document.addEventListener('change', async (e) => {
        if (e.target.classList.contains('milestone-checkbox')) {
            const milestoneId = e.target.dataset.id;
            const isChecked = e.target.checked;
            
            // Find and update milestone
            let found = null;
            wellnessData.phases.forEach(phase => {
                const milestone = phase.milestones.find(m => m.id === milestoneId);
                if (milestone) {
                    found = milestone;
                    const oldStatus = milestone.status;
                    milestone.status = isChecked ? 'complete' : 'in-progress';
                    
                    // Save to localStorage immediately
                    saveToLocalStorage();
                    
                    // Save to database for cross-browser sync
                    const currentUser = JSON.parse(localStorage.getItem('stabilis-user') || '{}');
                    saveMilestoneUpdate(milestoneId, 'status', oldStatus, milestone.status, currentUser.name || 'Unknown');
                }
            });
            
            // Re-render to update UI
            if (found) {
                renderView(currentView);
            }
        }
    });

    // Hamburger menu
    document.getElementById('menu-btn')?.addEventListener('click', toggleSidebar);

    // Close sidebar
    document.getElementById('sidebar-close')?.addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

    // Sidebar section toggles
    document.querySelectorAll('.sidebar-section-title').forEach(btn => {
        btn.addEventListener('click', function () {
            const toggle = this.getAttribute('data-toggle');
            const section = this.closest('.sidebar-section');
            const arrow = this.querySelector('.section-arrow');

            // Close all other sections
            document.querySelectorAll('.sidebar-section').forEach(s => {
                if (s !== section) {
                    s.classList.remove('expanded');
                }
            });
            document.querySelectorAll('.section-arrow').forEach(a => {
                if (a !== arrow) {
                    a.textContent = '▼';
                }
            });

            // Toggle current section
            section.classList.toggle('expanded');
            arrow.textContent = section.classList.contains('expanded') ? '▲' : '▼';
        });
    });

    // Sidebar actions
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function () {
            const action = this.getAttribute('data-action');
            handleSidebarAction(action);
        });
    });

    // Risk filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRiskFilter = btn.dataset.filter;
            renderRisks();
        });
    });
}

function handleSidebarAction(action) {
    // Close sidebar
    closeSidebar();

    switch (action) {
        case 'home':
            navigateToIfSteering('/', 'Project Hub navigation');
            break;
        case 'quick-start':
            showWellnessQuickStart();
            break;
        case 'mark-complete':
            showWellnessMarkCompleteGuide();
            break;
        case 'wellness-overview':
            showWellnessOverview();
            break;
        case 'practitioner-guide':
            showPractitionerGuide();
            break;
        case 'gestures':
            showWellnessGesturesGuide();
            break;
        case 'switch-diversification':
            navigateToIfSteering('/index.html', 'Diversification workspace');
            break;
        case 'switch-turnaround':
            navigateToIfSteering('/turnaround.html', 'Turnaround workspace');
            break;
        case 'executive-dashboard':
            navigateToIfSteering('/executive-dashboard.html', 'Executive Dashboard');
            break;
        case 'current-phase':
            // Jump to first non-complete phase
            const currentPhase = wellnessProject.phases.find(p =>
                p.milestones.some(m => m.status !== 'complete')
            );
            if (currentPhase) {
                const phaseElement = document.getElementById(`phase-${currentPhase.id}`);
                if (phaseElement) {
                    phaseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            break;
        case 'this-week':
            showThisWeek();
            break;
        case 'overdue':
            showOverdue();
            break;
        case 'edit-milestone':
            showEditMilestoneModal();
            break;
        case 'view-metrics':
            showMetricsDashboard();
            break;
        case 'practitioner-schedule':
            showPractitionerSchedule();
            break;
        case 'referral-tracker':
            showReferralTracker();
            break;
        case 'session-capacity':
            showSessionCapacity();
            break;
        case 'revenue-dashboard':
            showRevenueDashboard();
            break;
        case 'toggle-theme':
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            const themeIndicator = document.getElementById('theme-indicator');
            if (themeIndicator) {
                themeIndicator.textContent = isDark ? '🌙' : '☀️';
            }
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            break;
        case 'clear-data':
            if (confirm('⚠️ Clear all local progress data?\n\nThis will reset all milestone completion status.\n\nThis cannot be undone.')) {
                localStorage.removeItem('stabilis-wellness-data');
                alert('✅ Local data cleared. Page will reload.');
                location.reload();
            }
            break;

        // Report navigation
        case 'revenue-projection':
            handleReportNavigation('revenue-projection', '/reports/revenue-projection.html');
            break;
        case 'cost-analysis':
            handleReportNavigation('cost-analysis', '/reports/cost-analysis.html');
            break;
        case 'phase-progress':
            handleReportNavigation('phase-progress', '/reports/phase-progress.html');
            break;
        case 'risk-assessment':
            handleReportNavigation('risk-assessment', '/reports/risk-assessment.html');
            break;
        case 'resource-utilization':
            handleReportNavigation('resource-utilization', '/reports/resource-utilization.html');
            break;
        case 'kpi-dashboard-report':
            handleReportNavigation('kpi-dashboard-report', '/reports/kpi-dashboard.html');
            break;
        case 'timeline-analysis':
            handleReportNavigation('timeline-analysis', '/reports/timeline-analysis.html');
            break;
        case 'budget-actual':
            handleReportNavigation('budget-actual', '/reports/budget-actual.html');
            break;
        case 'cashflow-projection':
            handleReportNavigation('cashflow-projection', '/reports/cashflow-projection.html');
            break;

        default:
            handleUnknownWellnessAction(action);
    }
}

function showWellnessQuickStart() {
    showModal('Quick Start Tutorial', `
        <ol style="line-height:1.7;padding-left:1rem;">
            <li>Use the <strong>Quick Actions</strong> panel to jump to the current phase or overdue list.</li>
            <li>Tap any milestone card to expand checklists, upload evidence, and leave clinical notes.</li>
            <li>Switch between <strong>Dashboard / Phases / Risks / Team</strong> using the tabs at the top.</li>
            <li>Capture blockers with the floating <em>Add Update</em> button so the executive dashboard stays aligned.</li>
            <li>Visit <strong>Reports</strong> in the sidebar to open revenue, risk, and timeline analytics instantly.</li>
        </ol>
        <p style="margin-top:1rem;font-size:0.9rem;color:#64748b;">Tip: Bookmark this page on mobile home screen for one-tap access.</p>
    `);
}

function showWellnessMarkCompleteGuide() {
    showModal('How to Mark Milestones Complete', `
        <ol style="line-height:1.7;padding-left:1rem;">
            <li>Open the <strong>Phases</strong> tab and expand the relevant phase.</li>
            <li>Review the milestone checklist and attach any supporting documents.</li>
            <li>Toggle the status selector to <strong>Complete</strong> once deliverables are verified.</li>
            <li>Leave a brief note (who signed off, treatment metrics, etc.) for audit traceability.</li>
            <li>Return to the Dashboard to confirm the progress bar updates.</li>
        </ol>
        <p style="margin-top:1rem;font-size:0.9rem;color:#64748b;">Only authorized leads can edit milestones. Use the Edit Milestone tool if assignments or dates need to change.</p>
    `);
}

function showWellnessOverview() {
    showModal('Wellness Centre Overview', `
        <p>The Wellness Centre spans <strong>three launch phases</strong> covering setup, scale, and digital expansion.</p>
        <ul style="padding-left:1rem;line-height:1.7;">
            <li><strong>Phase 1:</strong> Stand up operational rooms, initial programmes, and billing readiness.</li>
            <li><strong>Phase 2:</strong> Grow adolescent, school, and corporate partnerships with full practitioner rosters.</li>
            <li><strong>Phase 3:</strong> Launch digital products, regional partnerships, and accreditation-driven growth.</li>
        </ul>
        <p><strong>18‑month revenue target:</strong> R2.8M investment unlocking >R4.2M pipeline.</p>
        <p style="margin-top:1rem;font-size:0.9rem;color:#64748b;">Use the Team tab for owner accountability and the Risks tab to monitor medical/market dependencies.</p>
    `);
}

function showPractitionerGuide() {
    showModal('Practitioner Management Playbook', `
        <ul style="padding-left:1rem;line-height:1.8;">
            <li><strong>Scheduling:</strong> Use the Practitioner Schedule tool for weekly slot planning and utilization checks.</li>
            <li><strong>Credentialing:</strong> Track HPCSA / medical-aid approvals for each clinician before opening new services.</li>
            <li><strong>Performance:</strong> Monitor session volume, cancellations, and feedback; escalate issues to the Medical Manager.</li>
            <li><strong>Compliance:</strong> Ensure substance screenings and documentation are filed under each milestone record.</li>
            <li><strong>Well-being:</strong> Rotate high-intensity caseloads and schedule supervision touchpoints.</li>
        </ul>
    `);
}

function showWellnessGesturesGuide() {
    showModal('Mobile Gestures Guide', `
        <p><strong>Tap:</strong> Open milestone details or toggle status.</p>
        <p><strong>Scroll:</strong> Swipe vertically through sections; the header auto-hides on scroll.</p>
        <p><strong>Tab Navigation:</strong> Swipe left/right on the tab bar to reveal hidden tabs.</p>
        <p><strong>Long Press:</strong> (Upcoming) Quick actions for assignments and notes.</p>
        <p><strong>Pull to Refresh:</strong> Reloads the current section and syncs saved data.</p>
    `);
}

function handleUnknownWellnessAction(actionName) {
    const safeName = actionName || 'shortcut';
    showModal('Action Helper', `
        <p>The action <strong>${safeName}</strong> isn't mapped yet.</p>
        <p>Choose one of the helpful shortcuts below:</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;">
            <button id="wellness-fallback-quickstart" style="flex:1;min-width:160px;padding:0.75rem;border:none;border-radius:0.75rem;background:#0ea5e9;color:white;font-weight:600;cursor:pointer;">View Quick Start</button>
            <button id="wellness-fallback-overview" style="flex:1;min-width:160px;padding:0.75rem;border:1px solid #cbd5f5;border-radius:0.75rem;background:var(--bg-secondary);cursor:pointer;">Open Wellness Overview</button>
        </div>
    `);

    requestAnimationFrame(() => {
        document.getElementById('wellness-fallback-quickstart')?.addEventListener('click', showWellnessQuickStart);
        document.getElementById('wellness-fallback-overview')?.addEventListener('click', showWellnessOverview);
    });
}

function showThisWeek() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    let count = 0;
    wellnessProject.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const due = new Date(m.due);
            if (due >= today && due <= nextWeek && m.status !== 'complete') {
                const element = document.getElementById(`milestone-${m.id}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight');
                    setTimeout(() => element.classList.remove('highlight'), 2000);
                    count++;
                }
            }
        });
    });

    if (count === 0) {
        alert('No milestones due this week! 🎉');
    }
}

function showOverdue() {
    const today = new Date();
    let count = 0;

    wellnessProject.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const due = new Date(m.due);
            if (due < today && m.status !== 'complete') {
                const element = document.getElementById(`milestone-${m.id}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight');
                    setTimeout(() => element.classList.remove('highlight'), 2000);
                    count++;
                }
            }
        });
    });

    if (count === 0) {
        alert('No overdue milestones! ✓');
    } else {
        alert(`Found ${count} overdue milestone${count > 1 ? 's' : ''}`);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const indicator = document.getElementById('theme-indicator');
    indicator.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
    localStorage.setItem('wellness-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function clearLocalData() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('wellness-'));
    keys.forEach(key => localStorage.removeItem(key));
    location.reload();
}

// Wellness feature modals
function showMetricsDashboard() {
    showModal('Wellness Metrics Dashboard', `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1.5rem; border-radius: 0.5rem;">
                <div style="font-size: 0.875rem; opacity: 0.9;">Monthly Revenue Target</div>
                <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0;">R250K</div>
                <div style="font-size: 0.75rem;">On Track</div>
            </div>
            <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 1.5rem; border-radius: 0.5rem;">
                <div style="font-size: 0.875rem; opacity: 0.9;">Sessions / Month</div>
                <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0;">300+</div>
                <div style="font-size: 0.75rem;">Target Capacity</div>
            </div>
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 1.5rem; border-radius: 0.5rem;">
                <div style="font-size: 0.875rem; opacity: 0.9;">Practitioner Utilization</div>
                <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0;">75%</div>
                <div style="font-size: 0.75rem;">Optimal</div>
            </div>
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 1.5rem; border-radius: 0.5rem;">
                <div style="font-size: 0.875rem; opacity: 0.9;">School/Corporate Contracts</div>
                <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0;">10+</div>
                <div style="font-size: 0.75rem;">Target</div>
            </div>
            <div style="background: linear-gradient(135deg, #ec4899, #db2777); color: white; padding: 1.5rem; border-radius: 0.5rem;">
                <div style="font-size: 0.875rem; opacity: 0.9;">Digital Product Revenue</div>
                <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0;">R50K</div>
                <div style="font-size: 0.75rem;">Per Month</div>
            </div>
        </div>
    `);
}

function showPractitionerSchedule() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const practitioners = ['Dr. Smith (Adult)', 'Dr. Jones (Youth)', 'Therapist A', 'Therapist B', 'Counselor C', 'Counselor D'];

    let scheduleHTML = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">';
    scheduleHTML += '<thead><tr style="background: #f3f4f6;"><th style="padding: 0.75rem; border: 1px solid #e5e7eb;">Practitioner</th>';
    days.forEach(day => scheduleHTML += `<th style="padding: 0.75rem; border: 1px solid #e5e7eb;">${day}</th>`);
    scheduleHTML += '<th style="padding: 0.75rem; border: 1px solid #e5e7eb;">Utilization</th></tr></thead><tbody>';

    practitioners.forEach((prac, i) => {
        const util = 65 + Math.floor(Math.random() * 25);
        scheduleHTML += `<tr><td style="padding: 0.75rem; border: 1px solid #e5e7eb; font-weight: 600;">${prac}</td>`;
        days.forEach(() => {
            const slots = Math.floor(Math.random() * 8) + 4;
            const booked = Math.floor(Math.random() * slots);
            scheduleHTML += `<td style="padding: 0.75rem; border: 1px solid #e5e7eb; text-align: center;">${booked}/${slots}</td>`;
        });
        scheduleHTML += `<td style="padding: 0.75rem; border: 1px solid #e5e7eb; text-align: center;"><span style="display: inline-block; padding: 0.25rem 0.75rem; background: ${util > 80 ? '#fee2e2' : '#d1fae5'}; color: ${util > 80 ? '#991b1b' : '#065f46'}; border-radius: 9999px; font-weight: 600;">${util}%</span></td>`;
        scheduleHTML += '</tr>';
    });
    scheduleHTML += '</tbody></table></div>';

    showModal('📅 Practitioner Schedule (This Week)', scheduleHTML);
}

function showReferralTracker() {
    showModal('🔗 Referral Source Tracker', `
        <div style="display: grid; gap: 1rem; margin-bottom: 1rem;">
            <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">GP Referrals</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">15 referring doctors</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">40%</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">120 referrals</div>
                    </div>
                </div>
            </div>
            <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #10b981;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">School Partnerships</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">8 partnered schools</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">30%</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">90 referrals</div>
                    </div>
                </div>
            </div>
            <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">Corporate EAP</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">5 corporate contracts</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #f59e0b;">20%</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">60 referrals</div>
                    </div>
                </div>
            </div>
            <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #8b5cf6;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">Self-Referral</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">Website & social media</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #8b5cf6;">10%</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">30 referrals</div>
                    </div>
                </div>
            </div>
        </div>
        <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
            <strong>💡 Insight:</strong> GP referrals remain our strongest source. Consider strengthening school partnerships to increase youth service uptake.
        </div>
    `);
}

function showSessionCapacity() {
    showModal('📈 Session Capacity Analysis', `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 600;">Current Month Capacity</span>
                <span style="font-weight: 700; font-size: 1.25rem; color: #3b82f6;">225 / 300 sessions</span>
            </div>
            <div style="height: 24px; background: #e5e7eb; border-radius: 9999px; overflow: hidden;">
                <div style="height: 100%; width: 75%; background: linear-gradient(90deg, #10b981, #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">75% Utilization</div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
            <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">
                <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Peak Hours</div>
                <div style="font-weight: 700; font-size: 1.5rem; color: #1f2937;">16:00 - 18:00</div>
                <div style="font-size: 0.75rem; color: #6b7280;">90% booked</div>
            </div>
            <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">
                <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Available Capacity</div>
                <div style="font-weight: 700; font-size: 1.5rem; color: #10b981;">75 sessions</div>
                <div style="font-size: 0.75rem; color: #6b7280;">This month</div>
            </div>
        </div>
        
        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem;">
            <strong>⚠️ Note:</strong> After-school hours (16:00-18:00) consistently at capacity. Consider adding evening practitioners or expanding Saturday hours.
        </div>
    `);
}

function showRevenueDashboard() {
    showModal('💰 Revenue Breakdown Dashboard', `
        <div style="margin-bottom: 1.5rem;">
            <div style="text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 0.75rem;">
                <div style="font-size: 0.875rem; opacity: 0.9;">Current Month Revenue</div>
                <div style="font-size: 3rem; font-weight: 700; margin: 0.5rem 0;">R187,500</div>
                <div style="font-size: 0.875rem;">Target: R250,000 (75% achieved)</div>
            </div>
        </div>
        
        <div style="display: grid; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem;">
                <span>Individual Therapy Sessions</span>
                <span style="font-weight: 700;">R84,375 (45%)</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem;">
                <span>Group Sessions</span>
                <span style="font-weight: 700;">R46,875 (25%)</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem;">
                <span>Corporate Workshops</span>
                <span style="font-weight: 700;">R37,500 (20%)</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem;">
                <span>Digital Products & Courses</span>
                <span style="font-weight: 700;">R18,750 (10%)</span>
            </div>
        </div>
        
        <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem;">
            <strong>📊 Trend:</strong> Revenue up 12% vs last month. Individual therapy remains strongest performer. Digital products showing growth potential.
        </div>
    `);
}

// Load theme preference
const savedTheme = localStorage.getItem('wellness-theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    const indicator = document.getElementById('theme-indicator');
    if (indicator) indicator.textContent = '🌙';
}

// Initialize on page load
loadSavedState();
document.addEventListener('DOMContentLoaded', init);
