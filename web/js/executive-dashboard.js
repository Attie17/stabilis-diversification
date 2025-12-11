// Executive Dashboard - Real-Time Data Aggregation
// Consolidates data from all three projects

const REPORT_DEFINITIONS = [
    { key: 'revenue-projection', title: 'Revenue Projection', description: '18-month diversification + wellness revenue outlook.', icon: '💹', path: 'reports/revenue-projection.html' },
    { key: 'cost-analysis', title: 'Cost Analysis', description: 'Operating cost layers compared to recovery levers.', icon: '💸', path: 'reports/cost-analysis.html' },
    { key: 'phase-progress', title: 'Phase Progress', description: 'Milestone completion heatmap by roadmap.', icon: '🧭', path: 'reports/phase-progress.html' },
    { key: 'risk-assessment', title: 'Risk Assessment', description: 'Consolidated risk log with mitigations.', icon: '⚠️', path: 'reports/risk-assessment.html' },
    { key: 'resource-utilization', title: 'Resource Utilization', description: 'Capacity allocation across squads.', icon: '🧑‍🤝‍🧑', path: 'reports/resource-utilization.html' },
    { key: 'kpi-dashboard-report', title: 'KPI Dashboard', description: 'Executive KPIs with trajectory deltas.', icon: '📊', path: 'reports/kpi-dashboard.html' },
    { key: 'timeline-analysis', title: 'Timeline Analysis', description: 'Cross-project schedule performance.', icon: '⏱️', path: 'reports/timeline-analysis.html' },
    { key: 'budget-actual', title: 'Budget vs Actual', description: 'Variance tracker and burn-rate outlook.', icon: '🧾', path: 'reports/budget-actual.html' },
    { key: 'cashflow-projection', title: 'Cashflow Projection', description: 'Liquidity and runway forecast.', icon: '💵', path: 'reports/cashflow-projection.html' },
    { key: 'budget-q1-2026', title: 'Budget Q1 2026', description: 'Dec 2025 - Mar 2026 crisis turnaround & launch budget.', icon: '📊', path: 'reports/budget-q1-2026.html' },
    { key: 'budget-fy-2026-27', title: 'Budget FY 2026-27', description: 'Apr 2026 - Mar 2027 full-year growth budget.', icon: '📊', path: 'reports/budget-fy-2026-27.html' }
];

let reportsOverlayListenersBound = false;
let dashboardRefreshInterval = null;
let dashboardActive = false;
const ACCESS_OVERLAY_ID = 'executive-access-overlay';
const lastSyncedProjects = {
    turnaround: null,
    diversification: null,
    wellness: null
};

// Check if user has executive access
function hasExecutiveAccess(user = getAuthUser()) {
    if (!user) return false;
    const executiveUsers = window.EXECUTIVE_USERS || ['Developer', 'Attie Nel', 'Nastasha Jackson', 'Nastasha Jacobs', 'Lydia Gittens', 'Berno Paul'];
    if (executiveUsers.includes(user.name)) return true;

    const accessLevel = typeof user.access === 'string' ? user.access.toLowerCase() : '';
    const roleLabel = typeof user.role === 'string' ? user.role.toLowerCase() : '';

    if (accessLevel === 'all') return true;
    if (roleLabel.includes('system administrator')) return true;

    return false;
}

function startDashboardAutoRefresh() {
    if (dashboardActive) return;
    dashboardActive = true;
    refreshDashboard(); // Initial load (fire and forget)
    dashboardRefreshInterval = setInterval(() => {
        refreshDashboard(); // Periodic refresh (fire and forget)
    }, 30000);
}

function stopDashboardAutoRefresh() {
    if (!dashboardActive) return;
    dashboardActive = false;
    if (dashboardRefreshInterval) {
        clearInterval(dashboardRefreshInterval);
        dashboardRefreshInterval = null;
    }
}

