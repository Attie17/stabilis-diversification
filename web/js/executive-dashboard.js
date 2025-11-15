// Executive Dashboard - Real-Time Data Aggregation
// Consolidates data from all three projects

// Check if user has executive access
function hasExecutiveAccess() {
    const currentUser = JSON.parse(localStorage.getItem('stabilis-user') || '{}');
    const executiveUsers = ['Developer', 'Attie Nel', 'Nastasha Jacobs'];
    return executiveUsers.includes(currentUser.name);
}

// Initialize dashboard
function initDashboard() {
    // Check access
    if (!hasExecutiveAccess()) {
        window.location.href = 'landing.html';
        return;
    }

    // Load all data
    loadAllData();
    
    // Update timestamp
    updateTimestamp();
    
    // Set up auto-refresh every 30 seconds
    setInterval(() => {
        loadAllData();
        updateTimestamp();
    }, 30000);
}

// Update timestamp
function updateTimestamp() {
    const now = new Date();
    const formatted = now.toLocaleString('en-ZA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('last-updated').textContent = `Last updated: ${formatted}`;
}

// Load and aggregate all project data
function loadAllData() {
    const turnaroundData = typeof window.turnaroundData !== 'undefined' ? window.turnaroundData : null;
    const diversificationData = typeof window.projectData !== 'undefined' ? window.projectData : null;
    const wellnessData = typeof window.wellnessData !== 'undefined' ? window.wellnessData : null;

    // Calculate progress for each project
    const turnaroundProgress = calculateProjectProgress(turnaroundData);
    const diversificationProgress = calculateProjectProgress(diversificationData);
    const wellnessProgress = calculateProjectProgress(wellnessData);

    // Update top stats
    updateTopStats(turnaroundProgress, diversificationProgress, wellnessProgress);

    // Update all sections
    updateCriticalItems(turnaroundData, diversificationData, wellnessData);
    updateRevenueSummary(turnaroundData, diversificationData, wellnessData);
    updateRiskOverview(turnaroundData, diversificationData, wellnessData);
    updateThisWeek(turnaroundData, diversificationData, wellnessData);
    updateTeamCapacity(turnaroundData, diversificationData, wellnessData);
    
    // Update detailed sections
    updateFinancialSection(turnaroundData, diversificationData, wellnessData);
    updateRisksSection(turnaroundData, diversificationData, wellnessData);
    updateTimelineSection(turnaroundData, diversificationData, wellnessData);
    updateTeamSection(turnaroundData, diversificationData, wellnessData);
    updateProjectsSection(turnaroundProgress, diversificationProgress, wellnessProgress);
}

// Calculate project progress
function calculateProjectProgress(projectData) {
    if (!projectData || !projectData.phases) {
        return { complete: 0, total: 0, percentage: 0, critical: 0, overdue: 0, upcoming: 0 };
    }

    let complete = 0;
    let total = 0;
    let critical = 0;
    let overdue = 0;
    let upcoming = 0;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    projectData.phases.forEach(phase => {
        if (phase.milestones) {
            phase.milestones.forEach(m => {
                total++;
                if (m.status === 'complete') complete++;
                
                const dueDate = new Date(m.due || m.dueDate);
                if (dueDate < today && m.status !== 'complete') {
                    overdue++;
                    if (m.priority === 'critical' || m.priority === 'high') critical++;
                }
                
                if (dueDate >= today && dueDate <= nextWeek && m.status !== 'complete') {
                    upcoming++;
                }
            });
        }
    });

    return {
        complete,
        total,
        percentage: total > 0 ? Math.round((complete / total) * 100) : 0,
        critical,
        overdue,
        upcoming
    };
}

// Update top stats cards
function updateTopStats(turnaround, diversification, wellness) {
    // Turnaround
    document.getElementById('turnaround-progress').textContent = `${turnaround.percentage}%`;
    document.getElementById('turnaround-meta').textContent = 
        `${turnaround.complete}/${turnaround.total} milestones | ${turnaround.overdue} overdue`;

    // Diversification
    document.getElementById('diversification-progress').textContent = `${diversification.percentage}%`;
    document.getElementById('diversification-meta').textContent = 
        `${diversification.complete}/${diversification.total} milestones | ${diversification.overdue} overdue`;

    // Wellness
    document.getElementById('wellness-progress').textContent = `${wellness.percentage}%`;
    document.getElementById('wellness-meta').textContent = 
        `${wellness.complete}/${wellness.total} milestones | ${wellness.overdue} overdue`;

    // Overall
    const overallComplete = turnaround.complete + diversification.complete + wellness.complete;
    const overallTotal = turnaround.total + diversification.total + wellness.total;
    const overallPercentage = overallTotal > 0 ? Math.round((overallComplete / overallTotal) * 100) : 0;
    
    document.getElementById('overall-progress').textContent = `${overallPercentage}%`;
    document.getElementById('overall-meta').textContent = 
        `${overallComplete}/${overallTotal} total | ${turnaround.overdue + diversification.overdue + wellness.overdue} overdue`;

    // Show alerts if there are critical items
    const totalCritical = turnaround.critical + diversification.critical + wellness.critical;
    if (totalCritical > 0) {
        showAlertBanner(totalCritical, turnaround.overdue + diversification.overdue + wellness.overdue);
    } else {
        document.getElementById('alerts-banner').style.display = 'none';
    }
}

// Show alert banner
function showAlertBanner(critical, overdue) {
    const banner = document.getElementById('alerts-banner');
    banner.innerHTML = `
        <strong>⚠️ ATTENTION REQUIRED:</strong> 
        ${critical} critical milestone${critical !== 1 ? 's' : ''} at risk | 
        ${overdue} overdue milestone${overdue !== 1 ? 's' : ''} across all projects
    `;
    banner.style.display = 'block';
}

// Update critical items section
function updateCriticalItems(turnaround, diversification, wellness) {
    const criticalItems = [];
    const today = new Date();

    // Collect critical/overdue items from all projects
    const projects = [
        { name: 'Turnaround', data: turnaround, icon: '🚨' },
        { name: 'Diversification', data: diversification, icon: '📈' },
        { name: 'Wellness', data: wellness, icon: '💚' }
    ];

    projects.forEach(project => {
        if (project.data && project.data.phases) {
            project.data.phases.forEach(phase => {
                if (phase.milestones) {
                    phase.milestones.forEach(m => {
                        const dueDate = new Date(m.due || m.dueDate);
                        const isOverdue = dueDate < today && m.status !== 'complete';
                        const isCritical = m.priority === 'critical' || m.priority === 'high';

                        if (isOverdue || isCritical) {
                            criticalItems.push({
                                project: project.name,
                                icon: project.icon,
                                title: m.title,
                                id: m.id,
                                due: dueDate,
                                status: m.status,
                                owner: m.owner,
                                isOverdue,
                                isCritical
                            });
                        }
                    });
                }
            });
        }
    });

    // Sort by due date
    criticalItems.sort((a, b) => a.due - b.due);

    // Display
    const container = document.getElementById('critical-items');
    if (criticalItems.length === 0) {
        container.innerHTML = '<div class="empty-state">✅ No critical items at this time</div>';
        return;
    }

    container.innerHTML = criticalItems.slice(0, 10).map(item => {
        const daysOverdue = item.isOverdue ? 
            Math.floor((today - item.due) / (1000 * 60 * 60 * 24)) : 0;
        
        return `
            <div class="critical-item">
                <div class="critical-item-header">
                    <strong>${item.icon} ${item.project}: ${item.title}</strong>
                    ${item.isOverdue ? 
                        `<span class="critical-badge">OVERDUE ${daysOverdue}d</span>` :
                        `<span class="critical-badge">HIGH PRIORITY</span>`
                    }
                </div>
                <div style="font-size: 0.875rem; color: #94a3b8;">
                    ${item.id} | Due: ${formatDate(item.due)} | Owner: ${item.owner}
                </div>
            </div>
        `;
    }).join('');
}

// Update revenue summary
function updateRevenueSummary(turnaround, diversification, wellness) {
    const container = document.getElementById('revenue-summary');
    
    // Simplified revenue projections
    const revenue = {
        turnaround: 'R0 (Cost reduction focus)',
        diversification: 'R6.8M projected',
        wellness: 'R4.2M projected',
        total: 'R11M+ projected'
    };

    container.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">🚨 Turnaround</span>
            <span class="summary-value">${revenue.turnaround}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">📈 Diversification</span>
            <span class="summary-value positive">${revenue.diversification}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">💚 Wellness Centre</span>
            <span class="summary-value positive">${revenue.wellness}</span>
        </div>
        <div class="summary-row" style="border-top: 2px solid rgba(255,255,255,0.2); padding-top: 1rem; margin-top: 0.5rem;">
            <span class="summary-label"><strong>Total Expected Revenue</strong></span>
            <span class="summary-value positive"><strong>${revenue.total}</strong></span>
        </div>
    `;
}

// Update risk overview
function updateRiskOverview(turnaround, diversification, wellness) {
    const container = document.getElementById('risk-overview');
    
    let totalRisks = 0;
    let criticalRisks = 0;
    let highRisks = 0;

    const projects = [turnaround, diversification, wellness];
    projects.forEach(project => {
        if (project && project.risks) {
            totalRisks += project.risks.length;
            project.risks.forEach(risk => {
                if (risk.severity === 'critical' || risk.severity === 'high') {
                    if (risk.severity === 'critical') criticalRisks++;
                    else highRisks++;
                }
            });
        }
    });

    container.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Total Active Risks</span>
            <span class="summary-value">${totalRisks}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">🔴 Critical Risks</span>
            <span class="summary-value negative">${criticalRisks}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">🟡 High Risks</span>
            <span class="summary-value warning">${highRisks}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Risk Status</span>
            <span class="summary-value ${criticalRisks > 0 ? 'negative' : 'positive'}">
                ${criticalRisks > 0 ? 'Needs Attention' : 'Under Control'}
            </span>
        </div>
    `;
}

// Update this week's milestones
function updateThisWeek(turnaround, diversification, wellness) {
    const container = document.getElementById('this-week');
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thisWeekMilestones = [];

    const projects = [
        { name: 'Turnaround', data: turnaround, icon: '🚨' },
        { name: 'Diversification', data: diversification, icon: '📈' },
        { name: 'Wellness', data: wellness, icon: '💚' }
    ];

    projects.forEach(project => {
        if (project.data && project.data.phases) {
            project.data.phases.forEach(phase => {
                if (phase.milestones) {
                    phase.milestones.forEach(m => {
                        const dueDate = new Date(m.due || m.dueDate);
                        if (dueDate >= today && dueDate <= nextWeek && m.status !== 'complete') {
                            thisWeekMilestones.push({
                                project: project.name,
                                icon: project.icon,
                                title: m.title,
                                due: dueDate,
                                owner: m.owner
                            });
                        }
                    });
                }
            });
        }
    });

    thisWeekMilestones.sort((a, b) => a.due - b.due);

    if (thisWeekMilestones.length === 0) {
        container.innerHTML = '<div class="empty-state">📅 No milestones due this week</div>';
        return;
    }

    container.innerHTML = thisWeekMilestones.slice(0, 8).map(m => `
        <div class="milestone-item">
            <div class="milestone-title">${m.icon} ${m.title}</div>
            <div class="milestone-meta">${m.project} | Due: ${formatDate(m.due)} | ${m.owner}</div>
        </div>
    `).join('');
}

// Update team capacity
function updateTeamCapacity(turnaround, diversification, wellness) {
    const container = document.getElementById('team-capacity');
    
    // Count team member assignments
    const teamLoad = {};
    const projects = [turnaround, diversification, wellness];
    
    projects.forEach(project => {
        if (project && project.phases) {
            project.phases.forEach(phase => {
                if (phase.milestones) {
                    phase.milestones.forEach(m => {
                        if (m.owner && m.status !== 'complete') {
                            teamLoad[m.owner] = (teamLoad[m.owner] || 0) + 1;
                        }
                    });
                }
            });
        }
    });

    const sorted = Object.entries(teamLoad).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state">👥 No active assignments</div>';
        return;
    }

    container.innerHTML = sorted.slice(0, 8).map(([name, count]) => `
        <div class="summary-row">
            <span class="summary-label">${name}</span>
            <span class="summary-value ${count > 5 ? 'warning' : ''}">${count} active</span>
        </div>
    `).join('');
}

