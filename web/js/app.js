// App State
let currentView = 'dashboard';
let currentRiskFilter = 'all';
let phaseRenderQueued = false;
let copilotButtonRenderQueued = false;
const QUICK_UPDATE_STORAGE_KEY = 'stabilis-diversification-updates';
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
    'revenue-projection': ['Attie Nel', 'Nastasha Jackson'],
    'cost-analysis': ['Nastasha Jackson', 'Attie Nel'],
    'phase-progress': ['Attie Nel', 'Berno Paul', 'Lydia Gittens'],
    'risk-assessment': ['Attie Nel', 'Berno Paul', 'Lydia Gittens'],
    'resource-utilization': ['Attie Nel', 'Lydia Gittens'],
    'kpi-dashboard-report': ['Attie Nel', 'Nastasha Jackson', 'Berno Paul', 'Lydia Gittens'],
    'timeline-analysis': ['Attie Nel'],
    'budget-actual': ['Nastasha Jackson', 'Attie Nel'],
    'cashflow-projection': ['Nastasha Jackson', 'Attie Nel'],
    'budget-q1-2026': ['Nastasha Jackson', 'Attie Nel'],
    'budget-fy-2026-27': ['Nastasha Jackson', 'Attie Nel']
};

function schedulePhaseRender() {
    if (phaseRenderQueued) return;
    phaseRenderQueued = true;

    const run = () => {
        phaseRenderQueued = false;
        renderPhases();
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(run);
    } else {
        setTimeout(run, 0);
    }
}

function scheduleCopilotButtonRender() {
    if (copilotButtonRenderQueued) return;
    copilotButtonRenderQueued = true;

    const run = () => {
        copilotButtonRenderQueued = false;
        renderCopilotButtons();
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(run);
    } else {
        setTimeout(run, 0);
    }
}

// Utility Functions
function formatCurrency(amount) {
    if (!amount && amount !== 0) return 'R0';
    if (amount >= 1000000) {
        return `R${(amount / 1000000).toFixed(1)}m`;
    }
    return `R${amount.toLocaleString()}`;
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function normalizeDateString(dateInput) {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
}

function recalculatePhaseTimeline(phase) {
    if (!phase || !Array.isArray(phase.milestones)) return;
    const timestamps = phase.milestones
        .map(m => new Date(m.due || m.dueDate))
        .filter(date => !Number.isNaN(date.getTime()));
    if (!timestamps.length) return;
    const start = normalizeDateString(new Date(Math.min(...timestamps)));
    const end = normalizeDateString(new Date(Math.max(...timestamps)));
    if (start) phase.startDate = start;
    if (end) phase.endDate = end;
}

function recalculateProjectTimeline() {
    if (!projectData || !Array.isArray(projectData.phases)) return;
    const startDates = projectData.phases
        .map(p => new Date(p.startDate))
        .filter(date => !Number.isNaN(date.getTime()));
    const endDates = projectData.phases
        .map(p => new Date(p.endDate))
        .filter(date => !Number.isNaN(date.getTime()));
    if (startDates.length) {
        const overallStart = normalizeDateString(new Date(Math.min(...startDates)));
        if (overallStart) projectData.startDate = overallStart;
    }
    if (endDates.length) {
        const overallEnd = normalizeDateString(new Date(Math.max(...endDates)));
        if (overallEnd) projectData.endDate = overallEnd;
    }
}

function getDaysUntil(dateString) {
    const target = new Date(dateString);
    const today = new Date();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
}

function getProjectProgress() {
    const start = new Date(projectData.startDate);
    const end = new Date(projectData.endDate);
    const today = new Date();

    if (today < start) return 0;
    if (today > end) return 100;

    const total = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / total) * 100);
}

function getCurrentPhase() {
    const today = new Date();
    return projectData.phases.find(phase => {
        const start = new Date(phase.startDate);
        const end = new Date(phase.endDate);
        return today >= start && today <= end;
    }) || projectData.phases[0];
}

function getMilestoneStatus() {
    let total = 0;
    let complete = 0;

    projectData.phases.forEach(phase => {
        total += phase.milestones.length;
        complete += phase.milestones.filter(m => m.status === 'complete').length;
    });

    return { total, complete };
}

function getUpcomingMilestones(limit = 5) {
    const today = new Date();
    const allMilestones = [];

    projectData.phases.forEach(phase => {
        phase.milestones.forEach(milestone => {
            if (milestone.status !== 'complete') {
                allMilestones.push({
                    ...milestone,
                    phase: phase.name,
                    daysUntil: getDaysUntil(milestone.due)
                });
            }
        });
    });

    return allMilestones
        .sort((a, b) => new Date(a.due) - new Date(b.due))
        .slice(0, limit);
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
        <p>The navigation stays hidden until an authenticated steering member is active.</p>
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
        <p>Only the steering committee may open multi-project navigation.</p>
        ${listMarkup}
        <p style="margin-top:0.75rem;">Compiled insights remain on the Executive Dashboard for these leaders.</p>
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
        <p>This is limited to the assigned owners for this project.</p>
        ${listMarkup}
        <p style="margin-top:0.75rem;">Cross-project, compiled reporting stays on the Executive Dashboard for the steering committee.</p>
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
    // Wait for copilotData and getCopilotButton to be available
    if (typeof window.getCopilotButton !== 'function') {
        setTimeout(renderCopilotButtons, 100);
        return;
    }

    projectData.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const container = document.getElementById(`copilot-btn-${m.id}`);
            if (container) {
                container.innerHTML = getCopilotButton(m.id, 'diversification');
            }
        });
    });
}

// Initialize App
function init() {
    // Initialize authentication first
    initAuth();

    updateCountdown();
    updateDashboard();
    renderPhases();
    renderRisks();
    renderTeam();
    bindEvents();

    // Update countdown every minute
    setInterval(updateCountdown, 60000);
}

function updateCountdown() {
    const daysUntil = getDaysUntil(projectData.startDate);
    const countdown = document.getElementById('countdown');

    if (daysUntil > 0) {
        countdown.textContent = `Starts in ${daysUntil} days`;
    } else if (daysUntil === 0) {
        countdown.textContent = 'Launch Day!';
    } else {
        const progress = getProjectProgress();
        countdown.textContent = `Day ${Math.abs(daysUntil)} • ${progress}%`;
    }
}