function renderAccessRestrictedState(user) {
    let overlay = document.getElementById(ACCESS_OVERLAY_ID);
    const userName = user?.name || 'team member';
    const greetingName = userName.split(' ')[0] || userName;
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = ACCESS_OVERLAY_ID;
        overlay.className = 'executive-access-overlay';
        overlay.innerHTML = `
            <div class="executive-access-panel">
                <div class="access-icon">🔒</div>
                <h2>Steering Access Required</h2>
                <p class="access-message" data-access-message></p>
                <p class="access-help">
                    Executive Command contains the consolidated turnaround, diversification, and wellness portfolio. You still have access to every project dashboard and the AI Executive Assistant below.
                </p>
                <div class="access-actions">
                    <button type="button" class="access-return-btn" data-return-projects>↩ Return to Project Hub</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const returnBtn = overlay.querySelector('[data-return-projects]');
        if (returnBtn) {
            returnBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }
    const messageEl = overlay.querySelector('[data-access-message]');
    if (messageEl) {
        messageEl.textContent = `Hi ${greetingName}, Executive Command is reserved for the CEO and Steering Committee.`;
    }
    overlay.classList.add('active');
}

function removeAccessRestrictedState() {
    const overlay = document.getElementById(ACCESS_OVERLAY_ID);
    if (overlay) {
        overlay.remove();
    }
}

function handleExecutiveAccessState() {
    const user = getAuthUser();
    if (!user) {
        stopDashboardAutoRefresh();
        removeAccessRestrictedState();
        return;
    }
    if (!hasExecutiveAccess(user)) {
        stopDashboardAutoRefresh();
        renderAccessRestrictedState(user);
        return;
    }
    removeAccessRestrictedState();
    startDashboardAutoRefresh();
}

function setupExecutiveDashboardAccessWatcher() {
    handleExecutiveAccessState();
    window.addEventListener('stabilis-user-changed', handleExecutiveAccessState);
}

function getAuthUser() {
    try {
        return window.currentUser || JSON.parse(localStorage.getItem('stabilis-user') || 'null');
    } catch (error) {
        console.warn('Unable to read user session', error);
        return null;
    }
}

function getAIRequestHeaders() {
    const user = getAuthUser();
    if (user?.name) {
        return { 'X-User-Name': user.name };
    }
    return {};
}

function isSteeringUser(user = getAuthUser()) {
    if (!user) return false;
    const steering = window.STEERING_COMMITTEE || ['Attie Nel', 'Nastasha Jackson', 'Nastasha Jacobs', 'Lydia Gittens', 'Berno Paul'];
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
    const [basePath, existingQuery = ''] = meta.path.split('?');
    const params = new URLSearchParams(existingQuery);
    params.set('from', 'executive-dashboard');
    params.set('returnTo', 'executive-dashboard');
    if (action) {
        params.set('action', action);
    } else {
        params.delete('action');
    }
    const finalUrl = `${basePath}?${params.toString()}`;
    const win = window.open(finalUrl, '_blank');
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

function showWorkbookSyncInstructions() {
    alert(
        'After you edit and save the workbook in OneDrive, do this to update the live app:\n\n' +
        '1) Download/export the updated workbook from OneDrive and save it over the existing file in the repo:\n' +
        '   data/stabilis-data.xlsx (same filename and location).\n\n' +
        '2) On the server, run:\n' +
        '   npm run sync-budget\n\n' +
        'Only then will Supabase and the Executive Dashboard reports reflect the new numbers.'
    );
}

window.showWorkbookSyncInstructions = showWorkbookSyncInstructions;

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

// Merge database milestones into project data structure
// CRITICAL: This function reads from individual localStorage keys (turn-status-*, div-status-*, wellness-status-*)
// to preserve user's checked milestone statuses when database doesn't have the milestone yet.
// The Executive Dashboard is READ-ONLY for these keys - never writes to them.
function mergeDatabaseMilestones(baseData, dbMilestones, localStorageKey) {
    if (!baseData) return baseData;

    const clone = cloneProjectData(baseData);
    if (!clone || !clone.phases) return baseData;

    // Load localStorage as fallback for milestones not in DB
    let localData = null;
    let isWellnessIndividualKeys = false;
    
    try {
        if (localStorageKey && localStorageKey.endsWith('-')) {
            // Wellness uses individual keys like 'wellness-status-P1-M1'
            isWellnessIndividualKeys = true;
        } else if (localStorageKey) {
            // Turnaround/Diversification use single storage keys
            const localRaw = localStorage.getItem(localStorageKey);
            if (localRaw) {
                localData = JSON.parse(localRaw);
            }
        }
    } catch (error) {
        console.warn('Failed to load localStorage for fallback:', error);
    }

    // If no database milestones, use empty array (will fallback to localStorage for all)
    const dbArray = Array.isArray(dbMilestones) ? dbMilestones : [];

    clone.phases.forEach(phase => {
        if (!phase.milestones) return;
        phase.milestones.forEach(milestone => {
            const dbMilestone = dbArray.find(m => m.id === milestone.id);
            if (dbMilestone) {
                // Database wins if milestone exists in DB
                milestone.status = dbMilestone.status;
                if (dbMilestone.revenue !== undefined) {
                    milestone.revenue = dbMilestone.revenue;
                }
            } else {
                // Fallback to localStorage for milestones not in DB
                if (isWellnessIndividualKeys) {
                    // Check individual wellness-status-{id} key
                    const localStatus = localStorage.getItem(localStorageKey + milestone.id);
                    if (localStatus) {
                        milestone.status = localStatus;
                    }
                } else if (localData && localData.phases) {
                    // Check in stored project data object
                    const localPhase = localData.phases.find(p => p.id === phase.id);
                    const localMilestone = localPhase?.milestones?.find(m => m.id === milestone.id);
                    if (localMilestone && localMilestone.status) {
                        milestone.status = localMilestone.status;
                        if (localMilestone.revenue !== undefined) {
                            milestone.revenue = localMilestone.revenue;
                        }
                    }
                }
            }
            // else: keep baseData default
        });
    });

    return clone;
}

// Load milestones from database
async function loadMilestonesFromDatabase(projectPrefix) {
    try {
        const response = await fetch(`/api/milestones?project=${projectPrefix}`);
        if (!response.ok) {
            console.warn('Database fetch failed, using cached data');
            return null;
        }
        const result = await response.json();
        return result.success ? result.milestones : null;
    } catch (error) {
        console.warn('Database unavailable, using cached data:', error.message);
        return null;
    }
}

function getLatestProjectData(baseData, fallbackKey, dbSnapshotKey) {
    const keysToCheck = [dbSnapshotKey, fallbackKey].filter(Boolean);
    for (const key of keysToCheck) {
        const hydrated = hydrateFromStorage(baseData, key);
        if (hydrated) return hydrated;
    }
    return cloneProjectData(baseData);
}

function reuseLastSyncedProject(lastSnapshot, baseData, fallbackKey, dbSnapshotKey) {
    if (lastSnapshot) {
        return cloneProjectData(lastSnapshot);
    }
    return getLatestProjectData(baseData, fallbackKey, dbSnapshotKey);
}

function hydrateFromStorage(baseData, storageKey) {
    if (!baseData || !storageKey) return null;
    try {
        const savedRaw = localStorage.getItem(storageKey);
        if (!savedRaw) return null;
        const saved = JSON.parse(savedRaw);
        const clone = cloneProjectData(baseData);
        if (!clone) return null;
        return mergeSavedMilestones(clone, saved);
    } catch (error) {
        console.warn(`Failed to hydrate project data for ${storageKey}`, error);
        return null;
    }
}

function persistProjectData(storageKey, data) {
    if (!data) return;
    const keys = Array.isArray(storageKey) ? storageKey.filter(Boolean) : [storageKey];
    keys.forEach(key => {
        if (!key) return;
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn(`Failed to persist project data for ${key}`, error);
        }
    });
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
async function loadAllData() {
    // Load from database first (synced across all browsers)
    const [turnaroundDbData, diversificationDbData, wellnessDbData] = await Promise.all([
        loadMilestonesFromDatabase('T'),
        loadMilestonesFromDatabase('P'),
        loadMilestonesFromDatabase('W')
    ]);

    // Merge database data with base project data
    let turnaroundData = typeof window.turnaroundData !== 'undefined'
        ? cloneProjectData(window.turnaroundData)
        : null;
    let diversificationData = typeof window.projectData !== 'undefined'
        ? cloneProjectData(window.projectData)
        : null;
    let wellnessData = typeof window.wellnessData !== 'undefined'
        ? cloneProjectData(window.wellnessData)
        : null;

    // Apply database milestones (if available)
    if (turnaroundDbData) {
        turnaroundData = mergeDatabaseMilestones(turnaroundData, turnaroundDbData, 'turn-status-');
        // CRITICAL: Write to separate snapshot key to preserve individual turn-status-* keys
        persistProjectData(['exec-turnaround-snapshot'], turnaroundData);
        lastSyncedProjects.turnaround = cloneProjectData(turnaroundData);
    } else {
        turnaroundData = reuseLastSyncedProject(
            lastSyncedProjects.turnaround,
            window.turnaroundData,
            'stabilis-turnaround-data',
            'stabilis-turnaround-data-db'
        );
    }

    if (diversificationDbData) {
        diversificationData = mergeDatabaseMilestones(diversificationData, diversificationDbData, 'div-status-');
        // CRITICAL: Write to separate snapshot key to preserve individual div-status-* keys
        persistProjectData(['exec-diversification-snapshot'], diversificationData);
        lastSyncedProjects.diversification = cloneProjectData(diversificationData);
    } else {
        diversificationData = reuseLastSyncedProject(
            lastSyncedProjects.diversification,
            window.projectData,
            'stabilis-project-data',
            'stabilis-project-data-db'
        );
    }

    if (wellnessDbData) {
        wellnessData = mergeDatabaseMilestones(wellnessData, wellnessDbData, 'wellness-status-');
        // Wellness uses individual keys only, this blob key is for aggregation purposes
        persistProjectData(['stabilis-wellness-data', 'stabilis-wellness-data-db'], wellnessData);
        lastSyncedProjects.wellness = cloneProjectData(wellnessData);
    } else {
        wellnessData = reuseLastSyncedProject(
            lastSyncedProjects.wellness,
            window.wellnessData,
            'stabilis-wellness-data',
            'stabilis-wellness-data-db'
        );
    }

    // Calculate progress for each project
    const turnaroundProgress = calculateProjectProgress(turnaroundData);
    const diversificationProgress = calculateProjectProgress(diversificationData);
    const wellnessProgress = calculateProjectProgress(wellnessData);
    
    // Executive Dashboard loaded successfully - individual status keys preserved

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
                // Check both 'complete' (frontend) and 'completed' (database)
                if (m.status === 'complete' || m.status === 'completed') complete++;

                const dueDate = new Date(m.due || m.dueDate);
                if (dueDate < today && m.status !== 'complete' && m.status !== 'completed') {
                    overdue++;
                    if (m.priority === 'critical' || m.priority === 'high') critical++;
                }

                if (dueDate >= today && dueDate <= nextWeek && m.status !== 'complete' && m.status !== 'completed') {
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
function showSection(sectionName, triggerBtn) {
    console.log('showSection called:', sectionName);

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Activated section:', sectionName);
    } else {
        console.error('Section not found:', `section-${sectionName}`);
    }

    // Highlight active nav button
    if (triggerBtn instanceof HTMLElement) {
        triggerBtn.classList.add('active');
    } else {
        document.querySelector(`.nav-btn[data-section="${sectionName}"]`)?.classList.add('active');
    }
}

window.showSection = showSection;

// Update financial section
function updateFinancialSection(turnaround, diversification, wellness) {
    // Calculate actual financial values from project data
    const divRevenue = diversification?.targetRevenue || 0;
    const wellRevenue = 5552600; // Wellness 12-month FY2026-27
    const turnSavings = 735000; // Turnaround cost avoidance
    
    // 18-month calculation: Q1 2026 (4mo) + FY 2026-27 (12mo) + Q1 2027 (2mo estimated)
    const q1Revenue = 469800; // Dec 2025 - Mar 2026
    const fyRevenue = 8430000; // Apr 2026 - Mar 2027
    const q1NextRevenue = 1400000; // Apr-May 2027 estimated
    const totalRevenue18mo = q1Revenue + fyRevenue + q1NextRevenue;
    
    // Investment calculation: Q1 + FY budgets
    const q1Budget = 2340000; // Dec 2025 - Mar 2026
    const fyBudget = 7350000; // Apr 2026 - Mar 2027
    const totalInvestment = q1Budget + fyBudget;
    
    // Net impact
    const netImpact = totalRevenue18mo - totalInvestment + turnSavings;
    
    // Diversification: Q1 (183.6k) + FY (2.877M) + Q1 next (479k est)
    const divTotal18mo = 183600 + 2877475 + 479000;
    
    // Wellness: Q1 (262.4k) + FY (5.553M) + Q1 next (925k est)
    const wellTotal18mo = 262400 + 5552600 + 925000;
    
    document.getElementById('financial-overview').innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Total Projected Revenue (18mo)</span>
            <span class="summary-value positive">R${(totalRevenue18mo / 1000000).toFixed(1)}M</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Investment Required</span>
            <span class="summary-value">R${(totalInvestment / 1000000).toFixed(1)}M</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Expected Net Impact</span>
            <span class="summary-value ${netImpact > 0 ? 'positive' : 'negative'}">R${(netImpact / 1000000).toFixed(2)}M</span>
        </div>
    `;

    document.getElementById('revenue-breakdown').innerHTML = `
        <div class="summary-row">
            <span class="summary-label">🚨 Turnaround (Cost Savings)</span>
            <span class="summary-value positive">R${(turnSavings / 1000).toFixed(0)}K</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">📈 Diversification</span>
            <span class="summary-value positive">R${(divTotal18mo / 1000000).toFixed(1)}M</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">💚 Wellness Centre</span>
            <span class="summary-value positive">R${(wellTotal18mo / 1000000).toFixed(1)}M</span>
        </div>
    `;

    // Calculate YTD actual from completed milestones with revenue
    let ytdActual = 0;
    const allProjects = [turnaround, diversification, wellness];
    allProjects.forEach(project => {
        if (project?.phases) {
            project.phases.forEach(phase => {
                if (phase.milestones) {
                    phase.milestones.forEach(m => {
                        if ((m.status === 'completed' || m.status === 'complete') && m.revenue) {
                            ytdActual += m.revenue;
                        }
                    });
                }
            });
        }
    });
    
    const variance = ytdActual - totalInvestment;
    const varianceText = Math.abs(variance) < 100000 ? 'On Track' : 
                         variance > 0 ? `+R${(variance/1000).toFixed(0)}K` : 
                         `R${(variance/1000).toFixed(0)}K`;
    
    document.getElementById('budget-actual').innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Budgeted (18mo)</span>
            <span class="summary-value">R${(totalInvestment / 1000000).toFixed(1)}M</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Actual (YTD)</span>
            <span class="summary-value">R${ytdActual > 0 ? (ytdActual/1000).toFixed(0) + 'K' : '0 (Planning Phase)'}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Variance</span>
            <span class="summary-value ${variance >= 0 ? 'positive' : 'negative'}">${varianceText}</span>
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

    container.innerHTML = allMilestones.map(m => {
        const isComplete = m.status === 'completed' || m.status === 'complete';
        const bgColor = isComplete ? 'rgba(16, 185, 129, 0.15)' : 'transparent';
        const borderColor = isComplete ? '#10b981' : m.color;
        
        return `
        <div class="milestone-item" style="border-left: 3px solid ${borderColor}; background-color: ${bgColor};">
            <div class="milestone-title">${m.icon} ${m.title}</div>
            <div class="milestone-meta">
                ${m.project} | ${formatDate(m.due)} | 
                <span style="color: ${isComplete ? '#10b981' : '#94a3b8'};">
                    ${isComplete ? '✓ Complete' : 'In Progress'}
                </span>
            </div>
        </div>
    `;
    }).join('');
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
async function refreshDashboard() {
    await loadAllData();
    loadAIAlerts(); // Load AI-generated alerts
    updateTimestamp();
}

// Load AI-generated alerts
async function loadAIAlerts() {
    try {
        const response = await fetch('/api/ai/alerts', {
            headers: getAIRequestHeaders()
        });
        if (!response.ok) return;

        const data = await response.json();

        // Update alerts banner if there are critical alerts
        if (data.summary.critical > 0) {
            displayAlertsBanner(data.alerts);
        }

        // Update critical items section
        updateCriticalItemsWithAI(data.alerts);

    } catch (error) {
        console.error('Failed to load AI alerts:', error);
    }
}

// Display alerts banner
function displayAlertsBanner(alerts) {
    const banner = document.getElementById('alerts-banner');
    if (!banner) return;

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length === 0) {
        banner.style.display = 'none';
        return;
    }

    window.currentCriticalAlerts = criticalAlerts;
    banner.innerHTML = `
        <div class="alert-banner-content">
            <span class="alert-icon">🚨</span>
            <span class="alert-text">
                <strong>${criticalAlerts.length} Critical Alert${criticalAlerts.length > 1 ? 's' : ''}</strong>
                - ${criticalAlerts[0].message}
                ${criticalAlerts.length > 1 ? ` and ${criticalAlerts.length - 1} more...` : ''}
            </span>
            <button type="button" class="alert-view-btn" data-alert-details-toggle onclick="toggleAlertDetails()">View Details</button>
        </div>
        <div class="alert-details-panel" id="alert-details-panel"></div>
    `;
    banner.style.display = 'flex';
    banner.classList.remove('expanded');

    renderAlertDetailsList(criticalAlerts);
}