// Section switching
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`section-${sectionName}`).classList.add('active');
    
    // Highlight active nav button
    event.target.classList.add('active');
}

window.showSection = showSection;

// Update financial section
function updateFinancialSection(turnaround, diversification, wellness) {
    document.getElementById('financial-overview').innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Total Projected Revenue (18mo)</span>
            <span class="summary-value positive">R11.0M+</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Investment Required</span>
            <span class="summary-value">R5.3M</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Expected Net Impact</span>
            <span class="summary-value positive">R5.7M+</span>
        </div>
    `;

    document.getElementById('revenue-breakdown').innerHTML = `
        <div class="summary-row">
            <span class="summary-label">🚨 Turnaround (Cost Savings)</span>
            <span class="summary-value positive">R500K+</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">📈 Diversification</span>
            <span class="summary-value positive">R6.8M</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">💚 Wellness Centre</span>
            <span class="summary-value positive">R4.2M</span>
        </div>
    `;

    document.getElementById('budget-actual').innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Budgeted</span>
            <span class="summary-value">R5.3M</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Actual (YTD)</span>
            <span class="summary-value">R0 (Planning Phase)</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Variance</span>
            <span class="summary-value positive">On Track</span>
        </div>
    `;
}

// Update risks section
function updateRisksSection(turnaround, diversification, wellness) {
    const container = document.getElementById('all-risks');
    const allRisks = [];

    const projects = [
        { name: 'Turnaround', data: turnaround, icon: '🚨' },
        { name: 'Diversification', data: diversification, icon: '📈' },
        { name: 'Wellness', data: wellness, icon: '💚' }
    ];

    projects.forEach(project => {
        if (project.data && project.data.risks) {
            project.data.risks.forEach(risk => {
                allRisks.push({
                    project: project.name,
                    icon: project.icon,
                    ...risk
                });
            });
        }
    });

    // Sort by severity
    const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    allRisks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    if (allRisks.length === 0) {
        container.innerHTML = '<div class="empty-state">✅ No risks identified</div>';
        return;
    }

    container.innerHTML = allRisks.map(risk => `
        <div class="risk-item ${risk.severity}">
            <strong>${risk.icon} ${risk.project}: ${risk.title || risk.description}</strong>
            <div style="font-size: 0.875rem; color: #94a3b8; margin-top: 0.5rem;">
                Severity: ${risk.severity} | Mitigation: ${risk.mitigation || risk.status || 'In progress'}
            </div>
        </div>
    `).join('');
}

