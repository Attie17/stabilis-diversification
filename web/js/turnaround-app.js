// Turnaround App - adapted from diversification app.js
// App State
let currentView = 'dashboard';
const TURNAROUND_UPDATE_STORAGE_KEY = 'stabilis-turnaround-updates';
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
const FINANCE_MANAGERS = ['Nastasha Jackson', 'Nastasha Jacobs'];
const PROJECT_REPORT_ACCESS = {
    'revenue-projection': ['Attie Nel', ...FINANCE_MANAGERS],
    'cost-analysis': [...FINANCE_MANAGERS, 'Attie Nel'],
    'phase-progress': ['Attie Nel', 'Berno Paul', 'Lydia Gittens'],
    'risk-assessment': ['Attie Nel', 'Berno Paul', 'Lydia Gittens'],
    'resource-utilization': ['Attie Nel', 'Lydia Gittens'],
    'kpi-dashboard-report': ['Attie Nel', ...FINANCE_MANAGERS, 'Berno Paul', 'Lydia Gittens'],
    'timeline-analysis': ['Attie Nel'],
    'budget-actual': [...FINANCE_MANAGERS, 'Attie Nel'],
    'cashflow-projection': [...FINANCE_MANAGERS, 'Attie Nel']
};

// Reuse utility functions
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

function getProjectProgress() {
    const start = new Date(turnaroundData.startDate);
    const end = new Date(turnaroundData.endDate);
    const today = new Date();

    if (today < start) return 0;
    if (today > end) return 100;

    const total = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / total) * 100);
}

function getCurrentPhase() {
    const today = new Date();
    return turnaroundData.phases.find(phase => {
        const start = new Date(phase.startDate);
        const end = new Date(phase.endDate);
        return today >= start && today <= end;
    }) || turnaroundData.phases[0];
}

function getMilestoneStatus() {
    let total = 0;
    let complete = 0;

    turnaroundData.phases.forEach(phase => {
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
        <p>Cross-project navigation stays hidden until a steering member is active.</p>
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
        <p>Only the steering committee can open multi-project navigation.</p>
        ${listMarkup}
        <p style="margin-top:0.75rem;">Compiled reporting is available from the Executive Dashboard.</p>
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
        <p>This report is limited to its owners for this project.</p>
        ${listMarkup}
        <p style="margin-top:0.75rem;">Company-wide compilations remain on the Executive Dashboard.</p>
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

    turnaroundData.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const container = document.getElementById(`copilot-btn-${m.id}`);
            if (container) {
                container.innerHTML = getCopilotButton(m.id, 'turnaround');
            } else {
                console.warn(`Copilot container not found for ${m.id}`);
            }
        });
    });
}

// Initialize
function init() {
    // Initialize authentication first
    initAuth();

    updateCountdown();
    updateDashboard();
    renderPhases();
    renderCopilotButtons();
    renderKPIs();
    renderRisks();
    bindEvents();

    setInterval(updateCountdown, 60000);
}

function updateCountdown() {
    const daysRemaining = getDaysUntil(turnaroundData.endDate);
    const countdown = document.getElementById('countdown');

    if (daysRemaining > 0) {
        countdown.textContent = `${daysRemaining} days left`;
    } else {
        countdown.textContent = 'Complete!';
    }

    document.getElementById('days-remaining').textContent = Math.max(0, daysRemaining);
}

function updateDashboard() {
    // Progress
    const progress = getProjectProgress();
    document.getElementById('timeline-fill').style.width = `${progress}%`;
    document.getElementById('progress-percent').textContent = `${progress}%`;

    // Milestones
    const { total, complete } = getMilestoneStatus();
    const milestoneProgressEl = document.getElementById('milestones-done');
    if (milestoneProgressEl) {
        milestoneProgressEl.textContent = `${complete}/${total}`;
    }

    // Dates
    document.getElementById('timeline-start').textContent = formatDate(turnaroundData.startDate);
    document.getElementById('timeline-end').textContent = formatDate(turnaroundData.endDate);

    // Current Phase
    const currentPhase = getCurrentPhase();
    const phaseElement = document.getElementById('current-phase');
    const phaseComplete = currentPhase.milestones.filter(m => m.status === 'complete').length;
    const phaseTotal = currentPhase.milestones.length;
    const phaseProgress = phaseTotal > 0 ? Math.round((phaseComplete / phaseTotal) * 100) : 0;

    phaseElement.innerHTML = `
        <div class="phase-badge urgent">${currentPhase.id}</div>
        <h3>${currentPhase.name}</h3>
        <p>${currentPhase.description}</p>
        <div class="phase-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${phaseProgress}%"></div>
            </div>
            <span>${phaseComplete} of ${phaseTotal} milestones complete</span>
        </div>
    `;

    // Critical milestones (next 7 days)
    renderCriticalMilestones();
}

