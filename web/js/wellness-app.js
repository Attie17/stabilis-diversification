// Wellness Centre App
// App State
let currentView = 'dashboard';

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

// Render copilot buttons based on user access
function renderCopilotButtons() {
    wellnessProject.phases.forEach(phase => {
        phase.milestones.forEach(m => {
            const container = document.getElementById(`copilot-btn-${m.id}`);
            if (container) {
                container.innerHTML = getCopilotButton(m.id, 'wellness');
            }
        });
    });
}

// Event Handlers will be defined later - see bindEvents() function below

function switchView(viewName) {
    currentView = viewName;
    
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    const viewElement = document.getElementById(`${viewName}-view`);
    const tabElement = document.querySelector(`[data-view="${viewName}"]`);
    
    if (viewElement) viewElement.classList.add('active');
    if (tabElement) tabElement.classList.add('active');
    
    // Load view-specific content
    if (viewName === 'risks') renderRisks();
    if (viewName === 'team') renderTeam();
}

// Initialize
function init() {
    // Initialize authentication first
    initAuth();
    
    updateDashboardStats();
    renderPhases();
    renderCopilotButtons();
    bindEvents();
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
    const container = document.getElementById('risks-container');
    if (!container) return;
    
    const risks = wellnessProject.risks || [];
    
    if (risks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No risks identified yet.</p>';
        return;
    }
    
    container.innerHTML = risks.map(risk => `
        <div class="risk-card ${risk.severity}">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <h3 style="margin: 0; font-size: 1rem;">${risk.title}</h3>
                <span class="risk-badge ${risk.severity}">${risk.severity.toUpperCase()}</span>
            </div>
            <p style="color: #6b7280; font-size: 0.875rem; margin: 0.5rem 0;">${risk.description}</p>
            <div style="display: flex; gap: 1rem; margin-top: 0.75rem; font-size: 0.875rem;">
                <span><strong>Impact:</strong> ${risk.impact}</span>
                <span><strong>Likelihood:</strong> ${risk.likelihood}</span>
                <span><strong>Owner:</strong> ${risk.owner}</span>
            </div>
        </div>
    `).join('');
}

// Render team view
function renderTeam() {
    const container = document.getElementById('team-container');
    if (!container) return;
    
    const team = wellnessProject.team || [];
    
    if (team.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No team members defined yet.</p>';
        return;
    }
    
    container.innerHTML = team.map(member => `
        <div class="team-card">
            <h3 style="margin: 0 0 0.5rem; font-size: 1.125rem;">${member.name}</h3>
            <p style="color: #3b82f6; font-weight: 600; margin: 0 0 0.75rem; font-size: 0.875rem;">${member.role}</p>
            <p style="color: #6b7280; font-size: 0.875rem; margin: 0;">${member.responsibilities}</p>
        </div>
    `).join('');
}

// Render Phases and Milestones
function renderPhases() {
    const container = document.getElementById('phases-container');
    if (!container) return;
    
    container.innerHTML = wellnessProject.phases.map(phase => renderPhase(phase)).join('');
}