function updateDashboard() {
    // Progress
    const progress = getProjectProgress();
    document.getElementById('progress-percent').textContent = `${progress}%`;
    document.getElementById('timeline-fill').style.width = `${progress}%`;
    const timelineStart = document.getElementById('timeline-start');
    const timelineEnd = document.getElementById('timeline-end');
    if (timelineStart) timelineStart.textContent = formatDate(projectData.startDate);
    if (timelineEnd) timelineEnd.textContent = formatDate(projectData.endDate);

    // Milestones
    const { total, complete } = getMilestoneStatus();
    document.getElementById('milestones-done').textContent = `${complete}/${total}`;

    // Risks
    const activeRisks = projectData.risks.filter(r => r.status === 'open').length;
    document.getElementById('active-risks').textContent = activeRisks;

    // Current Phase
    const currentPhase = getCurrentPhase();
    const phaseComplete = currentPhase.milestones.filter(m => m.status === 'complete').length;
    const phaseTotal = currentPhase.milestones.length;
    const phaseProgress = Math.round((phaseComplete / phaseTotal) * 100);

    document.getElementById('current-phase').innerHTML = `
        <div class="phase-badge">${currentPhase.id}</div>
        <h3>${currentPhase.name.replace(/Phase \d+ – /, '')}</h3>
        <p>${formatDate(currentPhase.startDate)} – ${formatDate(currentPhase.endDate)}</p>
        <div class="phase-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${phaseProgress}%"></div>
            </div>
            <span>${phaseComplete} of ${phaseTotal} milestones complete</span>
        </div>
    `;

    // Next Milestones
    const upcoming = getUpcomingMilestones();
    const milestonesContainer = document.getElementById('next-milestones');
    milestonesContainer.innerHTML = upcoming.map(m => `
        <div class="milestone-item ${m.status === 'complete' ? 'complete' : ''}" data-milestone="${m.id}">
            <div class="milestone-checkbox"></div>
            <div class="milestone-info">
                <div class="milestone-title">${m.title}</div>
                <div class="milestone-meta">${m.owner} • ${m.phase}</div>
            </div>
            <div class="milestone-due ${m.daysUntil < 0 ? 'overdue' : ''}">
                ${m.daysUntil === 0 ? 'Today' : m.daysUntil < 0 ? `${Math.abs(m.daysUntil)}d overdue` : `${m.daysUntil}d`}
            </div>
        </div>
    `).join('');
}

