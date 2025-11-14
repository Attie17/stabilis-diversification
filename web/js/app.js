// App State
let currentView = 'dashboard';
let currentRiskFilter = 'all';

// Utility Functions
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

// Render copilot buttons based on user access
function renderCopilotButtons() {
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
    
    loadMilestoneStatus();
    updateCountdown();
    updateDashboard();
    renderPhases();
    renderCopilotButtons();
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
                                       onclick="event.stopPropagation(); toggleMilestone('${m.id}')">
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
                                <div class="copilot-content" id="copilot-${m.id}" style="display: none;">
                                    ${showCopilot(m.id)}
                                </div>
                                
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
        if (currentOpenNotes) {
            document.getElementById(`notes-${currentOpenNotes}`).style.display = 'none';
            currentOpenNotes = null;
        }
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
    
    // Close notes when closing milestone
    if (isOpen && currentOpenNotes === milestoneId) {
        document.getElementById(`notes-${milestoneId}`).style.display = 'none';
        currentOpenNotes = null;
    }
};

window.toggleMilestoneNotes = function(milestoneId, event) {
    if (event) event.stopPropagation();
    
    const notesSection = document.getElementById(`notes-${milestoneId}`);
    const isOpen = notesSection.style.display === 'block';
    
    notesSection.style.display = isOpen ? 'none' : 'block';
    currentOpenNotes = isOpen ? null : milestoneId;
};

window.toggleCopilot = function(milestoneId, event) {
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

window.triggerUpload = function(milestoneId) {
    document.getElementById(`upload-${milestoneId}`).click();
};

window.handleFileUpload = function(milestoneId, files) {
    Array.from(files).forEach(file => {
        saveUpload(milestoneId, file.name, file.size);
    });
    document.getElementById(`uploads-${milestoneId}`).innerHTML = renderUploadList(milestoneId);
    document.getElementById(`upload-${milestoneId}`).value = '';
};

// Milestone Toggle
function toggleMilestone(milestoneId) {
    // Find the milestone in the data
    let found = false;
    projectData.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            milestone.status = milestone.status === 'complete' ? 'planned' : 'complete';
            found = true;
        }
    });
    
    if (found) {
        saveMilestoneStatus();
        updateDashboard();
        renderPhases();
    }
}

function saveMilestoneStatus() {
    const statuses = {};
    projectData.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            statuses[m.id] = m.status;
        });
    });
    localStorage.setItem('stabilis-project-statuses', JSON.stringify(statuses));
}

function loadMilestoneStatus() {
    const statuses = JSON.parse(localStorage.getItem('stabilis-project-statuses') || '{}');
    projectData.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            if (statuses[m.id]) {
                m.status = statuses[m.id];
            }
        });
    });
}

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
    document.getElementById('add-update').addEventListener('click', () => {
        showModal('Add Update', `
            <p>Quick update feature coming soon!</p>
            <p>Use this to log progress, mark milestones complete, or add notes.</p>
        `);
    });
    
    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
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
    // Find and toggle milestone
    projectData.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            milestone.status = milestone.status === 'complete' ? 'planned' : 'complete';
            
            // Update UI
            updateDashboard();
            renderPhases();
            
            // Save to localStorage
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
    localStorage.setItem('stabilis-project-data', JSON.stringify(projectData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('stabilis-project-data');
    if (saved) {
        const savedData = JSON.parse(saved);
        // Merge saved milestone statuses
        projectData.phases.forEach((phase, pi) => {
            phase.milestones.forEach((milestone, mi) => {
                if (savedData.phases[pi]?.milestones[mi]?.status) {
                    milestone.status = savedData.phases[pi].milestones[mi].status;
                }
            });
        });
    }
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
    
    switch(action) {
        case 'home':
            window.location.href = '/';
            break;
            
        case 'switch-turnaround':
            window.location.href = '/turnaround.html';
            break;
            
        case 'switch-wellness':
            window.location.href = '/wellness.html';
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
            showModal('Export Weekly Report', `
                <h3>Generate Report</h3>
                <p>This feature will export a summary of:</p>
                <ul>
                    <li>Completed milestones this week</li>
                    <li>Upcoming milestones</li>
                    <li>Active risks</li>
                    <li>Budget status</li>
                </ul>
                <p><em>Coming soon: PDF and email export options</em></p>
            `);
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
            const totalRevenue = projectData.phases.reduce((sum, phase) => sum + phase.revenueTarget, 0);
            showModal('Financial Dashboard', `
                <h3>Revenue Targets by Phase</h3>
                ${projectData.phases.map(phase => `
                    <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                        <strong>${phase.name}</strong><br>
                        <span style="font-size: 1.25rem; color: var(--success);">${formatCurrency(phase.revenueTarget)}</span>
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
            showModal('Contact Support', `
                <h3>Need Help?</h3>
                <p><strong>Project Manager:</strong> CEO<br>
                <strong>Technical Support:</strong> Administrative Officer</p>
                <p>For urgent issues, contact your phase lead or escalate to the CEO.</p>
                <p><em>See Team tab for full contact directory</em></p>
            `);
            break;
        
        // Report navigation
        case 'revenue-projection':
            window.location.href = '/reports/revenue-projection.html';
            break;
        case 'cost-analysis':
            window.location.href = '/reports/cost-analysis.html';
            break;
        case 'phase-progress':
            window.location.href = '/reports/phase-progress.html';
            break;
        case 'risk-assessment':
            window.location.href = '/reports/risk-assessment.html';
            break;
        case 'resource-utilization':
            window.location.href = '/reports/resource-utilization.html';
            break;
        case 'kpi-dashboard-report':
            window.location.href = '/reports/kpi-dashboard.html';
            break;
        case 'timeline-analysis':
            window.location.href = '/reports/timeline-analysis.html';
            break;
        case 'budget-actual':
            window.location.href = '/reports/budget-actual.html';
            break;
        case 'cashflow-projection':
            window.location.href = '/reports/cashflow-projection.html';
            break;
            
        default:
            showModal('Feature Coming Soon', `
                <h3>${action}</h3>
                <p>This feature is under development and will be available in a future update.</p>
            `);
    }
}

// Helper function for role filtering
window.applyRoleFilter = function() {
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
            <p>Only the following users can edit milestones:</p>
            <ul>
                <li>Attie Nel (CEO/Project Manager)</li>
                <li>Natasha Jacobs (Finance Manager/Admin)</li>
                <li>Karin Weideman (Operational Manager)</li>
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

window.loadMilestoneData = function() {
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

window.saveMilestoneChanges = function() {
    const milestoneId = document.getElementById('select-milestone').value;
    if (!milestoneId) return;
    
    const newOwner = document.getElementById('edit-person').value;
    const newDueDate = document.getElementById('edit-due-date').value;
    const newStatus = document.getElementById('edit-status').value;
    const newPriority = document.getElementById('edit-priority').value;
    const notes = document.getElementById('edit-notes').value;
    
    // Find and update the milestone
    let updated = false;
    projectData.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            if (newOwner) milestone.owner = newOwner;
            if (newDueDate) {
                milestone.due = newDueDate;
                milestone.dueDate = newDueDate;
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
        }
    });
    
    if (updated) {
        // Save to localStorage
        saveToLocalStorage();
        
        // Update UI
        updateDashboard();
        renderPhases();
        
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
    const allowedUsers = ['Attie Nel', 'Natasha Jacobs', 'Karin Weideman'];
    return allowedUsers.includes(currentUser.name);
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