// Update timeline section
function updateTimelineSection(turnaround, diversification, wellness) {
    const container = document.getElementById('master-timeline');
    const allMilestones = [];

    const projects = [
        { name: 'Turnaround', data: turnaround, icon: '🚨', color: '#ef4444' },
        { name: 'Diversification', data: diversification, icon: '📈', color: '#3b82f6' },
        { name: 'Wellness', data: wellness, icon: '💚', color: '#10b981' }
    ];

    projects.forEach(project => {
        if (project.data && project.data.phases) {
            project.data.phases.forEach(phase => {
                if (phase.milestones) {
                    phase.milestones.forEach(m => {
                        allMilestones.push({
                            project: project.name,
                            icon: project.icon,
                            color: project.color,
                            title: m.title,
                            due: new Date(m.due || m.dueDate),
                            status: m.status
                        });
                    });
                }
            });
        }
    });

    allMilestones.sort((a, b) => a.due - b.due);

    if (allMilestones.length === 0) {
        container.innerHTML = '<div class="empty-state">📅 No milestones found</div>';
        return;
    }

    container.innerHTML = allMilestones.map(m => `
        <div class="milestone-item" style="border-left: 3px solid ${m.color};">
            <div class="milestone-title">${m.icon} ${m.title}</div>
            <div class="milestone-meta">
                ${m.project} | ${formatDate(m.due)} | 
                <span style="color: ${m.status === 'complete' ? '#10b981' : '#94a3b8'};">
                    ${m.status === 'complete' ? '✓ Complete' : 'In Progress'}
                </span>
            </div>
        </div>
    `).join('');
}

