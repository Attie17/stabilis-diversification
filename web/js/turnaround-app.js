// Turnaround App - adapted from diversification app.js
// App State
let currentView = 'dashboard';

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

// Render copilot buttons based on user access
function renderCopilotButtons() {
    turnaroundData.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const container = document.getElementById(`copilot-btn-${m.id}`);
            if (container) {
                container.innerHTML = getCopilotButton(m.id, 'turnaround');
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
    document.getElementById('milestones-done').textContent = `${complete}/${total}`;
    
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
let currentOpenMilestone = null;
let currentOpenChecklist = null;
let currentOpenNotes = null;
let unsavedNotes = {};

window.togglePhase = function(phaseId, event) {
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
        closeAllInMilestone(currentOpenMilestone);
    }
};

window.toggleMilestoneDetails = function(milestoneId, event) {
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

window.toggleChecklist = function(milestoneId, event) {
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

window.toggleChecklistNote = function(milestoneId, checklistIdx, event) {
    if (event) event.stopPropagation();
    
    const noteSection = document.getElementById(`checklist-note-${milestoneId}-${checklistIdx}`);
    const isOpen = noteSection.style.display === 'block';
    
    noteSection.style.display = isOpen ? 'none' : 'block';
};

window.toggleMilestoneNotes = function(milestoneId, event) {
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

window.toggleTurnaroundCopilot = function(milestoneId, event) {
    if (event) event.stopPropagation();
    
    const copilotSection = document.getElementById(`copilot-${milestoneId}`);
    const isOpen = copilotSection.style.display === 'block';
    
    copilotSection.style.display = isOpen ? 'none' : 'block';
};

window.saveMilestoneNoteAndClose = function(milestoneId) {
    const textarea = document.getElementById(`note-text-${milestoneId}`);
    saveMilestoneNote(milestoneId, textarea.value);
    delete unsavedNotes[milestoneId];
    document.getElementById(`notes-${milestoneId}`).style.display = 'none';
    currentOpenNotes = null;
};

window.saveChecklistNoteAndClose = function(milestoneId, checklistIdx) {
    const textarea = document.querySelector(`[data-milestone="${milestoneId}"][data-checklist="${checklistIdx}"]`);
    saveChecklistNote(milestoneId, checklistIdx, textarea.value);
    delete unsavedNotes[`${milestoneId}-${checklistIdx}`];
    document.getElementById(`checklist-note-${milestoneId}-${checklistIdx}`).style.display = 'none';
};

function closeAllInMilestone(milestoneId) {
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
    document.getElementById('add-update')?.addEventListener('click', () => {
        showModal('Add Update', '<p>Quick update feature coming soon</p>');
    });
}

function switchView(viewName) {
    currentView = viewName;
    
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    document.getElementById(`${viewName}-view`).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
}

function toggleMilestone(milestoneId) {
    turnaroundData.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            milestone.status = milestone.status === 'complete' ? 'planned' : 'complete';
            updateDashboard();
            renderPhases();
            saveToLocalStorage();
        }
    });
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
window.triggerUpload = function(milestoneId) {
    document.getElementById(`upload-${milestoneId}`).click();
};

window.handleFileUpload = function(milestoneId, files) {
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

window.removeUploadAndRefresh = function(milestoneId, fileIndex) {
    if (confirm('Remove this file?')) {
        removeUpload(milestoneId, fileIndex);
        const listContainer = document.getElementById(`uploads-${milestoneId}`);
        if (listContainer) {
            listContainer.innerHTML = renderUploadList(milestoneId);
        }
    }
};

window.toggleKPIContext = function(kpiId) {
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
    
    switch(action) {
        case 'home':
            window.location.href = '/';
            break;
            
        case 'switch-diversification':
            window.location.href = '/index.html';
            break;
            
        case 'switch-wellness':
            window.location.href = '/wellness.html';
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
            
        case 'kpi-dashboard':
            switchView('kpis');
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
