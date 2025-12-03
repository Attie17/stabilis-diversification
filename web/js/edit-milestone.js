// Edit Milestone Functionality
// Allows authorized users to edit milestone details

// Check if user can edit milestones
function canEditMilestones() {
    // Try both possible localStorage keys
    const currentUser = JSON.parse(localStorage.getItem('stabilis-current-user') || localStorage.getItem('stabilis-user') || '{}');

    if (!currentUser.name) {
        return false;
    }

    // Check if user is admin (CEO, Finance Manager, Operational Manager, Developer)
    const editableUsers = [
        "Developer",          // System Administrator
        "Attie Nel",          // CEO & Project Manager
        "Nastasha Jackson",   // Finance Manager  
        "Nastasha Jacobs",    // Legacy Finance alias
        "Karin Weideman"      // Operational Manager
    ];

    const editableRoles = [
        "System Administrator",
        "CEO & Project Manager",
        "Finance Manager",
        "Operational Manager"
    ];

    // Check by name OR by role
    const hasAccess = editableUsers.includes(currentUser.name) ||
        editableRoles.some(role => currentUser.role && currentUser.role.includes(role.split(' ')[0]));

    return hasAccess;
}

function broadcastProjectDataUpdate(key, data) {
    try {
        const payload = JSON.stringify(data);
        localStorage.setItem(key, payload);
        const customEvent = new CustomEvent('project-data-updated', {
            detail: { key, payload }
        });
        window.dispatchEvent(customEvent);
        try {
            const storageEvent = new StorageEvent('storage', { key, newValue: payload });
            window.dispatchEvent(storageEvent);
        } catch (err) {
            console.warn('StorageEvent dispatch failed', err.message || err);
        }
    } catch (error) {
        console.error('Failed to broadcast project update', error);
    }
}