// Update team section
function updateTeamSection(turnaround, diversification, wellness) {
    const container = document.getElementById('team-allocation');
    const teamAssignments = {};

    const projects = [turnaround, diversification, wellness];
    const projectNames = ['Turnaround', 'Diversification', 'Wellness'];

    projects.forEach((project, idx) => {
        if (project && project.phases) {
            project.phases.forEach(phase => {
                if (phase.milestones) {
                    phase.milestones.forEach(m => {
                        if (m.owner && m.status !== 'complete') {
                            if (!teamAssignments[m.owner]) {
                                teamAssignments[m.owner] = { turnaround: 0, diversification: 0, wellness: 0 };
                            }
                            const projectKey = projectNames[idx].toLowerCase();
                            teamAssignments[m.owner][projectKey]++;
                        }
                    });
                }
            });
        }
    });

    const sorted = Object.entries(teamAssignments).sort((a, b) => {
        const totalA = a[1].turnaround + a[1].diversification + a[1].wellness;
        const totalB = b[1].turnaround + b[1].diversification + b[1].wellness;
        return totalB - totalA;
    });

    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state">👥 No team assignments</div>';
        return;
    }

    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; color: white;">
            <thead>
                <tr style="border-bottom: 2px solid rgba(255,255,255,0.2);">
                    <th style="text-align: left; padding: 0.75rem;">Team Member</th>
                    <th style="text-align: center; padding: 0.75rem;">🚨 Turnaround</th>
                    <th style="text-align: center; padding: 0.75rem;">📈 Diversification</th>
                    <th style="text-align: center; padding: 0.75rem;">💚 Wellness</th>
                    <th style="text-align: center; padding: 0.75rem;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${sorted.map(([name, counts]) => {
                    const total = counts.turnaround + counts.diversification + counts.wellness;
                    return `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <td style="padding: 0.75rem;">${name}</td>
                            <td style="text-align: center; padding: 0.75rem;">${counts.turnaround}</td>
                            <td style="text-align: center; padding: 0.75rem;">${counts.diversification}</td>
                            <td style="text-align: center; padding: 0.75rem;">${counts.wellness}</td>
                            <td style="text-align: center; padding: 0.75rem; font-weight: 600;">
                                <span style="color: ${total > 5 ? '#f59e0b' : '#10b981'};">${total}</span>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Update projects section
function updateProjectsSection(turnaround, diversification, wellness) {
    document.getElementById('turnaround-detail').innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${turnaround.percentage}%; background: linear-gradient(90deg, #ef4444, #dc2626);"></div>
        </div>
        <div class="summary-row">
            <span class="summary-label">Progress</span>
            <span class="summary-value">${turnaround.percentage}%</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Milestones</span>
            <span class="summary-value">${turnaround.complete}/${turnaround.total}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Overdue</span>
            <span class="summary-value ${turnaround.overdue > 0 ? 'negative' : ''}">${turnaround.overdue}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">This Week</span>
            <span class="summary-value">${turnaround.upcoming}</span>
        </div>
    `;

    document.getElementById('diversification-detail').innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${diversification.percentage}%;"></div>
        </div>
        <div class="summary-row">
            <span class="summary-label">Progress</span>
            <span class="summary-value">${diversification.percentage}%</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Milestones</span>
            <span class="summary-value">${diversification.complete}/${diversification.total}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Overdue</span>
            <span class="summary-value ${diversification.overdue > 0 ? 'negative' : ''}">${diversification.overdue}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">This Week</span>
            <span class="summary-value">${diversification.upcoming}</span>
        </div>
    `;

    document.getElementById('wellness-detail').innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${wellness.percentage}%; background: linear-gradient(90deg, #10b981, #059669);"></div>
        </div>
        <div class="summary-row">
            <span class="summary-label">Progress</span>
            <span class="summary-value">${wellness.percentage}%</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Milestones</span>
            <span class="summary-value">${wellness.complete}/${wellness.total}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Overdue</span>
            <span class="summary-value ${wellness.overdue > 0 ? 'negative' : ''}">${wellness.overdue}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">This Week</span>
            <span class="summary-value">${wellness.upcoming}</span>
        </div>
    `;
}

// Refresh dashboard
function refreshDashboard() {
    loadAllData();
    updateTimestamp();
}

window.refreshDashboard = refreshDashboard;

// Helper function to format dates
function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setTimeout(initDashboard, 500); // Wait for auth to complete
});