function renderPhases() {
    const container = document.getElementById('phases-container');
    if (!container) return;
    container.innerHTML = projectData.phases.map(phase => {
        const complete = phase.milestones.filter(m => m.status === 'complete').length;
        const total = phase.milestones.length;
        const progress = Math.round((complete / total) * 100);

        return `
            <div class="phase-card" data-phase-id="${phase.id}">
                <div class="phase-header">
                    <div onclick="togglePhase('${phase.id}', event)" style="flex: 1; cursor: pointer;">
                        <div class="phase-badge">${phase.id}</div>
                        <div class="phase-title">${phase.name}</div>
                        <div class="phase-dates">${formatDate(phase.startDate)} – ${formatDate(phase.endDate)}</div>
                        <div class="phase-stats">
                            <div class="phase-stat">
                                <span>📊</span>
                                <span><strong>${complete}/${total}</strong> milestones</span>
                            </div>
                            <div class="phase-stat">
                                <span>💰</span>
                                <span><strong>${formatCurrency(phase.revenue)}</strong> target</span>
                            </div>
                        </div>
                    </div>
                    <button class="expand-btn" onclick="togglePhase('${phase.id}', event)" data-phase="${phase.id}">▼</button>
                </div>
                <div class="phase-description-section" style="display: none;">
                    <button class="close-btn" onclick="togglePhase('${phase.id}', event)" title="Close">✕</button>
                    <div class="phase-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span>${complete}/${total} milestones • ${progress}%</span>
                    </div>
                </div>
                <div class="phase-milestones" style="display: none;">
                    ${phase.milestones.map(m => `
                        <div class="milestone-card" data-milestone-id="${m.id}">
                            <div class="milestone-header" onclick="toggleMilestoneDetails('${m.id}', event)">
                                <input type="checkbox" 
                                       class="milestone-checkbox" 
                                       data-id="${m.id}" 
                                       ${m.status === 'complete' ? 'checked' : ''}
                                       onclick="event.stopPropagation(); toggleMilestone('${m.id}', this)">
                                <div class="milestone-info">
                                    <div class="milestone-title">
                                        <strong>${m.id}</strong> - ${m.title}
                                        ${getMilestoneOwnerBadge(m.id)}
                                    </div>
                                    <div class="milestone-meta">
                                        ${m.owner} | Due: ${formatDate(m.due)}
                                    </div>
                                </div>
                            </div>
                            <div class="milestone-details" style="display: none;" data-milestone-details="${m.id}">
                                <button class="close-btn" onclick="toggleMilestoneDetails('${m.id}', event)" title="Close">✕</button>
                                <p>${m.description}</p>
                                
                                <!-- AI Copilot (Role-Based Access) -->
                                <div id="copilot-btn-${m.id}"></div>
                                <div class="copilot-content" id="copilot-${m.id}" data-copilot-loaded="false" style="display: none;"></div>
                                
                                <!-- Notes & Attachments Button -->
                                <button class="notes-toggle-btn" onclick="toggleMilestoneNotes('${m.id}', event)">
                                    📝 Notes & Attachments
                                </button>
                                
                                <!-- Notes & Uploads Section -->
                                <div class="milestone-notes-section" id="notes-${m.id}" style="display: none;">
                                    <button class="close-btn" onclick="toggleMilestoneNotes('${m.id}', event)" title="Close">✕</button>
                                    <div class="notes-section">
                                        <div class="notes-header">
                                            <h4>📝 Milestone Notes</h4>
                                        </div>
                                        <textarea 
                                            class="notes-textarea milestone-notes" 
                                            placeholder="Add progress notes, decisions, blockers, or any relevant information..."
                                            data-milestone="${m.id}"
                                            id="note-text-${m.id}"
                                        >${getMilestoneNote(m.id)}</textarea>
                                        <button class="save-note-btn" onclick="saveMilestoneNoteAndClose('${m.id}')">
                                            Save Note
                                        </button>
                                    </div>
                                    
                                    <div class="upload-section">
                                        <div class="upload-header">
                                            <h4>📎 Attachments</h4>
                                            <button class="upload-btn" onclick="triggerUpload('${m.id}')">
                                                + Add File
                                            </button>
                                            <input type="file" 
                                                   id="upload-${m.id}" 
                                                   class="upload-input" 
                                                   multiple
                                                   onchange="handleFileUpload('${m.id}', this.files)">
                                        </div>
                                        <ul class="upload-list" id="uploads-${m.id}">
                                            ${renderUploadList(m.id)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderRisks() {
    const container = document.getElementById('risk-list');
    const filtered = currentRiskFilter === 'all'
        ? projectData.risks
        : projectData.risks.filter(r => r.severity === currentRiskFilter);

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

    scheduleCopilotButtonRender();
}

function renderTeam() {
    const container = document.getElementById('team-grid');
    container.innerHTML = projectData.team.map(member => `
        <div class="team-card">
            <div class="team-role">${member.role}</div>
            <div class="team-name">${member.name}</div>
            <div class="team-tasks">${member.responsibilities}</div>
        </div>
    `).join('');
}

// Toggle Functions
let currentOpenMilestone = null;
let currentOpenNotes = null;
let unsavedNotes = {};

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
            checkUnsavedAndClose(currentOpenMilestone, prevDetails);
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

window.toggleCopilot = function (milestoneId, event) {
    if (event) event.stopPropagation();

    const copilotSection = document.getElementById(`copilot-${milestoneId}`);
    if (!copilotSection) return;

    if (copilotSection.dataset.copilotLoaded !== 'true') {
        copilotSection.innerHTML = showCopilot(milestoneId);
        copilotSection.dataset.copilotLoaded = 'true';
    }

    const isOpen = copilotSection.style.display === 'block';

    copilotSection.style.display = isOpen ? 'none' : 'block';
};

window.saveMilestoneNoteAndClose = function (milestoneId) {
    const textarea = document.getElementById(`note-text-${milestoneId}`);
    saveMilestoneNote(milestoneId, textarea.value);
    delete unsavedNotes[milestoneId];
    document.getElementById(`notes-${milestoneId}`).style.display = 'none';
    currentOpenNotes = null;
};

function checkUnsavedAndClose(milestoneId, element) {
    const textarea = document.getElementById(`note-text-${milestoneId}`);
    if (textarea) {
        const saved = getMilestoneNote(milestoneId);
        if (textarea.value !== saved) {
            if (confirm('You have unsaved notes. Do you want to save before closing?')) {
                saveMilestoneNote(milestoneId, textarea.value);
            }
        }
    }
    element.style.display = 'none';
}

// Notes Management
function getMilestoneNote(milestoneId) {
    const notes = JSON.parse(localStorage.getItem('stabilis-project-notes') || '{}');
    return notes[milestoneId] || '';
}

function saveMilestoneNote(milestoneId, note) {
    const notes = JSON.parse(localStorage.getItem('stabilis-project-notes') || '{}');
    notes[milestoneId] = note;
    localStorage.setItem('stabilis-project-notes', JSON.stringify(notes));
}

// Upload Management
function getUploads(milestoneId) {
    const uploads = JSON.parse(localStorage.getItem('stabilis-project-uploads') || '{}');
    return uploads[milestoneId] || [];
}

function saveUpload(milestoneId, fileName, fileSize) {
    const uploads = JSON.parse(localStorage.getItem('stabilis-project-uploads') || '{}');
    if (!uploads[milestoneId]) {
        uploads[milestoneId] = [];
    }
    uploads[milestoneId].push({
        name: fileName,
        size: fileSize,
        date: new Date().toISOString()
    });
    localStorage.setItem('stabilis-project-uploads', JSON.stringify(uploads));
}

function removeUpload(milestoneId, fileName) {
    const uploads = JSON.parse(localStorage.getItem('stabilis-project-uploads') || '{}');
    if (uploads[milestoneId]) {
        uploads[milestoneId] = uploads[milestoneId].filter(f => f.name !== fileName);
        localStorage.setItem('stabilis-project-uploads', JSON.stringify(uploads));
    }
    renderUploadList(milestoneId);
}

function renderUploadList(milestoneId) {
    const uploads = getUploads(milestoneId);
    if (uploads.length === 0) {
        return '<li class="no-uploads">No files attached</li>';
    }
    return uploads.map(file => `
        <li class="upload-item">
            <span class="upload-name">📄 ${file.name}</span>
            <span class="upload-size">${formatFileSize(file.size)}</span>
            <button class="remove-upload-btn" onclick="removeUpload('${milestoneId}', '${file.name}')">✕</button>
        </li>
    `).join('');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

window.triggerUpload = function (milestoneId) {
    document.getElementById(`upload-${milestoneId}`).click();
};

window.handleFileUpload = function (milestoneId, files) {
    Array.from(files).forEach(file => {
        saveUpload(milestoneId, file.name, file.size);
    });
    document.getElementById(`uploads-${milestoneId}`).innerHTML = renderUploadList(milestoneId);
    document.getElementById(`upload-${milestoneId}`).value = '';
};

function bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            switchView(view);
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

    // FAB
    const addUpdateBtn = document.getElementById('add-update');
    if (addUpdateBtn) {
        addUpdateBtn.addEventListener('click', openQuickUpdateModal);
    }

    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
}

function openQuickUpdateModal() {
    const milestoneOptions = ['<option value="">General project update</option>']
        .concat(projectData.phases.flatMap(phase =>
            phase.milestones.map(m => `<option value="${m.id}">${m.id} — ${m.name}</option>`)
        ));

    const updates = getQuickUpdates();

    showModal('Log Project Update', `
        <form id="quick-update-form" style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem;">
            <label style="display:flex;flex-direction:column;font-size:0.9rem;gap:0.35rem;">
                <span>Milestone (optional)</span>
                <select name="milestone" style="padding:0.5rem;border-radius:0.5rem;border:1px solid var(--border-color);">
                    ${milestoneOptions.join('')}
                </select>
            </label>
            <label style="display:flex;flex-direction:column;font-size:0.9rem;gap:0.35rem;">
                <span>Status</span>
                <select name="status" style="padding:0.5rem;border-radius:0.5rem;border:1px solid var(--border-color);">
                    <option value="on-track">On Track</option>
                    <option value="watching">Watching</option>
                    <option value="at-risk">At Risk</option>
                    <option value="blocked">Blocked</option>
                </select>
            </label>
            <label style="display:flex;flex-direction:column;font-size:0.9rem;gap:0.35rem;">
                <span>Update Summary</span>
                <textarea name="summary" rows="4" placeholder="Record decisions, blockers, or progress" style="padding:0.75rem;border-radius:0.75rem;border:1px solid var(--border-color);"></textarea>
            </label>
            <button type="submit" style="padding:0.75rem;border:none;border-radius:0.75rem;background:var(--primary);color:white;font-size:1rem;cursor:pointer;">Save Update</button>
        </form>
        <div id="quick-update-feedback" style="min-height:1.25rem;font-size:0.9rem;color:var(--success);"></div>
        <div>
            <h3 style="margin:0.5rem 0;">Recent Updates</h3>
            <div id="quick-update-history" style="display:flex;flex-direction:column;gap:0.5rem;max-height:240px;overflow:auto;">
                ${renderQuickUpdateHistory(updates)}
            </div>
        </div>
    `);

    requestAnimationFrame(() => {
        document.getElementById('quick-update-form')?.addEventListener('submit', handleQuickUpdateSubmit);
    });
}

function getQuickUpdates() {
    try {
        return JSON.parse(localStorage.getItem(QUICK_UPDATE_STORAGE_KEY)) || [];
    } catch (error) {
        console.warn('Failed to read quick updates', error);
        return [];
    }
}

function saveQuickUpdate(update) {
    const updates = getQuickUpdates();
    updates.unshift(update);
    localStorage.setItem(QUICK_UPDATE_STORAGE_KEY, JSON.stringify(updates.slice(0, 25)));
}

function renderQuickUpdateHistory(updates) {
    if (!updates || updates.length === 0) {
        return '<p style="color:var(--text-muted);">No updates logged yet.</p>';
    }
    return updates.slice(0, 6).map(update => `
        <div style="padding:0.75rem;border-radius:0.5rem;background:var(--bg-secondary);">
            <div style="font-size:0.85rem;color:var(--text-muted);">${formatTimestamp(update.timestamp)} • ${update.user || 'Team Member'}</div>
            <div style="font-weight:600;margin:0.25rem 0;">${(update.status || 'update').replace(/-/g, ' ')}</div>
            <p style="margin:0;font-size:0.95rem;">${update.summary}</p>
            ${update.milestoneId ? `<div style="font-size:0.8rem;color:var(--text-muted);">Milestone: ${update.milestoneId}</div>` : ''}
        </div>
    `).join('');
}

function handleQuickUpdateSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const summary = form.summary.value.trim();

    const feedback = document.getElementById('quick-update-feedback');

    if (!summary) {
        if (feedback) {
            feedback.style.color = 'var(--danger)';
            feedback.textContent = 'Please enter a short summary before saving.';
        }
        return;
    }

    const update = {
        id: `UP-${Date.now()}`,
        milestoneId: form.milestone.value || null,
        status: form.status.value,
        summary,
        user: (typeof currentUser !== 'undefined' && currentUser?.name) ? currentUser.name : 'Team Member',
        timestamp: new Date().toISOString()
    };

    saveQuickUpdate(update);
    form.reset();
    const historyContainer = document.getElementById('quick-update-history');
    if (historyContainer) {
        historyContainer.innerHTML = renderQuickUpdateHistory(getQuickUpdates());
    }
    if (feedback) {
        feedback.style.color = 'var(--success)';
        feedback.textContent = 'Update saved locally. Include it in your weekly export.';
        setTimeout(() => feedback.textContent = '', 4000);
    }
}

function switchView(view) {
    currentView = view;

    // Update tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });

    // Update views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.toggle('active', v.id === `${view}-view`);
    });
}

function toggleMilestone(milestoneId) {
    toggleMilestoneStatus(milestoneId, true);
}

async function toggleMilestoneStatus(milestoneId, refreshUI = false) {
    // Check if user is view-only (board members)
    if (currentUser && window.BOARD_MEMBERS && window.BOARD_MEMBERS.includes(currentUser.name)) {
        showModal('View-Only Access', `
            <p>Board members have read-only access to project data.</p>
            <p>Contact the steering committee to request milestone updates.</p>
        `);
        return;
    }

    let found = false;
    let updatedMilestone = null;
    let oldStatus = null;

    projectData.phases.forEach(phase => {
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
            updatedMilestone = milestone;
            found = true;
        }
    });

    if (!found) return;

    // Save to localStorage immediately (optimistic update)
    saveToLocalStorage();

    if (refreshUI) {
        updateDashboard();
        schedulePhaseRender();
    }

    // Sync to backend (fire and forget with fallback)
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
            console.log('✅ Diversification milestone synced to backend');
        }
    } catch (error) {
        // Network error - localStorage already updated
        console.warn('Backend not reachable, using localStorage only:', error.message);
    }
}