function renderCriticalMilestones() {
    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const critical = [];
    turnaroundData.phases.forEach(phase => {
        phase.milestones.forEach(milestone => {
            const dueDate = new Date(milestone.dueDate);
            if (dueDate <= weekEnd && milestone.status !== 'complete') {
                critical.push({ ...milestone, phase: phase.name });
            }
        });
    });

    const container = document.getElementById('critical-milestones');
    if (critical.length === 0) {
        container.innerHTML = '<p style="color: var(--success);">✅ No critical milestones in next 7 days</p>';
        return;
    }

    container.innerHTML = critical.map(m => `
        <div class="milestone-item ${m.priority}">
            <input type="checkbox" class="milestone-checkbox" data-id="${m.id}" ${m.status === 'complete' ? 'checked' : ''}>
            <div class="milestone-info">
                <div class="milestone-title">
                    <strong>${m.id}</strong> - ${m.name}
                    ${m.priority === 'critical' ? '<span class="badge urgent">CRITICAL</span>' : ''}
                </div>
                <div class="milestone-meta">
                    ${m.owner} | Due: ${formatDate(m.dueDate)} (${getDaysUntil(m.dueDate)} days)
                </div>
            </div>
        </div>
    `).join('');
}

function renderPhases() {
    const container = document.getElementById('phases-container');

    container.innerHTML = turnaroundData.phases.map(phase => {
        const complete = phase.milestones.filter(m => m.status === 'complete').length;
        const total = phase.milestones.length;
        const progress = total > 0 ? Math.round((complete / total) * 100) : 0;

        return `
            <div class="phase-card" data-phase-id="${phase.id}">
                <div class="phase-header">
                    <div onclick="togglePhase('${phase.id}', event)" style="flex: 1; cursor: pointer;">
                        <div class="phase-badge urgent">${phase.id}</div>
                        <h3 class="phase-title">${phase.name}</h3>
                        <p class="phase-dates">${formatDate(phase.startDate)} – ${formatDate(phase.endDate)}</p>
                    </div>
                    <button class="expand-btn" onclick="togglePhase('${phase.id}', event)" data-phase="${phase.id}">▼</button>
                </div>
                <div class="phase-description-section" style="display: none;">
                    <button class="close-btn" onclick="togglePhase('${phase.id}', event)" title="Close">✕</button>
                    <p class="phase-description">${phase.description}</p>
                    <p class="phase-impact"><strong>Target Impact:</strong> ${phase.targetImpact}</p>
                </div>
                <div class="phase-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span>${complete}/${total} milestones • ${progress}%</span>
                </div>
                <div class="phase-milestones" style="display: none;">
                    ${phase.milestones.map(milestone => `
                        <div class="milestone-card" data-milestone-id="${milestone.id}">
                            <div class="milestone-header" onclick="toggleMilestoneDetails('${milestone.id}')">
                                <input type="checkbox" 
                                       class="milestone-checkbox" 
                                       data-id="${milestone.id}" 
                                       ${milestone.status === 'complete' ? 'checked' : ''}
                                       onclick="event.stopPropagation(); toggleMilestone('${milestone.id}')">
                                <div class="milestone-info">
                                    <div class="milestone-title">
                                        <strong>${milestone.id}</strong> - ${milestone.name}
                                        ${getMilestoneOwnerBadge(milestone.id)}
                                        ${milestone.priority === 'critical' ? '<span class="badge urgent">CRITICAL</span>' : ''}
                                        ${milestone.priority === 'high' ? '<span class="badge warning">HIGH</span>' : ''}
                                    </div>
                                    <div class="milestone-meta">
                                        ${milestone.owner} | Due: ${formatDate(milestone.dueDate)}
                                    </div>
                                </div>
                            </div>
                            <div class="milestone-details" style="display: none;" data-milestone-details="${milestone.id}">
                                    <button class="close-btn" onclick="toggleMilestoneDetails('${milestone.id}', event)" title="Close">✕</button>
                                    <p>${milestone.description}</p>
                                    <p><strong>Expected Outcome:</strong> ${milestone.expectedOutcome}</p>
                                    <p><strong>KPI:</strong> ${milestone.kpi}</p>
                                    
                                    <!-- AI Copilot (Role-Based Access) -->
                                    <div id="copilot-btn-${milestone.id}"></div>
                                    <div class="copilot-content" id="copilot-${milestone.id}" style="display: none;">
                                        ${showTurnaroundCopilot(milestone.id)}
                                    </div>
                                    
                                    <!-- Checklist Button -->
                                    <button class="checklist-toggle-btn" onclick="toggleChecklist('${milestone.id}', event)">
                                        📋 Checklist (${milestone.checklist.length} items)
                                    </button>
                                    
                                    <!-- Checklist Content -->
                                    <div class="checklist-content" id="checklist-${milestone.id}" style="display: none;">
                                        <button class="close-btn" onclick="toggleChecklist('${milestone.id}', event)" title="Close">✕</button>
                                        <ul class="checklist-items">
                                            ${milestone.checklist.map((item, idx) => `
                                                <li class="checklist-item">
                                                    <div class="checklist-item-text">${item}</div>
                                                    <button class="checklist-item-note-btn" onclick="toggleChecklistNote('${milestone.id}', ${idx}, event)">
                                                        Add Note
                                                    </button>
                                                    <div class="checklist-item-notes" id="checklist-note-${milestone.id}-${idx}" style="display: none;">
                                                        <button class="close-btn" onclick="toggleChecklistNote('${milestone.id}', ${idx}, event)" title="Close">✕</button>
                                                        <textarea 
                                                            class="notes-textarea" 
                                                            placeholder="Add notes about this task..."
                                                            data-milestone="${milestone.id}"
                                                            data-checklist="${idx}"
                                                        >${getMilestoneChecklistNote(milestone.id, idx)}</textarea>
                                                        <button class="save-note-btn" onclick="saveChecklistNoteAndClose('${milestone.id}', ${idx})">
                                                            Save Note
                                                        </button>
                                                    </div>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                    
                                    <!-- Notes & Upload Button -->
                                    <button class="notes-toggle-btn" onclick="toggleMilestoneNotes('${milestone.id}', event)">
                                        📝 Notes & Attachments
                                    </button>
                                    
                                    <!-- Notes & Uploads Section -->
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
                                            >${getMilestoneNote(milestone.id)}</textarea>
                                            <button class="save-note-btn" onclick="saveMilestoneNoteAndClose('${milestone.id}')">
                                                Save Note
                                            </button>
                                        </div>
                                        
                                        <div class="upload-section">
                                            <div class="upload-header">
                                                <h4>📎 Attachments</h4>
                                                <button class="upload-btn" onclick="triggerUpload('${milestone.id}')">
                                                    + Add File
                                                </button>
                                                <input type="file" 
                                                       id="upload-${milestone.id}" 
                                                       class="upload-input" 
                                                       multiple
                                                       onchange="handleFileUpload('${milestone.id}', this.files)">
                                            </div>
                                            <ul class="upload-list" id="uploads-${milestone.id}">
                                                ${renderUploadList(milestone.id)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    currentOpenPhase = null;
    currentOpenMilestone = null;
    currentOpenChecklist = null;
    currentOpenNotes = null;
}

function renderKPIs() {
    const container = document.getElementById('kpi-grid');

    // KPI context/history data
    const kpiContext = {
        'Operating Margin': 'Currently running R1.9m deficit due to maintenance spike (R1.015m vs R236k prior year) and revenue quality issues. Must achieve positive margin to stop reserve depletion.',
        'DSO (Days Sales Outstanding)': 'Currently at 28 days post-provision. New R854k bad debt provision created this year indicates prior revenue recognition was optimistic.',
        'Creditor Days': 'Inflated by SARS liability (VAT R313k + PAYE R82k). Excluding SARS, creditor days should normalize to 45.',
        'Payroll % of Revenue': 'At ~70% vs 65% target. Headcount freeze essential. Do not cut clinical staff - they generate billable throughput.',
        'Maintenance % of Revenue': 'Spiked to 8.1% (R1.015m) from prior 1.9% (R236k). Buildings R776k, Linen/crockery R209k. Emergency spend must stop.',
        'Cash Reserves': 'Investments R3.4m being drawn down to fund operations. Cash only R538k. Must stop investment liquidation immediately.',
        'Claim Denial Rate': 'UNKNOWN - but R854k bad debt provision this year suggests high denial/documentation issues. Historical problem: claims submitted without proper auth letters, extended stays beyond approved days, incomplete clinical notes. Medical aids (Discovery, Momentum) rejecting retrospectively.',
        'SARS Compliance': 'VAT returns NOT SUBMITTED for 2 periods. Auditor flagged. Penalty clock running. Must file immediately and negotiate payment plan to avoid escalation to asset seizure.'
    };

    container.innerHTML = turnaroundData.kpis.map(kpi => {
        const trendClass = kpi.trend === 'critical' ? 'urgent' : kpi.trend === 'warning' ? 'warning' : 'ok';
        const trendIcon = kpi.trend === 'critical' ? '🔴' : kpi.trend === 'warning' ? '🟡' : '🟢';
        const context = kpiContext[kpi.name] || 'No additional context available.';

        return `
            <div class="kpi-card ${trendClass}">
                <div class="kpi-header">
                    <h3>${kpi.name}</h3>
                    <span class="kpi-trend">${trendIcon}</span>
                </div>
                <div class="kpi-values">
                    <div class="kpi-current">
                        <span class="kpi-label">Current</span>
                        <span class="kpi-value">${kpi.current}</span>
                    </div>
                    <div class="kpi-target">
                        <span class="kpi-label">Target</span>
                        <span class="kpi-value">${kpi.target}</span>
                    </div>
                </div>
                <div class="kpi-context">
                    <button class="kpi-context-toggle" onclick="toggleKPIContext('${kpi.name.replace(/[^a-zA-Z0-9]/g, '')}')">
                        Context & History
                    </button>
                    <div class="kpi-context-content" id="kpi-context-${kpi.name.replace(/[^a-zA-Z0-9]/g, '')}">
                        <p>${context}</p>
                        <div class="notes-section" style="margin-top: 0.75rem;">
                            <textarea 
                                class="notes-textarea" 
                                placeholder="Add your notes about this KPI..."
                                data-kpi="${kpi.name}"
                                style="min-height: 70px;"
                            >${getKPINote(kpi.name)}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderRisks() {
    const container = document.getElementById('risk-list');

    container.innerHTML = turnaroundData.risks.map(risk => {
        const severityClass = risk.severity === 'high' ? 'high' : risk.severity === 'medium' ? 'medium' : 'low';
        const severityIcon = risk.severity === 'high' ? '🔴' : risk.severity === 'medium' ? '🟡' : '🟢';

        return `
            <div class="risk-card ${severityClass}">
                <div class="risk-header">
                    <span class="risk-severity">${severityIcon} ${risk.severity.toUpperCase()}</span>
                    <span class="risk-id">${risk.id}</span>
                </div>
                <h3>${risk.name}</h3>
                <div class="risk-details">
                    <p><strong>Impact:</strong> ${risk.impact}</p>
                    <p><strong>Likelihood:</strong> ${risk.likelihood}</p>
                    <p><strong>Owner:</strong> ${risk.owner}</p>
                    <p><strong>Mitigation:</strong> ${risk.mitigation}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle Functions
let currentOpenPhase = null;
let currentOpenMilestone = null;
let currentOpenChecklist = null;
let currentOpenNotes = null;
let unsavedNotes = {};

window.togglePhase = function (phaseId, event) {
    if (event) event.stopPropagation();

    const phaseCard = document.querySelector(`[data-phase-id="${phaseId}"]`);
    if (!phaseCard) return;
    const description = phaseCard.querySelector('.phase-description-section');
    const isOpen = description && description.style.display === 'block';

    if (isOpen) {
        closePhaseCard(phaseId);
        return;
    }

    if (currentOpenPhase && currentOpenPhase !== phaseId) {
        closePhaseCard(currentOpenPhase);
    }

    openPhaseCard(phaseCard, phaseId);
};

function openPhaseCard(phaseCard, phaseId) {
    const description = phaseCard.querySelector('.phase-description-section');
    const milestones = phaseCard.querySelector('.phase-milestones');
    const arrow = phaseCard.querySelector('.expand-btn');

    if (description) description.style.display = 'block';
    if (milestones) milestones.style.display = 'block';
    if (arrow) arrow.textContent = '▲';

    phaseCard.classList.add('phase-open');
    currentOpenPhase = phaseId;
}

function closePhaseCard(phaseId) {
    const phaseCard = document.querySelector(`[data-phase-id="${phaseId}"]`);
    if (!phaseCard) return;

    const description = phaseCard.querySelector('.phase-description-section');
    const milestones = phaseCard.querySelector('.phase-milestones');
    const arrow = phaseCard.querySelector('.expand-btn');

    if (description) description.style.display = 'none';
    if (milestones) {
        milestones.style.display = 'none';
        milestones.querySelectorAll('.milestone-details').forEach(d => d.style.display = 'none');
    }
    if (arrow) arrow.textContent = '▼';

    phaseCard.classList.remove('phase-open');
    if (currentOpenPhase === phaseId) {
        currentOpenPhase = null;
    }

    if (currentOpenMilestone) {
        const details = phaseCard.querySelector(`[data-milestone-details="${currentOpenMilestone}"]`);
        if (details) {
            checkUnsavedAndClose(currentOpenMilestone, details);
            closeAllInMilestone(currentOpenMilestone);
            currentOpenMilestone = null;
        }
    }
}

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

    // Close checklist and notes when closing milestone
    if (isOpen) {
        closeAllInMilestone(milestoneId);
    }
};

window.toggleChecklist = function (milestoneId, event) {
    if (event) event.stopPropagation();

    const checklistContent = document.getElementById(`checklist-${milestoneId}`);
    const notesSection = document.getElementById(`notes-${milestoneId}`);
    const isOpen = checklistContent.style.display === 'block';

    // Close notes if open
    if (notesSection && !isOpen) {
        notesSection.style.display = 'none';
    }

    checklistContent.style.display = isOpen ? 'none' : 'block';
    currentOpenChecklist = isOpen ? null : milestoneId;
};

window.toggleChecklistNote = function (milestoneId, checklistIdx, event) {
    if (event) event.stopPropagation();

    const noteSection = document.getElementById(`checklist-note-${milestoneId}-${checklistIdx}`);
    const isOpen = noteSection.style.display === 'block';

    noteSection.style.display = isOpen ? 'none' : 'block';
};

window.toggleMilestoneNotes = function (milestoneId, event) {
    if (event) event.stopPropagation();

    const notesSection = document.getElementById(`notes-${milestoneId}`);
    const checklistContent = document.getElementById(`checklist-${milestoneId}`);
    const isOpen = notesSection.style.display === 'block';

    // Close checklist if open
    if (checklistContent && !isOpen) {
        checklistContent.style.display = 'none';
    }

    notesSection.style.display = isOpen ? 'none' : 'block';
    currentOpenNotes = isOpen ? null : milestoneId;
};

window.toggleTurnaroundCopilot = function (milestoneId, event) {
    if (event) event.stopPropagation();

    const copilotSection = document.getElementById(`copilot-${milestoneId}`);
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

window.saveChecklistNoteAndClose = function (milestoneId, checklistIdx) {
    const textarea = document.querySelector(`[data-milestone="${milestoneId}"][data-checklist="${checklistIdx}"]`);
    saveChecklistNote(milestoneId, checklistIdx, textarea.value);
    delete unsavedNotes[`${milestoneId}-${checklistIdx}`];
    document.getElementById(`checklist-note-${milestoneId}-${checklistIdx}`).style.display = 'none';
};

function closeAllInMilestone(milestoneId) {
    if (!milestoneId) {
        currentOpenChecklist = null;
        currentOpenNotes = null;
        return;
    }
    // Close checklist
    const checklist = document.getElementById(`checklist-${milestoneId}`);
    if (checklist) checklist.style.display = 'none';

    // Close notes
    const notes = document.getElementById(`notes-${milestoneId}`);
    if (notes) notes.style.display = 'none';

    currentOpenChecklist = null;
    currentOpenNotes = null;
}

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

// Event Handlers
function bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            switchView(view);
        });
    });

    // Modal close
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });

    // FAB
    document.getElementById('add-update')?.addEventListener('click', openTurnaroundUpdateModal);

    // Critical actions toggle
    const criticalToggle = document.getElementById('critical-actions-toggle');
    const criticalBody = document.getElementById('critical-actions-body');
    if (criticalToggle && criticalBody) {
        criticalToggle.addEventListener('click', () => {
            const expanded = criticalToggle.getAttribute('aria-expanded') === 'true';
            criticalToggle.setAttribute('aria-expanded', (!expanded).toString());
            criticalBody.hidden = expanded;
        });
    }
}

function openTurnaroundUpdateModal() {
    const milestoneOptions = ['<option value="">General turnaround update</option>']
        .concat(turnaroundData.phases.flatMap(phase =>
            phase.milestones.map(m => `<option value="${m.id}">${m.id} — ${m.name}</option>`)
        ));

    const updates = getTurnaroundUpdates();

    showModal('Log Crisis Update', `
        <form id="turnaround-update-form" style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem;">
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
                <textarea name="summary" rows="4" placeholder="Record cash flow, compliance, or operational updates" style="padding:0.75rem;border-radius:0.75rem;border:1px solid var(--border-color);"></textarea>
            </label>
            <button type="submit" style="padding:0.75rem;border:none;border-radius:0.75rem;background:var(--danger);color:white;font-size:1rem;cursor:pointer;">Save Update</button>
        </form>
        <div id="turnaround-update-feedback" style="min-height:1.25rem;font-size:0.9rem;color:var(--success);"></div>
        <div>
            <h3 style="margin:0.5rem 0;">Recent Updates</h3>
            <div id="turnaround-update-history" style="display:flex;flex-direction:column;gap:0.5rem;max-height:240px;overflow:auto;">
                ${renderTurnaroundUpdateHistory(updates)}
            </div>
        </div>
    `);

    requestAnimationFrame(() => {
        document.getElementById('turnaround-update-form')?.addEventListener('submit', handleTurnaroundUpdateSubmit);
    });
}

function getTurnaroundUpdates() {
    try {
        return JSON.parse(localStorage.getItem(TURNAROUND_UPDATE_STORAGE_KEY)) || [];
    } catch (error) {
        console.warn('Failed to read turnaround updates', error);
        return [];
    }
}

function saveTurnaroundUpdate(update) {
    const updates = getTurnaroundUpdates();
    updates.unshift(update);
    localStorage.setItem(TURNAROUND_UPDATE_STORAGE_KEY, JSON.stringify(updates.slice(0, 30)));
}

function renderTurnaroundUpdateHistory(updates) {
    if (!updates || updates.length === 0) {
        return '<p style="color:var(--text-muted);">No crisis updates logged yet.</p>';
    }
    return updates.slice(0, 6).map(update => `
        <div style="padding:0.75rem;border-radius:0.5rem;background:var(--bg-secondary);">
            <div style="font-size:0.85rem;color:var(--text-muted);">${formatTurnaroundTimestamp(update.timestamp)} • ${update.user || 'Team Member'}</div>
            <div style="font-weight:600;margin:0.25rem 0;">${(update.status || 'update').replace(/-/g, ' ')}</div>
            <p style="margin:0;font-size:0.95rem;">${update.summary}</p>
            ${update.milestoneId ? `<div style="font-size:0.8rem;color:var(--text-muted);">Milestone: ${update.milestoneId}</div>` : ''}
        </div>
    `).join('');
}

function handleTurnaroundUpdateSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const summary = form.summary.value.trim();
    const feedback = document.getElementById('turnaround-update-feedback');

    if (!summary) {
        if (feedback) {
            feedback.style.color = 'var(--danger)';
            feedback.textContent = 'Please enter a short summary before saving.';
        }
        return;
    }

    const update = {
        id: `TR-UP-${Date.now()}`,
        milestoneId: form.milestone.value || null,
        status: form.status.value,
        summary,
        user: (typeof currentUser !== 'undefined' && currentUser?.name) ? currentUser.name : 'Turnaround Lead',
        timestamp: new Date().toISOString()
    };

    saveTurnaroundUpdate(update);
    form.reset();
    const historyContainer = document.getElementById('turnaround-update-history');
    if (historyContainer) {
        historyContainer.innerHTML = renderTurnaroundUpdateHistory(getTurnaroundUpdates());
    }
    if (feedback) {
        feedback.style.color = 'var(--success)';
        feedback.textContent = 'Update captured locally. Include it in the daily crisis huddle.';
        setTimeout(() => feedback.textContent = '', 4000);
    }
}

function formatTurnaroundTimestamp(value) {
    if (!value) return 'Just now';
    return new Date(value).toLocaleString('en-ZA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function switchView(viewName) {
    currentView = viewName;

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    document.getElementById(`${viewName}-view`).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
}

async function toggleMilestone(milestoneId) {
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

    turnaroundData.phases.forEach(phase => {
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
            updateDashboard();
            renderPhases();
            saveToLocalStorage();
        }
    });

    if (!found) return;

    // Find the milestone again to get its current status for backend sync
    let currentMilestone = null;
    turnaroundData.phases.forEach(phase => {
        const m = phase.milestones.find(ms => ms.id === milestoneId);
        if (m) currentMilestone = m;
    });

    // Sync to backend (optimistic update already done)
    try {
        const response = await fetch('/api/milestones/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                milestone_id: milestoneId,
                field: 'status',
                old_value: oldStatus,
                new_value: currentMilestone.status === 'complete' ? 'completed' : currentMilestone.status,
                changed_by: currentUser?.name || 'Unknown'
            })
        });

        if (!response.ok) {
            console.warn('Backend sync failed, using localStorage');
        } else {
            console.log('✅ Turnaround milestone synced to backend');
        }
    } catch (error) {
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
    localStorage.setItem('stabilis-turnaround-data', JSON.stringify(turnaroundData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('stabilis-turnaround-data');
    if (saved) {
        const savedData = JSON.parse(saved);
        turnaroundData.phases.forEach((phase, pi) => {
            phase.milestones.forEach((milestone, mi) => {
                if (savedData.phases[pi]?.milestones[mi]?.status) {
                    milestone.status = savedData.phases[pi].milestones[mi].status;
                }
            });
        });
    }
}

// Notes Management
function getMilestoneNote(milestoneId) {
    const notes = JSON.parse(localStorage.getItem('turnaround-milestone-notes') || '{}');
    return notes[milestoneId] || '';
}

function saveMilestoneNote(milestoneId, note) {
    const notes = JSON.parse(localStorage.getItem('turnaround-milestone-notes') || '{}');
    notes[milestoneId] = note;
    localStorage.setItem('turnaround-milestone-notes', JSON.stringify(notes));

    // Show save indicator
    const indicator = document.querySelector(`[data-save-status="${milestoneId}"]`);
    if (indicator) {
        indicator.textContent = '✓ Saved';
        setTimeout(() => {
            indicator.textContent = '';
        }, 2000);
    }
}

function getMilestoneChecklistNote(milestoneId, checklistIndex) {
    const notes = JSON.parse(localStorage.getItem('turnaround-checklist-notes') || '{}');
    return notes[`${milestoneId}-${checklistIndex}`] || '';
}

function saveChecklistNote(milestoneId, checklistIndex, note) {
    const notes = JSON.parse(localStorage.getItem('turnaround-checklist-notes') || '{}');
    notes[`${milestoneId}-${checklistIndex}`] = note;
    localStorage.setItem('turnaround-checklist-notes', JSON.stringify(notes));

    // Show save indicator
    const indicator = document.querySelector(`[data-save-status="${milestoneId}-${checklistIndex}"]`);
    if (indicator) {
        indicator.textContent = '✓ Saved';
        setTimeout(() => {
            indicator.textContent = '';
        }, 2000);
    }
}

function getKPINote(kpiName) {
    const notes = JSON.parse(localStorage.getItem('turnaround-kpi-notes') || '{}');
    return notes[kpiName] || '';
}

function saveKPINote(kpiName, note) {
    const notes = JSON.parse(localStorage.getItem('turnaround-kpi-notes') || '{}');
    notes[kpiName] = note;
    localStorage.setItem('turnaround-kpi-notes', JSON.stringify(notes));
}

// File Upload Management (using localStorage for demo - in production use server upload)
function getUploads(milestoneId) {
    const uploads = JSON.parse(localStorage.getItem('turnaround-uploads') || '{}');
    return uploads[milestoneId] || [];
}

function saveUpload(milestoneId, file) {
    const uploads = JSON.parse(localStorage.getItem('turnaround-uploads') || '{}');
    if (!uploads[milestoneId]) {
        uploads[milestoneId] = [];
    }

    uploads[milestoneId].push({
        name: file.name,
        size: file.size,
        type: file.type,
        date: new Date().toISOString(),
        // In production, upload file to server and store URL
        // For demo, just store metadata
    });

    localStorage.setItem('turnaround-uploads', JSON.stringify(uploads));
}

function removeUpload(milestoneId, fileIndex) {
    const uploads = JSON.parse(localStorage.getItem('turnaround-uploads') || '{}');
    if (uploads[milestoneId]) {
        uploads[milestoneId].splice(fileIndex, 1);
        localStorage.setItem('turnaround-uploads', JSON.stringify(uploads));
    }
}

function renderUploadList(milestoneId) {
    const uploads = getUploads(milestoneId);
    if (uploads.length === 0) {
        return '<li style="color: var(--text-secondary); font-size: 0.875rem;">No attachments yet</li>';
    }

    return uploads.map((file, index) => `
        <li class="upload-item">
            <div class="upload-item-info">
                <span class="upload-icon">📄</span>
                <div>
                    <div class="upload-name">${file.name}</div>
                    <div class="upload-date">${new Date(file.date).toLocaleDateString()}</div>
                </div>
            </div>
            <button class="upload-remove" onclick="removeUploadAndRefresh('${milestoneId}', ${index})" title="Remove">
                ×
            </button>
        </li>
    `).join('');
}

// Global functions for onclick handlers
window.triggerUpload = function (milestoneId) {
    document.getElementById(`upload-${milestoneId}`).click();
};

window.handleFileUpload = function (milestoneId, files) {
    Array.from(files).forEach(file => {
        saveUpload(milestoneId, {
            name: file.name,
            size: file.size,
            type: file.type
        });
    });

    // Refresh upload list
    const listContainer = document.getElementById(`uploads-${milestoneId}`);
    if (listContainer) {
        listContainer.innerHTML = renderUploadList(milestoneId);
    }
};

window.removeUploadAndRefresh = function (milestoneId, fileIndex) {
    if (confirm('Remove this file?')) {
        removeUpload(milestoneId, fileIndex);
        const listContainer = document.getElementById(`uploads-${milestoneId}`);
        if (listContainer) {
            listContainer.innerHTML = renderUploadList(milestoneId);
        }
    }
};

window.toggleKPIContext = function (kpiId) {
    const content = document.getElementById(`kpi-context-${kpiId}`);
    const toggle = content.previousElementSibling;

    content.classList.toggle('open');
    toggle.classList.toggle('open');
};

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

        case 'switch-diversification':
            navigateToIfSteering('/index.html', 'Diversification workspace');
            break;

        case 'switch-wellness':
            navigateToIfSteering('/wellness.html', 'Wellness workspace');
            break;

        case 'executive-dashboard':
            navigateToIfSteering('/executive-dashboard.html', 'Executive Dashboard');
            break;

        case 'current-phase':
            switchView('phases');
            setTimeout(() => {
                const currentPhase = getCurrentPhase();
                const phaseElement = document.querySelector(`[data-phase-id="${currentPhase.id}"]`);
                if (phaseElement) {
                    phaseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
            break;

        case 'this-week':
            renderCriticalMilestones();
            switchView('dashboard');
            break;

        case 'overdue':
            // Show overdue milestones
            switchView('dashboard');
            setTimeout(() => {
                const overdueSection = document.querySelector('.upcoming-milestones');
                if (overdueSection) {
                    overdueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                alert('⚠️ Overdue Milestones\n\nShowing critical milestones on dashboard.\n\nMilestones past their due date need immediate attention!');
            }, 300);
            break;

        case 'kpi-dashboard':
            switchView('kpis');
            break;

        case 'edit-milestone':
            showEditMilestoneModal();
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

        case 'toggle-theme':
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            document.getElementById('theme-indicator').textContent = isDark ? '🌙' : '☀️';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            break;

        case 'clear-data':
            if (confirm('Clear all local progress data? This cannot be undone.')) {
                localStorage.removeItem('stabilis-turnaround-data');
                location.reload();
            }
            break;
    }
}

// Load saved data and initialize
loadFromLocalStorage();

// Apply saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

document.addEventListener('DOMContentLoaded', () => {
    init();

    // Milestone checkbox handler - restore persistence functionality
    document.addEventListener('change', async (e) => {
        if (e.target.classList.contains('milestone-checkbox')) {
            const milestoneId = e.target.dataset.id;
            const isChecked = e.target.checked;
            
            // Find and update milestone
            let found = null;
            turnaroundData.phases.forEach(phase => {
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

    // Auto-save notes with debounce
    let noteTimeout;
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('milestone-notes')) {
            const milestoneId = e.target.getAttribute('data-milestone');
            clearTimeout(noteTimeout);
            noteTimeout = setTimeout(() => {
                saveMilestoneNote(milestoneId, e.target.value);
            }, 1000);
        }

        if (e.target.classList.contains('notes-textarea') && e.target.getAttribute('data-checklist') !== null) {
            const milestoneId = e.target.getAttribute('data-milestone');
            const checklistIndex = e.target.getAttribute('data-checklist');
            clearTimeout(noteTimeout);
            noteTimeout = setTimeout(() => {
                saveChecklistNote(milestoneId, checklistIndex, e.target.value);
            }, 1000);
        }

        if (e.target.hasAttribute('data-kpi')) {
            const kpiName = e.target.getAttribute('data-kpi');
            clearTimeout(noteTimeout);
            noteTimeout = setTimeout(() => {
                saveKPINote(kpiName, e.target.value);
            }, 1000);
        }
    });
});