function renderAlertDetailsList(alerts) {
    const detailsPanel = document.getElementById('alert-details-panel');
    if (!detailsPanel) return;
    if (!alerts || alerts.length === 0) {
        detailsPanel.innerHTML = '<div class="alert-details-empty">✅ No critical alerts right now</div>';
        return;
    }

    detailsPanel.innerHTML = alerts.map((alert, index) => {
        const identifier = alert.milestone_id || alert.details?.risk_id || 'Alert';
        const title = alert.details?.milestone_title || alert.details?.risk_title || alert.message;
        const owner = alert.details?.owner || 'Unassigned';
        return `
            <button class="alert-detail-item" type="button" onclick="viewAlertDetail(${index})">
                <div class="alert-detail-heading">
                    <strong>${identifier}</strong>
                    <span>${title}</span>
                </div>
                <div class="alert-detail-meta">Owner: ${owner}</div>
            </button>
        `;
    }).join('');
}

function toggleAlertDetails() {
    const banner = document.getElementById('alerts-banner');
    if (!banner) return;
    banner.classList.toggle('expanded');
    const toggleBtn = banner.querySelector('[data-alert-details-toggle]');
    if (toggleBtn) {
        toggleBtn.textContent = banner.classList.contains('expanded') ? 'Hide Details' : 'View Details';
    }
}

