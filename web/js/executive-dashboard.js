// Executive Dashboard - Real-Time Data Aggregation
// Consolidates data from all three projects

const REPORT_DEFINITIONS = [
    { key: 'revenue-projection', title: 'Revenue Projection', description: '18-month diversification + wellness revenue outlook.', icon: '💹', path: '/reports/revenue-projection.html' },
    { key: 'cost-analysis', title: 'Cost Analysis', description: 'Operating cost layers compared to recovery levers.', icon: '💸', path: '/reports/cost-analysis.html' },
    { key: 'phase-progress', title: 'Phase Progress', description: 'Milestone completion heatmap by roadmap.', icon: '🧭', path: '/reports/phase-progress.html' },
    { key: 'risk-assessment', title: 'Risk Assessment', description: 'Consolidated risk log with mitigations.', icon: '⚠️', path: '/reports/risk-assessment.html' },
    { key: 'resource-utilization', title: 'Resource Utilization', description: 'Capacity allocation across squads.', icon: '🧑‍🤝‍🧑', path: '/reports/resource-utilization.html' },
    { key: 'kpi-dashboard-report', title: 'KPI Dashboard', description: 'Executive KPIs with trajectory deltas.', icon: '📊', path: '/reports/kpi-dashboard.html' },
    { key: 'timeline-analysis', title: 'Timeline Analysis', description: 'Cross-project schedule performance.', icon: '⏱️', path: '/reports/timeline-analysis.html' },
    { key: 'budget-actual', title: 'Budget vs Actual', description: 'Variance tracker and burn-rate outlook.', icon: '🧾', path: '/reports/budget-actual.html' },
    { key: 'cashflow-projection', title: 'Cashflow Projection', description: 'Liquidity and runway forecast.', icon: '💵', path: '/reports/cashflow-projection.html' }
];

let reportsOverlayListenersBound = false;

// Check if user has executive access
function hasExecutiveAccess() {
    const currentUser = JSON.parse(localStorage.getItem('stabilis-user') || '{}');
    const executiveUsers = window.EXECUTIVE_USERS || ['Developer', 'Attie Nel', 'Nastasha Jacobs', 'Lydia Gittens', 'Berno Paul'];
    return executiveUsers.includes(currentUser.name);
}

function getAuthUser() {
    try {
        return window.currentUser || JSON.parse(localStorage.getItem('stabilis-user') || 'null');
    } catch (error) {
        console.warn('Unable to read user session', error);
        return null;
    }
}

function isSteeringUser(user = getAuthUser()) {
    if (!user) return false;
    const steering = window.STEERING_COMMITTEE || ['Attie Nel', 'Nastasha Jacobs', 'Lydia Gittens', 'Berno Paul'];
    return steering.includes(user.name) || user.name === 'Developer';
}

function ensureSteeringReportAccess(actionLabel = 'this report') {
    const user = getAuthUser();
    if (!user) {
        alert('Please sign in with a steering account to use the report suite.');
        return false;
    }
    if (!isSteeringUser(user)) {
        alert(`${actionLabel} is limited to the Steering Committee.`);
        return false;
    }
    return true;
}

function getReportMeta(reportKey) {
    return REPORT_DEFINITIONS.find(report => report.key === reportKey);
}