function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function saveToLocalStorage() {
    localStorage.setItem('stabilis-project-data', JSON.stringify(projectData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('stabilis-project-data');
    if (!saved) return;
    const savedData = JSON.parse(saved);
    if (savedData.startDate) projectData.startDate = savedData.startDate;
    if (savedData.endDate) projectData.endDate = savedData.endDate;
    projectData.phases.forEach(phase => {
        const savedPhase = savedData.phases?.find(sp => sp.id === phase.id);
        if (!savedPhase) return;
        if (savedPhase.startDate) phase.startDate = savedPhase.startDate;
        if (savedPhase.endDate) phase.endDate = savedPhase.endDate;
        phase.milestones.forEach(milestone => {
            const savedMilestone = savedPhase.milestones?.find(sm => sm.id === milestone.id);
            if (!savedMilestone) return;
            if (savedMilestone.title) milestone.title = savedMilestone.title;
            if (savedMilestone.owner) milestone.owner = savedMilestone.owner;
            if (savedMilestone.description) milestone.description = savedMilestone.description;
            if (savedMilestone.status) milestone.status = savedMilestone.status;
            if (savedMilestone.priority) milestone.priority = savedMilestone.priority;
            if (savedMilestone.notes) milestone.notes = savedMilestone.notes;
            if (savedMilestone.due || savedMilestone.dueDate) {
                milestone.due = savedMilestone.due || savedMilestone.dueDate;
                milestone.dueDate = milestone.due;
            }
            if (Array.isArray(savedMilestone.changeLog)) {
                milestone.changeLog = savedMilestone.changeLog;
            }
        });
    });
}

// Sidebar Functions
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

function handleSidebarAction(action) {
    closeSidebar();

    // Close all expanded sections when navigating
    document.querySelectorAll('.sidebar-section').forEach(s => {
        s.classList.remove('expanded');
    });

    switch (action) {
        case 'home':
            navigateToIfSteering('/', 'Project Hub navigation');
            break;

        case 'switch-turnaround':
            navigateToIfSteering('/turnaround.html', 'Turnaround workspace');
            break;

        case 'switch-wellness':
            navigateToIfSteering('/wellness.html', 'Wellness workspace');
            break;

        case 'executive-dashboard':
            navigateToIfSteering('/executive-dashboard.html', 'Executive Dashboard');
            break;

        case 'quick-start':
            showModal('Quick Start Tutorial', `
                <h3>Welcome to Stabilis Project Manager!</h3>
                <ol>
                    <li><strong>Dashboard:</strong> View overall progress and upcoming milestones</li>
                    <li><strong>Phases:</strong> Browse all 5 project phases and their milestones</li>
                    <li><strong>Risks:</strong> Monitor project risks by severity level</li>
                    <li><strong>Team:</strong> View team roles and responsibilities</li>
                    <li><strong>Mark Complete:</strong> Tap checkboxes to mark milestones done</li>
                </ol>
                <p>Your progress is automatically saved in your browser.</p>
            `);
            break;

        case 'mark-complete':
            showModal('How to Mark Milestones Complete', `
                <h3>Marking Milestones Complete</h3>
                <p><strong>Step 1:</strong> Navigate to the <em>Phases</em> tab</p>
                <p><strong>Step 2:</strong> Tap on a phase card to expand it</p>
                <p><strong>Step 3:</strong> Find the milestone you want to mark</p>
                <p><strong>Step 4:</strong> Tap the checkbox next to the milestone name</p>
                <p>✅ The checkbox will turn green and the milestone status updates to "Complete"</p>
                <p><small>Note: Your changes are saved automatically to your device</small></p>
            `);
            break;

        case 'progress-bars':
            showModal('Understanding Progress Bars', `
                <h3>Progress Bar Guide</h3>
                <p><strong>Timeline Progress (Dashboard):</strong> Shows overall project time elapsed</p>
                <p><strong>Phase Progress:</strong> Percentage of milestones completed in that phase</p>
                <p><strong>Color Indicators:</strong></p>
                <ul>
                    <li>🔵 Blue = In Progress</li>
                    <li>🟢 Green = Complete</li>
                    <li>⚪ Gray = Not Started</li>
                </ul>
                <p>The percentage (e.g., "50%") shows completion rate.</p>
            `);
            break;

        case 'risk-levels':
            showModal('Reading Risk Levels', `
                <h3>Risk Severity Levels</h3>
                <div style="margin: 1rem 0;">
                    <p><strong>🔴 High Risk:</strong> Immediate attention required. Could significantly impact project success.</p>
                    <p><strong>🟡 Medium Risk:</strong> Monitor closely. May require intervention if escalates.</p>
                    <p><strong>🟢 Low Risk:</strong> Minimal impact. Routine monitoring sufficient.</p>
                </div>
                <p><strong>Filtering Risks:</strong> Tap the colored buttons at the top of the Risks tab to filter by severity.</p>
            `);
            break;

        case 'gestures':
            showModal('Mobile Gestures Guide', `
                <h3>Touch Gestures</h3>
                <p><strong>Tap:</strong> Select items, expand cards, mark milestones</p>
                <p><strong>Scroll:</strong> Swipe up/down to browse content</p>
                <p><strong>Tab Navigation:</strong> Swipe left/right on the tab bar to scroll</p>
                <p><strong>Long Press:</strong> (Future) Will show additional options</p>
                <p><strong>Pull to Refresh:</strong> (Future) Will reload data from server</p>
            `);
            break;

        case 'current-phase':
            switchView('phases');
            setTimeout(() => {
                const currentPhase = getCurrentPhase();
                const phaseElement = document.querySelector(`[data-phase-id="${currentPhase.id}"]`);
                if (phaseElement) {
                    phaseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    phaseElement.classList.add('expanded');
                }
            }, 300);
            break;

        case 'filter-tasks':
            showModal('Filter My Tasks', `
                <h3>Filter by Role</h3>
                <p>Select your role to see only your assigned milestones:</p>
                <select id="role-filter" style="width: 100%; padding: 0.5rem; margin: 1rem 0; font-size: 1rem;">
                    <option value="">-- Select Role --</option>
                    <option value="CEO">CEO</option>
                    <option value="Clinical Manager">Clinical Manager</option>
                    <option value="Finance & Admin">Finance & Admin</option>
                    <option value="Clinical Admin">Clinical Admin</option>
                    <option value="Finance Officer">Finance Officer</option>
                    <option value="Administrative Officer">Administrative Officer</option>
                    <option value="Marketing Officer">Marketing Officer</option>
                    <option value="Team Lead">Team Lead</option>
                </select>
                <button onclick="applyRoleFilter()" style="width: 100%; padding: 0.75rem; background: var(--primary); color: white; border: none; border-radius: 0.5rem; font-size: 1rem; cursor: pointer;">Apply Filter</button>
            `);
            break;

        case 'this-week':
            const today = new Date();
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);

            let thisWeekMilestones = [];
            projectData.phases.forEach(phase => {
                phase.milestones.forEach(milestone => {
                    const dueDate = new Date(milestone.dueDate);
                    if (dueDate >= today && dueDate <= weekEnd) {
                        thisWeekMilestones.push({ ...milestone, phase: phase.name });
                    }
                });
            });

            const weekContent = thisWeekMilestones.length > 0
                ? thisWeekMilestones.map(m => `
                    <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                        <strong>${m.id}</strong> - ${m.name}<br>
                        <small>Due: ${formatDate(m.dueDate)} | ${m.owner}</small>
                    </div>
                `).join('')
                : '<p>No milestones due this week.</p>';

            showModal('This Week\'s Milestones', `<h3>Next 7 Days</h3>${weekContent}`);
            break;

        case 'overdue':
            const now = new Date();
            let overdueMilestones = [];
            projectData.phases.forEach(phase => {
                phase.milestones.forEach(milestone => {
                    const dueDate = new Date(milestone.dueDate);
                    if (dueDate < now && milestone.status !== 'complete') {
                        const daysOverdue = Math.abs(getDaysUntil(milestone.dueDate));
                        overdueMilestones.push({ ...milestone, phase: phase.name, daysOverdue });
                    }
                });
            });

            const overdueContent = overdueMilestones.length > 0
                ? overdueMilestones.map(m => `
                    <div style="padding: 0.75rem; background: var(--bg-secondary); border-left: 3px solid var(--danger); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                        <strong>${m.id}</strong> - ${m.name}<br>
                        <small>Due: ${formatDate(m.dueDate)} | Overdue by ${m.daysOverdue} days</small><br>
                        <small>Owner: ${m.owner}</small>
                    </div>
                `).join('')
                : '<p style="color: var(--success);">✅ No overdue milestones!</p>';

            showModal('Overdue Items', `<h3>⚠️ Requires Attention</h3>${overdueContent}`);
            break;

        case 'edit-milestone':
            showEditMilestoneModal();
            break;

        case 'export-report':
            exportWeeklyReport();
            break;

        case 'toggle-theme':
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            document.getElementById('theme-indicator').textContent = isDark ? '🌙' : '☀️';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            break;

        case 'notifications':
            showModal('Notification Preferences', `
                <h3>Notifications</h3>
                <label style="display: block; margin: 1rem 0;">
                    <input type="checkbox" checked> Milestone due reminders
                </label>
                <label style="display: block; margin: 1rem 0;">
                    <input type="checkbox" checked> Risk escalation alerts
                </label>
                <label style="display: block; margin: 1rem 0;">
                    <input type="checkbox"> Daily progress summary
                </label>
                <label style="display: block; margin: 1rem 0;">
                    <input type="checkbox"> Team updates
                </label>
                <p><em>Note: Browser notifications require permission</em></p>
            `);
            break;

        case 'clear-data':
            if (confirm('Clear all local progress data? This cannot be undone.')) {
                localStorage.clear();
                location.reload();
            }
            break;

        case 'financial':
            const totalRevenue = projectData.phases.reduce((sum, phase) => sum + phase.revenue, 0);
            showModal('Financial Dashboard', `
                <h3>Revenue Targets by Phase</h3>
                ${projectData.phases.map(phase => `
                    <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                        <strong>${phase.name}</strong><br>
                        <span style="font-size: 1.25rem; color: var(--success);">${formatCurrency(phase.revenue)}</span>
                    </div>
                `).join('')}
                <div style="padding: 1rem; background: var(--primary); color: white; border-radius: 0.5rem; margin-top: 1rem; text-align: center;">
                    <strong>Total Project Revenue Target</strong><br>
                    <span style="font-size: 1.5rem;">${formatCurrency(totalRevenue)}</span>
                </div>
            `);
            break;

        case 'overview':
            showModal('Project Overview', `
                <h3>Stabilis Diversification Implementation</h3>
                <p><strong>Duration:</strong> ${formatDate(projectData.startDate)} - ${formatDate(projectData.endDate)}</p>
                <p><strong>Total Budget:</strong> R6.169 million</p>
                <p><strong>Phases:</strong> 5 implementation phases</p>
                <p><strong>Milestones:</strong> 29 key deliverables</p>
                <p><strong>Objective:</strong> Expand clinical services to include adolescent outpatient care, group therapy, and psychiatric services.</p>
            `);
            break;

        case 'glossary':
            showModal('Glossary of Terms', `
                <h3>Key Terms</h3>
                <dl style="line-height: 1.8;">
                    <dt><strong>Milestone</strong></dt>
                    <dd>A key project deliverable or checkpoint</dd>
                    
                    <dt><strong>Phase</strong></dt>
                    <dd>A major stage of the project with specific goals</dd>
                    
                    <dt><strong>Risk</strong></dt>
                    <dd>Potential issue that could impact project success</dd>
                    
                    <dt><strong>Revenue Target</strong></dt>
                    <dd>Expected income from new services per phase</dd>
                    
                    <dt><strong>Mobilisation</strong></dt>
                    <dd>Initial project setup and team preparation</dd>
                    
                    <dt><strong>Pilot Launch</strong></dt>
                    <dd>Limited rollout to test new services</dd>
                </dl>
            `);
            break;

        case 'version':
            showModal('Version & Updates', `
                <h3>App Version</h3>
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Last Updated:</strong> November 2025</p>
                <h4>Recent Updates:</h4>
                <ul>
                    <li>✨ Added help sidebar with tutorials</li>
                    <li>📱 Mobile-optimized interface</li>
                    <li>💾 Local progress saving</li>
                    <li>🎨 Dark mode support</li>
                </ul>
            `);
            break;

        case 'support':
            showSupportModal();
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
            handleUnknownSidebarAction(action);
    }
}

// Helper function for role filtering
window.applyRoleFilter = function () {
    const role = document.getElementById('role-filter').value;
    if (!role) return;

    closeModal();
    switchView('phases');

    setTimeout(() => {
        document.querySelectorAll('.milestone-item').forEach(item => {
            const owner = item.querySelector('.milestone-meta')?.textContent || '';
            if (owner.includes(role)) {
                item.style.display = 'flex';
                item.style.background = 'var(--bg-tertiary)';
            } else {
                item.style.display = 'none';
            }
        });
    }, 300);
};

// Edit Milestone Functionality
function showEditMilestoneModal() {
    // Check if user has permission
    if (!currentUser || !canEditMilestones()) {
        showModal('Access Denied', `
            <h3>⚠️ Permission Required</h3>
            <p>Only the steering leads below can edit milestones:</p>
            <ul>
                <li>Attie Nel (CEO/Project Manager)</li>
                <li>Nastasha Jacobs (Finance Manager)</li>
                <li>Lydia Gittens (Medical Manager)</li>
            </ul>
            <p>Please contact one of these administrators if you need to make changes.</p>
        `);
        return;
    }

    // Get all milestones
    let allMilestones = [];
    projectData.phases.forEach(phase => {
        phase.milestones.forEach(milestone => {
            allMilestones.push({
                ...milestone,
                phaseId: phase.id,
                phaseName: phase.name
            });
        });
    });

    // Get all team members
    const teamMembers = [];
    if (typeof teamRoles !== 'undefined') {
        teamRoles.admin.forEach(user => teamMembers.push(user.name));
        teamRoles.team.forEach(user => teamMembers.push(user.name));
    }

    showModal('✏️ Edit Milestone', `
        <div class="edit-milestone-form">
            <div class="form-group">
                <label for="select-milestone">Select Milestone:</label>
                <select id="select-milestone" class="form-control" onchange="loadMilestoneData()">
                    <option value="">-- Choose a milestone --</option>
                    ${allMilestones.map(m => `
                        <option value="${m.id}" data-phase="${m.phaseId}">
                            ${m.id} - ${m.title} (${m.phaseName})
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div id="edit-milestone-fields" style="display: none;">
                <div class="form-group">
                    <label for="edit-person">Person Responsible:</label>
                    <select id="edit-person" class="form-control">
                        <option value="">-- Select person --</option>
                        ${teamMembers.map(name => `<option value="${name}">${name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-due-date">Due Date:</label>
                    <input type="date" id="edit-due-date" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="edit-status">Status:</label>
                    <select id="edit-status" class="form-control">
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="complete">Complete</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-priority">Priority:</label>
                    <select id="edit-priority" class="form-control">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-notes">Notes:</label>
                    <textarea id="edit-notes" class="form-control" rows="3" placeholder="Add any notes about this change..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button onclick="saveMilestoneChanges()" class="btn-primary">💾 Save Changes</button>
                    <button onclick="closeModal()" class="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
        
        <style>
            .edit-milestone-form .form-group {
                margin-bottom: 1.25rem;
            }
            .edit-milestone-form label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--text-primary);
            }
            .edit-milestone-form .form-control {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid var(--border);
                border-radius: 0.5rem;
                font-size: 1rem;
                background: var(--bg-primary);
                color: var(--text-primary);
            }
            .edit-milestone-form .form-control:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            .form-actions {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
            }
            .btn-primary, .btn-secondary {
                flex: 1;
                padding: 0.875rem;
                border: none;
                border-radius: 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-primary {
                background: var(--primary);
                color: white;
            }
            .btn-primary:hover {
                background: var(--primary-dark);
                transform: translateY(-1px);
            }
            .btn-secondary {
                background: var(--secondary);
                color: white;
            }
            .btn-secondary:hover {
                background: #475569;
            }
        </style>
    `);
}

function showSupportModal() {
    showModal('Contact Support', `
        <h3>Need Help?</h3>
        <p><strong>Project Manager:</strong> CEO<br>
        <strong>Technical Support:</strong> Administrative Officer</p>
        <p>For urgent issues, contact your phase lead or escalate to the CEO.</p>
        <p><em>See Team tab for full contact directory</em></p>
    `);
}

function handleUnknownSidebarAction(actionName) {
    const safeName = actionName || 'Unmapped Shortcut';
    showModal('Action Assistant', `
        <p>The shortcut <strong>${safeName}</strong> isn't mapped yet.</p>
        <p>Select one of the options below to keep moving:</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;">
            <button id="fallback-log-update" style="flex:1;min-width:180px;padding:0.75rem;border:none;border-radius:0.75rem;background:var(--primary);color:white;font-weight:600;cursor:pointer;">Log a Project Update</button>
            <button id="fallback-open-support" style="flex:1;min-width:180px;padding:0.75rem;border:1px solid var(--border-color);border-radius:0.75rem;background:var(--bg-secondary);cursor:pointer;">Open Support Directory</button>
        </div>
    `);

    requestAnimationFrame(() => {
        document.getElementById('fallback-log-update')?.addEventListener('click', openQuickUpdateModal);
        document.getElementById('fallback-open-support')?.addEventListener('click', showSupportModal);
    });
}

function formatTimestamp(value) {
    if (!value) return 'Just now';
    const date = new Date(value);
    return date.toLocaleString('en-ZA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function exportWeeklyReport() {
    const report = buildWeeklyReportSummary();
    const fileName = `stabilis-diversification-weekly-${new Date().toISOString().split('T')[0]}.txt`;
    downloadTextFile(fileName, report);
    showModal('Weekly Report Exported', `
        <p>The latest summary was downloaded as <strong>${fileName}</strong>.</p>
        <p style="font-size:0.875rem;color:var(--text-muted);">Share this file via email or upload it to your project workspace.</p>
        <pre style="max-height:220px;overflow:auto;background:var(--bg-secondary);padding:1rem;border-radius:0.75rem;">${escapeHtml(report)}</pre>
    `);
}

function buildWeeklyReportSummary() {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const completed = [];
    const upcoming = [];
    const overdue = [];

    projectData.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const dueDate = new Date(m.due || m.dueDate);
            if (isNaN(dueDate)) return;
            if (m.status === 'complete' && dueDate >= lastWeek && dueDate <= today) {
                completed.push(`${m.id} - ${m.name} (${phase.name})`);
            } else if (dueDate > today && dueDate <= nextWeek && m.status !== 'complete') {
                upcoming.push(`${m.id} - ${m.name} (${phase.name}) due ${formatDate(m.dueDate || m.due)}`);
            } else if (dueDate < today && m.status !== 'complete') {
                overdue.push(`${m.id} - ${m.name} (${phase.name}) overdue by ${Math.abs(getDaysUntil(m.dueDate || m.due))} days`);
            }
        });
    });

    const riskSummary = (projectData.risks || []).map(risk => `${risk.id || risk.title}: ${risk.severity?.toUpperCase()} • Owner ${risk.owner || 'Unassigned'}`);
    const status = getMilestoneStatus();

    return [
        'STABILIS WEEKLY SUMMARY',
        `Generated: ${today.toLocaleString('en-ZA')}`,
        '',
        `Project: ${projectData.name || 'Diversification'}`,
        `Timeline: ${formatDate(projectData.startDate)} – ${formatDate(projectData.endDate)}`,
        '',
        `Progress: ${status.complete}/${status.total} milestones complete`,
        '',
        'Completed (last 7 days):',
        completed.length ? completed.map(line => ` • ${line}`).join('\n') : ' • None recorded',
        '',
        'Upcoming (next 7 days):',
        upcoming.length ? upcoming.map(line => ` • ${line}`).join('\n') : ' • None scheduled',
        '',
        'Overdue items:',
        overdue.length ? overdue.map(line => ` • ${line}`).join('\n') : ' • None 🎉',
        '',
        'Active risks:',
        riskSummary.length ? riskSummary.map(line => ` • ${line}`).join('\n') : ' • No risks captured'
    ].join('\n');
}