function viewAlertDetail(alertIndex) {
    const alerts = window.currentCriticalAlerts || [];
    const alert = alerts[alertIndex];
    if (!alert) return;
    const modal = ensureAlertModal();
    const body = modal.querySelector('[data-alert-modal-body]');
    const isRisk = Boolean(alert.details?.risk_id);
    const title = alert.details?.milestone_title || alert.details?.risk_title || alert.message;
    const owner = alert.details?.owner || alert.owner || 'Unassigned';
    const due = alert.details?.due_date || alert.details?.due || alert.due;
    const identifier = alert.milestone_id || alert.details?.risk_id || 'N/A';
    const extraMsg = isRisk
        ? `<p><strong>Phase:</strong> ${alert.details?.phase || 'Unknown'}</p>
           <p>${alert.details?.description || alert.message}</p>`
        : `<p>${alert.message}</p>`;
    body.innerHTML = `
        <p><strong>ID:</strong> ${identifier}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Owner:</strong> ${owner}</p>
        ${due ? `<p><strong>Due:</strong> ${formatDate(new Date(due))}</p>` : ''}
        <p><strong>Status:</strong> ${alert.details?.status || alert.status || 'Unknown'}</p>
        ${extraMsg}
    `;
    modal.querySelector('[data-alert-modal-title]').textContent = isRisk ? 'Critical Risk' : 'Critical Milestone';
    modal.classList.add('active');
}