function renderPhase(phase) {
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
    const urgencyClass = isOverdue ? 'overdue' : (daysUntil <= 7 ? 'urgent' : '');
    
    return `
        <div class="milestone ${statusClass} ${urgencyClass}" id="milestone-${milestone.id}">
            <div class="milestone-header">
                <div class="milestone-left">
                    <input 
                        type="checkbox" 
                        ${milestone.status === 'complete' ? 'checked' : ''} 
                        onclick="toggleMilestoneStatus('${milestone.id}')"
                        class="milestone-checkbox"
                    >
                    <div>
                        <h3>${milestone.title}</h3>
                        ${getMilestoneOwnerBadge(milestone.id)}
                        <div class="milestone-meta">
                            <span class="milestone-owner">👤 ${milestone.owner}</span>
                            <span class="milestone-due">📅 ${formatDate(milestone.due)}</span>
                            ${isOverdue ? '<span class="milestone-overdue">⚠️ Overdue</span>' : ''}
                            ${daysUntil >= 0 && daysUntil <= 7 && milestone.status !== 'complete' ? `<span class="milestone-urgent">⏰ ${daysUntil} days</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="milestone-actions">
                    <button class="milestone-btn" onclick="toggleMilestoneDetails('${milestone.id}')">Details</button>
                    <button class="milestone-btn" onclick="toggleMilestoneNotes('${milestone.id}')">Notes</button>
                </div>
            </div>
            
            <!-- Details Section -->
            <div class="milestone-details" id="details-${milestone.id}" style="display: none;">
                <button class="close-btn" onclick="toggleMilestoneDetails('${milestone.id}')">&times;</button>
                <p><strong>Description:</strong> ${milestone.description}</p>
                ${milestone.details ? renderMilestoneDetails(milestone.details) : ''}
                <div id="copilot-btn-${milestone.id}"></div>
            </div>
            
            <!-- Notes Section -->
            <div class="milestone-notes" id="notes-${milestone.id}" style="display: none;">
                <button class="close-btn" onclick="toggleMilestoneNotes('${milestone.id}')">&times;</button>
                <h4>📝 Notes & Attachments</h4>
                <textarea 
                    id="notes-text-${milestone.id}" 
                    placeholder="Add your notes, decisions, or progress updates here..."
                    class="notes-textarea"
                >${getMilestoneNotes(milestone.id)}</textarea>
                <div class="notes-actions">
                    <button class="save-btn" onclick="saveMilestoneNotes('${milestone.id}')">💾 Save Notes</button>
                    <label class="upload-btn">
                        📎 Upload File
                        <input type="file" onchange="uploadFile('${milestone.id}', event)" style="display: none;">
                    </label>
                </div>
                <div id="files-${milestone.id}" class="files-list">
                    ${renderUploadedFiles(milestone.id)}
                </div>
            </div>
        </div>
    `;
}

function renderMilestoneDetails(details) {
    let html = '';
    
    if (details.whatYouNeed) {
        html += '<div class="detail-section"><h4>✅ What You Need:</h4><ul>';
        details.whatYouNeed.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (details.tips) {
        html += '<div class="detail-section"><h4>💡 Tips:</h4><ul>';
        details.tips.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += '</ul></div>';
    }
    
    return html;
}

// Toggle Functions
function togglePhase(phaseId) {
    const body = document.getElementById(`phase-body-${phaseId}`);
    const icon = document.querySelector(`#phase-${phaseId} .expand-icon`);
    
    if (body.style.display === 'none' || body.style.display === '') {
        body.style.display = 'block';
        icon.textContent = '▲';
    } else {
        body.style.display = 'none';
        icon.textContent = '▼';
    }
}

function toggleMilestoneDetails(milestoneId) {
    const details = document.getElementById(`details-${milestoneId}`);
    const notes = document.getElementById(`notes-${milestoneId}`);
    
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        if (notes.style.display === 'block') {
            notes.style.display = 'none';
        }
    } else {
        details.style.display = 'none';
    }
}

function toggleMilestoneNotes(milestoneId) {
    const notes = document.getElementById(`notes-${milestoneId}`);
    const details = document.getElementById(`details-${milestoneId}`);
    
    if (notes.style.display === 'none' || notes.style.display === '') {
        notes.style.display = 'block';
        if (details.style.display === 'block') {
            details.style.display = 'none';
        }
    } else {
        notes.style.display = 'none';
    }
}

function toggleMilestoneStatus(milestoneId) {
    wellnessProject.phases.forEach(phase => {
        const milestone = phase.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            milestone.status = milestone.status === 'complete' ? 'planned' : 'complete';
            saveMilestoneStatus(milestoneId, milestone.status);
            renderPhases();
            renderCopilotButtons();
        }
    });
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
    reader.onload = function(e) {
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
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            if (view) {
                switchView(view);
            }
        });
    });
    
    // Hamburger menu
    document.getElementById('menu-btn')?.addEventListener('click', toggleSidebar);
    
    // Close sidebar
    document.getElementById('sidebar-close')?.addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
    
    // Sidebar section toggles
    document.querySelectorAll('.sidebar-section-title').forEach(btn => {
        btn.addEventListener('click', function() {
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
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleSidebarAction(action);
        });
    });
}

function handleSidebarAction(action) {
    // Close sidebar
    closeSidebar();
    
    switch(action) {
        case 'home':
            window.location.href = '/';
            break;
        case 'switch-diversification':
            window.location.href = '/index.html';
            break;
        case 'switch-turnaround':
            window.location.href = '/turnaround.html';
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
            alert(`⏳ ${action}\n\nThis feature is under development and will be available in a future update.`);
    }
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