function downloadTextFile(fileName, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function escapeHtml(text = '') {
    return text.replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
}

window.loadMilestoneData = function () {
    const milestoneId = document.getElementById('select-milestone').value;
    if (!milestoneId) {
        document.getElementById('edit-milestone-fields').style.display = 'none';
        return;
    }

    // Find the milestone
    let milestone = null;
    projectData.phases.forEach(phase => {
        const found = phase.milestones.find(m => m.id === milestoneId);
        if (found) milestone = found;
    });

    if (!milestone) return;

    // Show fields and populate with current data
    document.getElementById('edit-milestone-fields').style.display = 'block';
    document.getElementById('edit-person').value = milestone.owner || '';
    document.getElementById('edit-due-date').value = milestone.due || milestone.dueDate || '';
    document.getElementById('edit-status').value = milestone.status || 'planned';
    document.getElementById('edit-priority').value = milestone.priority || 'medium';
    document.getElementById('edit-notes').value = '';
};

window.saveMilestoneChanges = function () {
    const milestoneId = document.getElementById('select-milestone').value;
    if (!milestoneId) return;

    const newOwner = document.getElementById('edit-person').value;
    const newDueDate = document.getElementById('edit-due-date').value;
    const newStatus = document.getElementById('edit-status').value;
    const newPriority = document.getElementById('edit-priority').value;
    const notes = document.getElementById('edit-notes').value;

    // Find and update the milestone
    let updated = false;
    let affectedPhase = null;
    projectData.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            if (newOwner) milestone.owner = newOwner;
            if (newDueDate) {
                const normalized = normalizeDateString(newDueDate) || newDueDate;
                milestone.due = normalized;
                milestone.dueDate = normalized;
            }
            if (newStatus) milestone.status = newStatus;
            if (newPriority) milestone.priority = newPriority;

            // Store change log
            if (!milestone.changeLog) milestone.changeLog = [];
            milestone.changeLog.push({
                date: new Date().toISOString(),
                user: currentUser ? currentUser.name : 'Unknown',
                changes: {
                    owner: newOwner,
                    dueDate: newDueDate,
                    status: newStatus,
                    priority: newPriority
                },
                notes: notes
            });

            updated = true;
            affectedPhase = phase;
        }
    });

    if (updated) {
        if (affectedPhase) {
            recalculatePhaseTimeline(affectedPhase);
        }
        recalculateProjectTimeline();
        // Save to localStorage
        saveToLocalStorage();

        // Update UI
        updateDashboard();
        schedulePhaseRender();

        // Show success message
        closeModal();
        setTimeout(() => {
            showModal('✅ Success', `
                <h3>Milestone Updated</h3>
                <p><strong>${milestoneId}</strong> has been successfully updated.</p>
                <p>Changes have been saved and the dashboard has been refreshed.</p>
            `);
        }, 300);
    }
};