function ensureAlertModal() {
    let modal = document.getElementById('alert-milestone-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'alert-milestone-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 data-alert-modal-title>Critical Milestone</h2>
                <button class="modal-close" type="button" aria-label="Close" onclick="closeAlertMilestoneModal()">&times;</button>
            </div>
            <div class="modal-body" data-alert-modal-body></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function closeAlertMilestoneModal() {
    const modal = document.getElementById('alert-milestone-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

window.toggleAlertDetails = toggleAlertDetails;
window.viewAlertDetail = viewAlertDetail;
window.closeAlertMilestoneModal = closeAlertMilestoneModal;

// Update critical items with AI alerts
function updateCriticalItemsWithAI(alerts) {
    const container = document.getElementById('critical-items');
    if (!container) return;

    const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'warning');

    if (criticalAlerts.length === 0) {
        container.innerHTML = '<div class="no-critical">✅ No critical items requiring attention</div>';
        return;
    }

    const alertsHTML = criticalAlerts.map(alert => {
        const icon = alert.severity === 'critical' ? '🔴' : '⚠️';
        const className = alert.severity === 'critical' ? 'critical-alert' : 'warning-alert';

        return `
            <div class="critical-item ${className}">
                <span class="critical-icon">${icon}</span>
                <div class="critical-content">
                    <div class="critical-title">${alert.type.replace('_', ' ').toUpperCase()}</div>
                    <div class="critical-message">${alert.message}</div>
                    ${alert.details ? `<div class="critical-details">${alert.details}</div>` : ''}
                </div>
                <button onclick="acknowledgeAlert('${alert.id}')" class="acknowledge-btn">Acknowledge</button>
            </div>
        `;
    }).join('');

    container.innerHTML = alertsHTML;
}

// Acknowledge alert
async function acknowledgeAlert(alertId) {
    try {
        const response = await fetch(`/api/ai/alerts/${alertId}/acknowledge`, {
            method: 'POST',
            headers: getAIRequestHeaders()
        });

        if (response.ok) {
            loadAIAlerts(); // Refresh alerts
        }
    } catch (error) {
        console.error('Failed to acknowledge alert:', error);
    }
}

window.acknowledgeAlert = acknowledgeAlert;

window.refreshDashboard = refreshDashboard;

// Helper function to format dates
function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Check if user can edit Excel workbook (CEO and FM only)
function canEditWorkbook() {
    const currentUser = getAuthUser();
    if (!currentUser) return false;
    const authorizedUsers = ['Attie Nel', 'Nastasha Jackson', 'Nastasha Jacobs', 'Developer'];
    return authorizedUsers.includes(currentUser.name);
}

function updateWorkbookButtonVisibility() {
    const canEdit = canEditWorkbook();
    document.querySelectorAll('[data-role="workbook-action"]').forEach(el => {
        el.style.display = canEdit ? '' : 'none';
    });
}

// Check if user can sync budget (CEO and FM only)
function canSyncBudget() {
    const currentUser = sessionStorage.getItem('userRole');
    return currentUser === 'CEO' || currentUser === 'FM';
}

function updateSyncButtonVisibility() {
    const canSync = canSyncBudget();
    const syncBtn = document.getElementById('sync-budget-btn');
    const syncSidebar = document.getElementById('sync-budget-sidebar');
    
    if (syncBtn) {
        syncBtn.style.display = canSync ? 'inline-flex' : 'none';
    }
    if (syncSidebar) {
        syncSidebar.style.display = canSync ? 'block' : 'none';
    }
    
    if (canSync) {
        console.log('✅ Budget sync buttons enabled for', sessionStorage.getItem('userRole'));
    }
}

function revealDashboardAction(actionKey) {
    if (!actionKey) return;
    const actionBtn = document.querySelector(`[data-hamburger-action="${actionKey}"]`);
    if (actionBtn) {
        actionBtn.classList.add('is-visible');
    }
}

function updateSummaryPlaceholder() {
    const placeholder = document.getElementById('exec-summary-placeholder');
    if (!placeholder) return;
    const hasVisibleCard = Boolean(document.querySelector('.summary-card.summary-visible'));
    placeholder.style.display = hasVisibleCard ? 'none' : '';
}

function toggleExecutiveSidebar() {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebar-overlay')?.classList.toggle('active');
}

function closeExecutiveSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
}

function handleExecutiveSidebarSectionToggle(button) {
    const section = button.closest('.sidebar-section');
    const arrow = button.querySelector('.section-arrow');
    const wasExpanded = section?.classList.contains('expanded');

    document.querySelectorAll('#sidebar .sidebar-section').forEach(sec => sec.classList.remove('expanded'));
    document.querySelectorAll('#sidebar .section-arrow').forEach(icon => icon.textContent = '▼');

    if (section && !wasExpanded) {
        section.classList.add('expanded');
        if (arrow) arrow.textContent = '▲';
    }
}

function handleExecutiveSidebarAction(action) {
    revealDashboardAction(action);
    switch (action) {
        case 'nav-project-hub':
            window.location.href = 'landing.html?stay=1';
            break;
        case 'nav-turnaround':
            window.location.href = 'turnaround.html';
            break;
        case 'nav-diversification':
            window.location.href = 'index.html';
            break;
        case 'nav-wellness':
            window.location.href = 'wellness.html';
            break;
        case 'nav-executive':
            window.location.href = 'executive-dashboard.html';
            break;
        case 'action-refresh':
            refreshDashboard();
            break;
        case 'action-reports':
            openReportsMenu();
            break;
        case 'action-edit-milestone':
            if (typeof window.showEditMilestoneModal === 'function') {
                window.showEditMilestoneModal();
            }
            break;
        case 'action-edit-workbook':
            openExcelFile();
            break;
        case 'action-sync-budget':
            if (typeof window.syncBudgetData === 'function') {
                window.syncBudgetData();
            }
            break;
        case 'action-sync-workbook':
            if (typeof window.showWorkbookSyncInstructions === 'function') {
                window.showWorkbookSyncInstructions();
            }
            break;
        case 'action-open-chat':
            document.getElementById('ai-chat-container')?.scrollIntoView({ behavior: 'smooth' });
            break;
        default:
            break;
    }
    closeExecutiveSidebar();
}

function focusExecutiveSummary(targetId) {
    if (!targetId) return;
    showSection('overview');
    requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        const card = target?.closest('.dashboard-card');
        if (card) {
            card.classList.add('summary-visible');
            card.classList.add('summary-focus');
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => card.classList.remove('summary-focus'), 1500);
            updateSummaryPlaceholder();
        }
    });
    closeExecutiveSidebar();
}