// Show edit milestone modal
window.showEditMilestoneModal = function () {
    if (!canEditMilestones()) {
        alert('⚠️ Access Denied\n\nOnly the CEO, Finance Manager, and Operational Manager can edit milestones.\n\nCurrent authorized users:\n• Attie Nel (CEO & Project Manager)\n• Nastasha Jackson (Finance Manager)\n• Karin Weideman (Operational Manager)');
        return;
    }

    // Get all milestones from all projects
    const milestones = getAllMilestones();

    const modal = document.createElement('div');
    modal.id = 'edit-milestone-modal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content edit-milestone-content">
            <div class="modal-header">
                <h2>✏️ Edit Milestone</h2>
                <button class="modal-close" onclick="closeEditMilestoneModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="select-milestone">Select Milestone to Edit:</label>
                    <select id="select-milestone" onchange="loadMilestoneForEdit()">
                        <option value="">-- Choose a milestone --</option>
                        ${milestones.map(m => `
                            <option value="${m.id}" data-project="${m.project}">
                                ${m.id} - ${m.title} (${m.project})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div id="edit-milestone-form" style="display: none;">
                    <div class="milestone-edit-section">
                        <h3>📋 Current Details</h3>
                        <div id="current-milestone-details"></div>
                    </div>
                    
                    <div class="milestone-edit-section">
                        <h3>✏️ Edit Fields</h3>
                        
                        <div class="form-group">
                            <label for="edit-owner">👤 Person Responsible:</label>
                            <select id="edit-owner">
                                <option value="">-- Select person --</option>
                                <optgroup label="Leadership">
                                    <option value="Attie Nel">Attie Nel (CEO & Project Manager)</option>
                                    <option value="Nastasha Jackson">Nastasha Jackson (Finance Manager)</option>
                                    <option value="Karin Weideman">Karin Weideman (Operational Manager)</option>
                                    <option value="Berno Paul">Berno Paul (Clinical Lead)</option>
                                </optgroup>
                                <optgroup label="Team Members">
                                    <option value="Lizette Botha">Lizette Botha (Case Manager)</option>
                                    <option value="Bertha Vorster">Bertha Vorster (Admin & Admissions Officer)</option>
                                    <option value="Sne Khonyane">Sne Khonyane (Youth Clinical Lead)</option>
                                    <option value="Ilse Booysen">Ilse Booysen (After Care Coordinator)</option>
                                    <option value="Suzanne Gelderblom">Suzanne Gelderblom (Senior Therapist)</option>
                                </optgroup>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-due-date">📅 Due Date:</label>
                            <input type="date" id="edit-due-date">
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-status">📊 Status:</label>
                            <select id="edit-status">
                                <option value="planned">Planned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="complete">Complete</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-priority">⚠️ Priority:</label>
                            <select id="edit-priority">
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-notes">📝 Internal Notes:</label>
                            <textarea id="edit-notes" rows="3" placeholder="Add internal notes about changes, blockers, or updates..."></textarea>
                        </div>
                    </div>
                    
                    <div class="edit-milestone-actions">
                        <button class="btn-secondary" onclick="closeEditMilestoneModal()">Cancel</button>
                        <button class="btn-primary" onclick="saveMilestoneEdits()">💾 Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'edit-milestone-modal') {
            closeEditMilestoneModal();
        }
    });
};

// Get all milestones from all projects
function getAllMilestones() {
    const milestones = [];

    // Diversification milestones
    if (typeof projectData !== 'undefined') {
        projectData.phases.forEach(phase => {
            phase.milestones.forEach(m => {
                milestones.push({
                    ...m,
                    project: 'Diversification',
                    id: m.id,
                    title: m.title,
                    owner: m.owner,
                    due: m.due,
                    status: m.status,
                    priority: m.priority || 'medium'
                });
            });
        });
    }

    // Turnaround milestones
    if (typeof turnaroundData !== 'undefined') {
        turnaroundData.phases.forEach(phase => {
            phase.milestones.forEach(m => {
                milestones.push({
                    ...m,
                    project: 'Turnaround',
                    id: m.id,
                    title: m.name || m.title,
                    owner: m.owner,
                    due: m.dueDate || m.due,
                    status: m.status,
                    priority: m.priority || 'critical'
                });
            });
        });
    }

    // Wellness milestones
    if (typeof wellnessData !== 'undefined') {
        wellnessData.phases.forEach(phase => {
            phase.milestones.forEach(m => {
                milestones.push({
                    ...m,
                    project: 'Wellness',
                    id: m.id,
                    title: m.name || m.title,
                    owner: m.owner,
                    due: m.dueDate || m.due,
                    status: m.status,
                    priority: m.priority || 'medium'
                });
            });
        });
    }

    return milestones;
}

// Load selected milestone for editing
window.loadMilestoneForEdit = function () {
    const select = document.getElementById('select-milestone');
    const milestoneId = select.value;

    if (!milestoneId) {
        document.getElementById('edit-milestone-form').style.display = 'none';
        return;
    }

    const project = select.options[select.selectedIndex].dataset.project;
    const milestone = findMilestone(milestoneId, project);

    if (!milestone) {
        alert('Milestone not found');
        return;
    }

    // Show form
    document.getElementById('edit-milestone-form').style.display = 'block';

    // Display current details
    document.getElementById('current-milestone-details').innerHTML = `
        <div class="detail-item"><strong>ID:</strong> ${milestone.id}</div>
        <div class="detail-item"><strong>Title:</strong> ${milestone.title}</div>
        <div class="detail-item"><strong>Project:</strong> ${project}</div>
        <div class="detail-item"><strong>Current Owner:</strong> ${milestone.owner}</div>
        <div class="detail-item"><strong>Current Due Date:</strong> ${formatDate(milestone.due)}</div>
        <div class="detail-item"><strong>Current Status:</strong> ${milestone.status}</div>
        <div class="detail-item"><strong>Current Priority:</strong> ${milestone.priority || 'medium'}</div>
    `;

    // Populate form fields
    document.getElementById('edit-owner').value = milestone.owner;
    document.getElementById('edit-due-date').value = convertToInputDate(milestone.due);
    document.getElementById('edit-status').value = milestone.status;
    document.getElementById('edit-priority').value = milestone.priority || 'medium';
    document.getElementById('edit-notes').value = '';
};

// Find milestone in data
function findMilestone(milestoneId, project) {
    let milestone = null;

    if (project === 'Diversification' && typeof projectData !== 'undefined') {
        projectData.phases.forEach(phase => {
            const found = phase.milestones.find(m => m.id === milestoneId);
            if (found) milestone = { ...found, due: found.due };
        });
    } else if (project === 'Turnaround' && typeof turnaroundData !== 'undefined') {
        turnaroundData.phases.forEach(phase => {
            const found = phase.milestones.find(m => m.id === milestoneId);
            if (found) milestone = { ...found, title: found.name || found.title, due: found.dueDate || found.due };
        });
    } else if (project === 'Wellness' && typeof wellnessData !== 'undefined') {
        wellnessData.phases.forEach(phase => {
            const found = phase.milestones.find(m => m.id === milestoneId);
            if (found) milestone = { ...found, title: found.name || found.title, due: found.dueDate || found.due };
        });
    }

    return milestone;
}

// Save milestone edits
window.saveMilestoneEdits = async function () {
    const select = document.getElementById('select-milestone');
    const milestoneId = select.value;
    const project = select.options[select.selectedIndex].dataset.project;

    if (!milestoneId) {
        alert('Please select a milestone');
        return;
    }

    const newOwner = document.getElementById('edit-owner').value;
    const newDueDate = document.getElementById('edit-due-date').value;
    const newStatus = document.getElementById('edit-status').value;
    const newPriority = document.getElementById('edit-priority').value;
    const notes = document.getElementById('edit-notes').value;

    if (!newOwner || !newDueDate) {
        alert('Please fill in all required fields (Person Responsible and Due Date)');
        return;
    }

    // Update milestone in appropriate data structure
    let updated = false;
    let oldStatus = '';

    if (project === 'Diversification' && typeof projectData !== 'undefined') {
        projectData.phases.forEach(phase => {
            const milestone = phase.milestones.find(m => m.id === milestoneId);
            if (milestone) {
                oldStatus = milestone.status;
                milestone.owner = newOwner;
                milestone.due = newDueDate;
                milestone.dueDate = newDueDate;
                milestone.status = newStatus;
                milestone.priority = newPriority;
                updated = true;
                refreshPhaseTimeline(phase, 'due');
            }
        });
        if (updated) {
            refreshProjectTimeline(projectData);
            broadcastProjectDataUpdate('stabilis-project-data', projectData);
        }
    } else if (project === 'Turnaround' && typeof turnaroundData !== 'undefined') {
        turnaroundData.phases.forEach(phase => {
            const milestone = phase.milestones.find(m => m.id === milestoneId);
            if (milestone) {
                oldStatus = milestone.status;
                milestone.owner = newOwner;
                milestone.dueDate = newDueDate;
                milestone.status = newStatus;
                milestone.priority = newPriority;
                updated = true;
                refreshPhaseTimeline(phase, 'dueDate');
            }
        });
        if (updated) {
            refreshProjectTimeline(turnaroundData);
            broadcastProjectDataUpdate('stabilis-turnaround-data', turnaroundData);
        }
    } else if (project === 'Wellness' && typeof wellnessData !== 'undefined') {
        wellnessData.phases.forEach(phase => {
            const milestone = phase.milestones.find(m => m.id === milestoneId);
            if (milestone) {
                oldStatus = milestone.status;
                milestone.owner = newOwner;
                milestone.dueDate = newDueDate;
                milestone.status = newStatus;
                milestone.priority = newPriority;
                updated = true;
                refreshPhaseTimeline(phase, 'dueDate');
            }
        });
        if (updated) {
            refreshProjectTimeline(wellnessData);
            broadcastProjectDataUpdate('stabilis-wellness-data', wellnessData);
        }
    }

    // Save edit log
    if (updated) {
        saveEditLog(milestoneId, project, {
            owner: newOwner,
            dueDate: newDueDate,
            status: newStatus,
            priority: newPriority,
            notes: notes
        });

        // SYNC TO DATABASE
        try {
            const currentUser = JSON.parse(localStorage.getItem('stabilis-current-user') || '{}');
            const changedBy = currentUser.name || 'Unknown User';

            // We map 'complete' (frontend) to 'completed' (db schema) if necessary, 
            // but the schema allows both or we should be consistent. 
            // The schema says: CHECK (status IN ('planned', 'in_progress', 'completed', 'blocked'))
            // The frontend uses: 'complete' in the select box.
            // We must normalize this.
            let dbStatus = newStatus;
            if (newStatus === 'complete') dbStatus = 'completed';

            // Update Status
            await updateMilestoneInDatabase(milestoneId, 'status', dbStatus, changedBy, oldStatus);

            // Update Owner
            await updateMilestoneInDatabase(milestoneId, 'owner', newOwner, changedBy);

            // Update Due Date
            await updateMilestoneInDatabase(milestoneId, 'due_date', newDueDate, changedBy);

            // Note: Priority is not in the DB schema yet, so we skip it to avoid errors.

        } catch (dbError) {
            console.error('Database sync failed:', dbError);
            // We don't block the success message because local save worked
        }

        alert('✅ Milestone updated successfully!\n\nChanges have been saved and will appear on all project dashboards.');
        closeEditMilestoneModal();
    } else {
        alert('❌ Error: Could not update milestone');
    }
};

// Helper to update database
async function updateMilestoneInDatabase(id, field, value, user, oldValue = '') {
    try {
        const response = await fetch('/api/milestones/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                milestone_id: id,
                field: field,
                new_value: value,
                old_value: oldValue,
                changed_by: user
            })
        });
        if (!response.ok) {
            const err = await response.json();
            console.warn(`Failed to update ${field} for ${id}:`, err);
        }
    } catch (e) {
        console.warn(`Network error updating ${field}:`, e);
    }
}

// Save edit log
function saveEditLog(milestoneId, project, changes) {
    const logs = JSON.parse(localStorage.getItem('stabilis-edit-logs') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('stabilis-current-user') || '{}');

    logs.push({
        milestoneId: milestoneId,
        project: project,
        changes: changes,
        editedBy: currentUser.name,
        editedAt: new Date().toISOString()
    });

    localStorage.setItem('stabilis-edit-logs', JSON.stringify(logs));
}

// Close edit modal
window.closeEditMilestoneModal = function () {
    const modal = document.getElementById('edit-milestone-modal');
    if (modal) {
        modal.remove();
    }
};

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function convertToInputDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function normalizeDateForStorage(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString().split('T')[0];
}

function refreshPhaseTimeline(phase, dateField = 'due') {
    if (!phase || !Array.isArray(phase.milestones)) return;
    const timestamps = phase.milestones
        .map(m => new Date(m[dateField] || m.due || m.dueDate))
        .filter(date => !Number.isNaN(date.getTime()));
    if (!timestamps.length) return;
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));
    const normalizedStart = normalizeDateForStorage(minDate);
    const normalizedEnd = normalizeDateForStorage(maxDate);
    if (normalizedStart) phase.startDate = normalizedStart;
    if (normalizedEnd) phase.endDate = normalizedEnd;
}

function refreshProjectTimeline(project) {
    if (!project || !Array.isArray(project.phases)) return;
    const startDates = project.phases
        .map(p => new Date(p.startDate))
        .filter(date => !Number.isNaN(date.getTime()));
    const endDates = project.phases
        .map(p => new Date(p.endDate))
        .filter(date => !Number.isNaN(date.getTime()));
    if (startDates.length) {
        const min = new Date(Math.min(...startDates));
        const normalized = normalizeDateForStorage(min);
        if (normalized) project.startDate = normalized;
    }
    if (endDates.length) {
        const max = new Date(Math.max(...endDates));
        const normalized = normalizeDateForStorage(max);
        if (normalized) project.endDate = normalized;
    }
}

// Add CSS for edit modal
const editModalStyles = document.createElement('style');
editModalStyles.textContent = `
.edit-milestone-content {
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
}

.milestone-edit-section {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
}

.milestone-edit-section h3 {
    margin: 0 0 1rem 0;
    color: var(--primary);
    font-size: 1rem;
}

.detail-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
}

.detail-item:last-child {
    border-bottom: none;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.form-group select,
.form-group input[type="date"],
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
}

.form-group select:focus,
.form-group input[type="date"]:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
}

.edit-milestone-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e2e8f0;
}

.btn-primary,
.btn-secondary {
    padding: 0.75rem 1.5rem;
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
    background: #e2e8f0;
    color: var(--text-primary);
}

.btn-secondary:hover {
    background: #cbd5e1;
}
`;
document.head.appendChild(editModalStyles);