function canEditMilestones() {
    if (!currentUser) return false;

    // Check if user is in the admin list with edit permissions
    const allowedUsers = ['Attie Nel', 'Nastasha Jacobs', 'Lydia Gittens'];
    return allowedUsers.includes(currentUser.name);
}

// Load saved data and initialize
loadFromLocalStorage();

window.addEventListener('storage', (event) => {
    if (event.key === 'stabilis-project-data') {
        loadFromLocalStorage();
        updateDashboard();
        schedulePhaseRender();
    }
});

window.addEventListener('project-data-updated', (event) => {
    if (!event.detail || event.detail.key !== 'stabilis-project-data') {
        return;
    }
    loadFromLocalStorage();
    updateDashboard();
    schedulePhaseRender();
});

// Apply saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

document.addEventListener('DOMContentLoaded', () => {
    init();

    // Sidebar event listeners
    document.getElementById('menu-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close')?.addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

    // Sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            if (action) handleSidebarAction(action);
        });
    });

    // Sidebar section toggles
    document.querySelectorAll('.sidebar-section-title').forEach(title => {
        title.addEventListener('click', (e) => {
            const section = e.currentTarget.closest('.sidebar-section');
            const wasExpanded = section.classList.contains('expanded');

            // Close all other sections
            document.querySelectorAll('.sidebar-section').forEach(s => {
                s.classList.remove('expanded');
            });

            // Toggle this section
            if (!wasExpanded) {
                section.classList.add('expanded');
            }
        });
    });

    // Update theme indicator
    if (savedTheme === 'dark' && document.getElementById('theme-indicator')) {
        document.getElementById('theme-indicator').textContent = '🌙';
    }

    // Swipe to close sidebar (mobile)
    let touchStartX = 0;
    const sidebar = document.getElementById('sidebar');

    sidebar?.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    sidebar?.addEventListener('touchmove', (e) => {
        const touchCurrentX = e.touches[0].clientX;
        const diff = touchStartX - touchCurrentX;

        if (diff > 50) { // Swipe left
            closeSidebar();
        }
    });
});

