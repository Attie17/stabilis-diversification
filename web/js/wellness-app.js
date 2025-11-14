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

// Initialize
function init() {
    // Initialize authentication first
    initAuth();
    
    renderPhases();
    renderCopilotButtons();
    bindEvents();
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

// Sidebar Events
function bindEvents() {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');
    
    menuBtn?.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
    
    sidebarClose?.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
    
    sidebarOverlay?.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
    
    // Sidebar section toggles
    document.querySelectorAll('.sidebar-section-title').forEach(btn => {
        btn.addEventListener('click', function() {
            const toggle = this.getAttribute('data-toggle');
            const content = document.getElementById(toggle);
            const arrow = this.querySelector('.section-arrow');
            
            // Close all other sections
            document.querySelectorAll('.sidebar-section-content').forEach(section => {
                if (section.id !== toggle) {
                    section.classList.remove('active');
                }
            });
            document.querySelectorAll('.section-arrow').forEach(a => {
                if (a !== arrow) {
                    a.textContent = '▼';
                }
            });
            
            // Toggle current section
            content.classList.toggle('active');
            arrow.textContent = content.classList.contains('active') ? '▲' : '▼';
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
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    // Close sidebar
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    
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
        case 'view-metrics':
            alert('📊 Key Metrics Dashboard\n\n' +
                '💰 Monthly Revenue Target: R250,000\n' +
                '📅 Sessions per Month: 300+\n' +
                '👥 Practitioner Utilization: 75%\n' +
                '🤝 School/Corporate Contracts: 10+\n' +
                '💻 Digital Product Revenue: R50,000/month\n\n' +
                'Full dashboard coming soon!');
            break;
        case 'practitioner-schedule':
            alert('📅 Practitioner Schedule\n\nView and manage practitioner availability, bookings, and capacity.\n\n⏳ Feature coming soon!');
            break;
        case 'referral-tracker':
            alert('🔗 Referral Tracker\n\nTrack referral sources: GPs, schools, corporate partners, and conversion rates.\n\n⏳ Feature coming soon!');
            break;
        case 'session-capacity':
            alert('📈 Session Capacity View\n\nMonitor session capacity, utilization rates, and booking trends.\n\n⏳ Feature coming soon!');
            break;
        case 'revenue-dashboard':
            alert('💰 Revenue Dashboard\n\nDetailed revenue breakdown by service type, practitioner, and time period.\n\n⏳ Feature coming soon!');
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
        default:
            alert(`⏳ ${action}\n\nThis feature is under development and will be available in a future update.`);
    }
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
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