function openReportWindow(reportKey, action) {
    const meta = getReportMeta(reportKey);
    if (!meta) return;
    let url = meta.path;
    if (action) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}action=${action}`;
    }
    const win = window.open(url, '_blank');
    if (win) {
        win.opener = null;
    }
}

function handleReportCardAction(event) {
    const target = event.target.closest('[data-report-action]');
    if (!target) return;
    const action = target.getAttribute('data-report-action');
    const key = target.getAttribute('data-report');
    if (!ensureSteeringReportAccess(`${action || 'open'} report`)) {
        return;
    }
    if (action === 'open') {
        openReportWindow(key);
        return;
    }
    if (['export', 'print', 'edit'].includes(action)) {
        openReportWindow(key, action);
    }
}

function buildReportCardsMarkup() {
    return REPORT_DEFINITIONS.map(report => `
        <div class="report-card">
            <div class="report-card-header">
                <h3>${report.icon} ${report.title}</h3>
                <span class="report-access-badge">Steering Only</span>
            </div>
            <p>${report.description}</p>
            <div class="report-card-actions">
                <button data-report="${report.key}" data-report-action="open">Open</button>
                <button data-report="${report.key}" data-report-action="export">Export (.xlsx)</button>
                <button data-report="${report.key}" data-report-action="print">Print</button>
                <button data-report="${report.key}" data-report-action="edit">Edit</button>
            </div>
        </div>
    `).join('');
}

function renderReportsMenu() {
    const markup = buildReportCardsMarkup();
    const grid = document.getElementById('reports-grid');
    if (grid) grid.innerHTML = markup;
    const menuList = document.getElementById('reports-menu-list');
    if (menuList) menuList.innerHTML = markup;
}

function initReportsMenu() {
    renderReportsMenu();
    const containers = [
        document.getElementById('reports-grid'),
        document.getElementById('reports-menu-list')
    ].filter(Boolean);

    containers.forEach(container => {
        if (!container.dataset.reportsBound) {
            container.addEventListener('click', handleReportCardAction);
            container.dataset.reportsBound = 'true';
        }
    });

    setupReportsMenuOverlay();
}

function showReportsGuide() {
    alert('Open launches the full report, Export downloads an Excel version, Print sends it to your printer dialog, and Edit opens the inline editing controls inside the report.');
}

window.showReportsGuide = showReportsGuide;

function setupReportsMenuOverlay() {
    if (reportsOverlayListenersBound) return;
    const overlay = document.getElementById('reports-menu-overlay');
    if (!overlay) return;
    overlay.addEventListener('click', event => {
        if (event.target.id === 'reports-menu-overlay') {
            closeReportsMenu();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isReportsMenuOpen()) {
            closeReportsMenu();
        }
    });
    reportsOverlayListenersBound = true;
}

function isReportsMenuOpen() {
    const overlay = document.getElementById('reports-menu-overlay');
    return overlay?.classList.contains('active');
}

function openReportsMenu() {
    if (!ensureSteeringReportAccess('open the Reports & Analytics menu')) {
        return;
    }
    const overlay = document.getElementById('reports-menu-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reports-menu-open');

    const firstAction = overlay.querySelector('.report-card-actions button');
    if (firstAction) {
        setTimeout(() => firstAction.focus(), 0);
    }
}

function closeReportsMenu() {
    const overlay = document.getElementById('reports-menu-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reports-menu-open');
}

window.openReportsMenu = openReportsMenu;
window.closeReportsMenu = closeReportsMenu;

function cloneProjectData(data) {
    return data ? JSON.parse(JSON.stringify(data)) : null;
}

function mergeSavedMilestones(base, saved) {
    if (!base || !saved || !Array.isArray(saved.phases)) return base;
    base.phases?.forEach(phase => {
        const savedPhase = saved.phases.find(sp => sp.id === phase.id);
        if (!savedPhase || !Array.isArray(savedPhase.milestones)) return;
        phase.milestones?.forEach(milestone => {
            const savedMilestone = savedPhase.milestones.find(sm => sm.id === milestone.id);
            if (savedMilestone) {
                Object.assign(milestone, savedMilestone);
            }
        });
    });
    return base;
}

function getLatestProjectData(baseData, storageKey) {
    const clone = cloneProjectData(baseData);
    if (!clone) return null;
    try {
        const savedRaw = localStorage.getItem(storageKey);
        if (!savedRaw) return clone;
        const saved = JSON.parse(savedRaw);
        return mergeSavedMilestones(clone, saved);
    } catch (error) {
        console.warn(`Failed to hydrate project data for ${storageKey}`, error);
        return clone;
    }
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
    const turnaroundData = typeof window.turnaroundData !== 'undefined'
        ? getLatestProjectData(window.turnaroundData, 'stabilis-turnaround-data')
        : null;
    const diversificationData = typeof window.projectData !== 'undefined'
        ? getLatestProjectData(window.projectData, 'stabilis-project-data')
        : null;
    const wellnessData = typeof window.wellnessData !== 'undefined'
        ? getLatestProjectData(window.wellnessData, 'stabilis-wellness-data')
        : null;

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
                            const milestoneTitle = m.title || m.name || 'Milestone';
                            criticalItems.push({
                                project: project.name,
                                icon: project.icon,
                                title: milestoneTitle,
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
                        const milestoneTitle = m.title || m.name || 'Milestone';
                        if (dueDate >= today && dueDate <= nextWeek && m.status !== 'complete') {
                            thisWeekMilestones.push({
                                project: project.name,
                                icon: project.icon,
                                title: milestoneTitle,
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
    const today = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const attentionWindow = new Date(today.getTime() + 14 * dayMs);

    const projects = [
        { name: 'Turnaround', data: turnaround, icon: '🚨' },
        { name: 'Diversification', data: diversification, icon: '📈' },
        { name: 'Wellness', data: wellness, icon: '💚' }
    ];

    projects.forEach(project => {
        if (project.data && project.data.risks) {
            project.data.risks.forEach(risk => {
                const attentionFallbackDays = risk.severity === 'critical' ? 7 : (risk.severity === 'high' ? 14 : 21);
                const reviewDate = risk.reviewBy || risk.reviewDue || risk.targetDate;
                const attentionDue = reviewDate ? new Date(reviewDate) : new Date(today.getTime() + attentionFallbackDays * dayMs);

                allRisks.push({
                    project: project.name,
                    icon: project.icon,
                    attentionDue,
                    ...risk
                });
            });
        }
    });

    if (allRisks.length === 0) {
        container.innerHTML = '<div class="empty-state">✅ No risks identified</div>';
        return;
    }

    // Sort by severity for display consistency
    const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    allRisks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const attentionRisks = allRisks.filter(risk =>
        (risk.severity === 'critical' || risk.severity === 'high') && risk.attentionDue <= attentionWindow
    );

    const attentionHtml = attentionRisks.length > 0
        ? attentionRisks.map(risk => `
            <div class="risk-item ${risk.severity}">
                <strong>${risk.icon} ${risk.project}: ${risk.title || risk.name || risk.description}</strong>
                <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.4rem;">
                    Owner: ${risk.owner || 'Unassigned'} | Action by ${formatDate(risk.attentionDue)}
                </div>
                <div style="font-size: 0.8rem; color: #cbd5f5; margin-top: 0.2rem;">
                    ${risk.mitigation || risk.status || 'Mitigation in progress'}
                </div>
            </div>
        `).join('')
        : '<div class="empty-state">👍 No high-severity risks expected in the next two weeks</div>';

    const registerHtml = allRisks.map(risk => `
        <div class="risk-item ${risk.severity}">
            <strong>${risk.icon} ${risk.project}: ${risk.title || risk.name || risk.description}</strong>
            <div style="font-size: 0.875rem; color: #94a3b8; margin-top: 0.5rem;">
                Severity: ${risk.severity} | Owner: ${risk.owner || 'Unassigned'} | Status: ${risk.status || 'active'}
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem;">Next 14 Days</h3>
            ${attentionHtml}
        </div>
        <div>
            <h3 style="margin-bottom: 0.5rem;">Full Risk Register</h3>
            ${registerHtml}
        </div>
    `;
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
                        const milestoneTitle = m.title || m.name || 'Milestone';
                        allMilestones.push({
                            project: project.name,
                            icon: project.icon,
                            color: project.color,
                            title: milestoneTitle,
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
    initReportsMenu();
    setTimeout(initDashboard, 500); // Wait for auth to complete
});

function handleProjectDataChange(event) {
    const keys = ['stabilis-project-data', 'stabilis-turnaround-data', 'stabilis-wellness-data'];
    const key = event.detail?.key || event.key;
    if (keys.includes(key)) {
        refreshDashboard();
    }
}

window.addEventListener('storage', handleProjectDataChange);
window.addEventListener('project-data-updated', handleProjectDataChange);