function bindExecutiveSidebar() {
    document.getElementById('menu-btn')?.addEventListener('click', toggleExecutiveSidebar);
    document.getElementById('sidebar-close')?.addEventListener('click', closeExecutiveSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeExecutiveSidebar);

    document.querySelectorAll('#sidebar .sidebar-section-title').forEach(button => {
        button.addEventListener('click', () => handleExecutiveSidebarSectionToggle(button));
    });

    const expandedArrow = document.querySelector('#sidebar .sidebar-section.expanded .section-arrow');
    if (expandedArrow) {
        expandedArrow.textContent = '▲';
    }

    document.querySelectorAll('#sidebar [data-action]').forEach(btn => {
        btn.addEventListener('click', event => {
            handleExecutiveSidebarAction(event.currentTarget.getAttribute('data-action'));
        });
    });

    document.querySelectorAll('#sidebar [data-summary]').forEach(btn => {
        btn.addEventListener('click', event => {
            focusExecutiveSummary(event.currentTarget.getAttribute('data-summary'));
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Executive Dashboard initializing...');

    // Initialize auth first
    if (typeof initAuth === 'function') {
        initAuth();
    } else {
        console.error('initAuth function not found');
    }

    // Initialize reports menu
    if (typeof initReportsMenu === 'function') {
        initReportsMenu();
    }

    // Setup access watcher
    setupExecutiveDashboardAccessWatcher();

    // Update workbook button visibility
    updateWorkbookButtonVisibility();
    
    // Update sync button visibility (CEO/FM only)
    updateSyncButtonVisibility();

    // Bind sidebar
    bindExecutiveSidebar();

    // Update placeholder
    updateSummaryPlaceholder();

    // Listen for user changes
    window.addEventListener('stabilis-user-changed', updateWorkbookButtonVisibility);
    window.addEventListener('stabilis-user-changed', updateSyncButtonVisibility);

    console.log('Executive Dashboard initialized');
});

function handleProjectDataChange(event) {
    const keys = [
        'stabilis-project-data',
        'stabilis-project-data-db',
        'stabilis-turnaround-data',
        'stabilis-turnaround-data-db',
        'stabilis-wellness-data',
        'stabilis-wellness-data-db'
    ];
    const key = event.detail?.key || event.key;
    if (keys.includes(key)) {
        refreshDashboard();
    }
}

window.addEventListener('storage', handleProjectDataChange);
window.addEventListener('project-data-updated', handleProjectDataChange);