// ============================================================================
// EXCEL SYNC FUNCTIONALITY (Future Implementation)
// ============================================================================

/**
 * Sync milestone changes to Excel file for persistent storage
 * This ensures data survives across deployments and code updates
 * 
 * @param {string} milestoneId - The milestone ID (e.g., "P1-M1")
 * @param {object} milestone - The milestone object with updated fields
 */
async function syncMilestoneToExcel(milestoneId, milestone) {
    // TODO: Implement when Excel sync endpoint is ready
    // This will POST to /api/milestone/update endpoint

    console.log('Excel sync placeholder - would sync:', { milestoneId, milestone });

    /*
    try {
        const response = await fetch('/api/milestone/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project: 'diversification', // or 'turnaround' or 'wellness'
                milestoneId: milestoneId,
                status: milestone.status,
                completedDate: milestone.completedDate,
                completedBy: milestone.completedBy,
                notes: milestone.notes,
                changeLog: milestone.changeLog
            })
        });
        
        if (!response.ok) {
            console.error('Failed to sync to Excel');
            showNotification('Warning: Changes saved locally but not synced to Excel', 'warning');
        } else {
            showNotification('Changes synced to Excel successfully', 'success');
        }
    } catch (error) {
        console.error('Excel sync error:', error);
        showNotification('Warning: Changes saved locally but not synced to Excel', 'warning');
    }
    */
}

/**
 * Show a notification to the user
 */
function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with a toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
    // TODO: Add visual notification in UI
}

