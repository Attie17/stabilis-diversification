// Alert Service - Proactive Notifications (Priority #1)
// Generates alerts for deadlines, overdue tasks, inactivity, revenue variance, risks

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

// Load data sources statically (used only if DB unavailable)
let diversificationData, turnaroundData, wellnessData;
try {
    diversificationData = require('../web/js/data.js');
    turnaroundData = require('../web/js/turnaround-data.js');
    wellnessData = require('../web/js/wellness-data.js');
} catch (e) {
    console.warn('Failed to load project data files:', e.message);
}

class AlertService {
    constructor(supabase = null) {
        this.supabase = supabase;
        this.alerts = []; // In-memory storage if no DB table
        this.milestones = [];
        this.dbAlertsAvailable = Boolean(supabase);
        this.missingTableNotified = false;
        this.usedFallbackData = false;
    }

    async loadMilestones() {
        this.usedFallbackData = false;
        if (await this.loadMilestonesFromDatabase()) {
            return this.milestones;
        }
        await this.loadMilestonesFromStatic();
        this.usedFallbackData = true;
        return this.milestones;
    }

    async loadMilestonesFromDatabase() {
        if (!this.supabase) return false;

        try {
            const { data, error } = await this.supabase
                .from('milestones')
                .select('*');

            if (error) {
                console.warn('⚠️  Supabase milestones fetch failed, falling back to static data:', error.message);
                return false;
            }

            if (!Array.isArray(data) || data.length === 0) {
                console.warn('⚠️  Supabase returned no milestone rows, falling back to static data');
                return false;
            }

            this.milestones = data.map(row => ({
                id: row.id,
                title: row.title || row.name,
                owner: row.owner,
                due: row.due_date || row.due,
                status: row.status || 'planned',
                phase_id: row.phase_id,
                phase_name: row.phase_name || row.phase_id,
                revenue: row.revenue,
                updated_at: row.updated_at
            }));

            console.log(`✅ Loaded ${this.milestones.length} milestones from Supabase for alert checking`);
            return true;
        } catch (error) {
            console.error('❌ Supabase milestone fetch threw, falling back to static data:', error.message);
            return false;
        }
    }

    // Load milestones from static files
    async loadMilestonesFromStatic() {
        try {
            const diversification = diversificationData;
            const turnaround = turnaroundData;
            const wellness = wellnessData;

            this.milestones = [];

            [diversification, turnaround, wellness].forEach(project => {
                if (project && project.phases) {
                    project.phases.forEach(phase => {
                        if (phase.milestones) {
                            phase.milestones.forEach(m => {
                                this.milestones.push({
                                    ...m,
                                    phase_id: phase.id,
                                    phase_name: phase.name
                                });
                            });
                        }
                    });
                }
            });

            console.log(`📦 Loaded ${this.milestones.length} milestones from static data for alert checking`);
        } catch (error) {
            console.error('❌ Error loading milestones from static files:', error.message);
            this.milestones = [];
        }
    }

    // Check 1: Upcoming Deadlines (within 3 days)
    async checkUpcomingDeadlines() {
        const alerts = [];
        const today = new Date();
        const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

        this.milestones.forEach(m => {
            if (m.due && m.status !== 'completed') {
                const dueDate = new Date(m.due);
                if (dueDate >= today && dueDate <= threeDaysFromNow) {
                    const daysUntil = Math.ceil((dueDate - today) / (24 * 60 * 60 * 1000));
                    alerts.push({
                        type: 'deadline',
                        severity: daysUntil <= 1 ? 'critical' : 'warning',
                        milestone_id: m.id,
                        phase_id: m.phase_id,
                        message: `${m.title} (${m.id}) is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} but still in '${m.status}' status`,
                        details: {
                            milestone_title: m.title,
                            owner: m.owner,
                            due_date: m.due,
                            days_until: daysUntil
                        }
                    });
                }
            }
        });

        return alerts;
    }

    // Check 2: Overdue Milestones
    async checkOverdueMilestones() {
        const alerts = [];
        const today = new Date();

        this.milestones.forEach(m => {
            if (m.due && m.status !== 'completed') {
                const dueDate = new Date(m.due);
                if (dueDate < today) {
                    const daysOverdue = Math.ceil((today - dueDate) / (24 * 60 * 60 * 1000));
                    alerts.push({
                        type: 'overdue',
                        severity: daysOverdue > 7 ? 'critical' : 'warning',
                        milestone_id: m.id,
                        phase_id: m.phase_id,
                        message: `${m.title} (${m.id}) is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
                        details: {
                            milestone_title: m.title,
                            owner: m.owner,
                            due_date: m.due,
                            days_overdue: daysOverdue
                        }
                    });
                }
            }
        });

        return alerts;
    }

    // Check 3: Project Inactivity (no updates in 7 days)
    async checkInactivity() {
        const alerts = [];
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Group by phase/project
        const phaseActivity = {};
        this.milestones.forEach(m => {
            if (!phaseActivity[m.phase_id]) {
                phaseActivity[m.phase_id] = {
                    name: m.phase_name,
                    milestones: [],
                    lastActivity: null
                };
            }
            phaseActivity[m.phase_id].milestones.push(m);
        });

        // Check for phases with no recent activity
        Object.entries(phaseActivity).forEach(([phaseId, phase]) => {
            const hasRecentActivity = phase.milestones.some(m => {
                if (m.status === 'completed' && m.updated_at) {
                    return new Date(m.updated_at) > sevenDaysAgo;
                }
                return m.status === 'in_progress';
            });

            if (!hasRecentActivity && phase.milestones.length > 0) {
                alerts.push({
                    type: 'inactivity',
                    severity: 'info',
                    phase_id: phaseId,
                    message: `${phase.name} (${phaseId}) has had no milestone updates for 7+ days`,
                    details: {
                        phase_name: phase.name,
                        total_milestones: phase.milestones.length,
                        uncompleted: phase.milestones.filter(m => m.status !== 'completed').length
                    }
                });
            }
        });

        return alerts;
    }

    // Check 4: Revenue Variance (>15% off track)
    async checkRevenueVariance() {
        const alerts = [];
        const today = new Date();

        // Load revenue data
        const diversification = require('../web/js/data.js');
        if (!diversification || !diversification.phases) return alerts;

        diversification.phases.forEach(phase => {
            const phaseStart = new Date(phase.startDate);
            const phaseEnd = new Date(phase.endDate);
            const phaseDuration = (phaseEnd - phaseStart) / (24 * 60 * 60 * 1000);
            const elapsed = Math.max(0, (today - phaseStart) / (24 * 60 * 60 * 1000));
            const progress = Math.min(1, elapsed / phaseDuration);

            // Expected revenue based on time elapsed
            const expectedRevenue = phase.revenue * progress;

            // Actual revenue (from completed milestones)
            const completedMilestones = this.milestones.filter(
                m => m.phase_id === phase.id && m.status === 'completed'
            );
            const actualRevenue = (phase.revenue / phase.milestones.length) * completedMilestones.length;

            // Calculate variance
            const variance = actualRevenue - expectedRevenue;
            const variancePercent = expectedRevenue > 0 ? (variance / expectedRevenue) * 100 : 0;

            if (Math.abs(variancePercent) > 15 && progress > 0.1) {
                alerts.push({
                    type: 'revenue_variance',
                    severity: Math.abs(variancePercent) > 30 ? 'critical' : 'warning',
                    phase_id: phase.id,
                    message: `${phase.name} revenue is ${Math.abs(variancePercent).toFixed(0)}% ${variance < 0 ? 'behind' : 'ahead of'} projection`,
                    details: {
                        phase_name: phase.name,
                        expected_revenue: expectedRevenue,
                        actual_revenue: actualRevenue,
                        variance: variance,
                        variance_percent: variancePercent,
                        progress_percent: (progress * 100).toFixed(0)
                    }
                });
            }
        });

        return alerts;
    }

    // Check 5: Risk Escalations (from risks.md)
    async checkRiskFile() {
        const alerts = [];

        try {
            const risksPath = path.join(__dirname, '../tracking/risks.md');
            const risksContent = await fs.readFile(risksPath, 'utf-8');
            const lines = risksContent.split('\n');

            let currentSeverity = 'info';
            let currentRisk = null;

            const pushRisk = () => {
                if (!currentRisk) return;
                alerts.push({
                    type: 'risk',
                    severity: currentRisk.severity,
                    message: `${currentRisk.title} (${currentRisk.id}) requires attention`,
                    details: {
                        risk_id: currentRisk.id,
                        risk_title: currentRisk.title,
                        owner: currentRisk.owner,
                        phase: currentRisk.phase,
                        description: currentRisk.description,
                        file: 'tracking/risks.md',
                        line_number: currentRisk.lineNumber
                    }
                });
                currentRisk = null;
            };

            lines.forEach((rawLine, index) => {
                const line = rawLine.trim();
                if (!line) return;

                if (line.startsWith('### ')) {
                    pushRisk();
                    if (line.includes('🔴') || line.toLowerCase().includes('high')) {
                        currentSeverity = 'critical';
                    } else if (line.includes('🟡') || line.toLowerCase().includes('medium')) {
                        currentSeverity = 'warning';
                    } else {
                        currentSeverity = 'info';
                    }
                    return;
                }

                if (line.startsWith('#### ')) {
                    pushRisk();
                    const match = line.match(/^####\s+([^:]+):\s*(.+)$/);
                    if (match) {
                        currentRisk = {
                            id: match[1].trim(),
                            title: match[2].trim(),
                            owner: 'Unassigned',
                            phase: 'Unknown',
                            description: '',
                            lineNumber: index + 1,
                            severity: currentSeverity
                        };
                    }
                    return;
                }

                if (!currentRisk) return;

                if (line.startsWith('- **Owner:**')) {
                    currentRisk.owner = line.replace('- **Owner:**', '').replace(/\*\*/g, '').trim();
                } else if (line.startsWith('- **Phase:**')) {
                    currentRisk.phase = line.replace('- **Phase:**', '').replace(/\*\*/g, '').trim();
                } else if (line.startsWith('- **Description:**')) {
                    currentRisk.description = line.replace('- **Description:**', '').replace(/\*\*/g, '').trim();
                }
            });

            pushRisk();
        } catch (error) {
            console.log('ℹ️  No risks.md file found or error reading it');
        }

        return alerts;
    }

    // Generate all alerts
    async generateAlerts() {
        console.log('🔔 Generating alerts...');

        await this.loadMilestones();
        if (this.usedFallbackData) {
            console.warn('⚠️  Alerts generated using static fallback data. Database milestones were unavailable.');
        }

        const allAlerts = [
            ...(await this.checkUpcomingDeadlines()),
            ...(await this.checkOverdueMilestones()),
            ...(await this.checkInactivity()),
            ...(await this.checkRevenueVariance()),
            ...(await this.checkRiskFile())
        ];

        // Add timestamps
        allAlerts.forEach(alert => {
            alert.created_at = new Date().toISOString();
            alert.acknowledged = false;
        });

        // Store in memory or database
        if (this.supabase && this.dbAlertsAvailable) {
            const { error } = await this.supabase
                .from('alerts')
                .insert(allAlerts);

            if (error) {
                if (error.code === 'PGRST205') {
                    this.dbAlertsAvailable = false;
                    if (!this.missingTableNotified) {
                        console.error('❌ Supabase is missing the alerts table.');
                        console.error('   Run database/schema.sql (or database/alerts-table.sql) inside the Supabase SQL editor to provision it.');
                        console.error('   Until then, the service will store alerts in memory only.');
                        this.missingTableNotified = true;
                    }
                } else {
                    console.error('❌ Error saving alerts to database:', error);
                }
                this.alerts = allAlerts; // Fallback to memory
            } else {
                console.log(`✅ Saved ${allAlerts.length} alerts to database`);
            }
        } else {
            this.alerts = allAlerts;
            console.log(`✅ Generated ${allAlerts.length} alerts (in-memory)`);
        }

        // Summary
        const summary = {
            total: allAlerts.length,
            critical: allAlerts.filter(a => a.severity === 'critical').length,
            warning: allAlerts.filter(a => a.severity === 'warning').length,
            info: allAlerts.filter(a => a.severity === 'info').length,
            by_type: {
                deadline: allAlerts.filter(a => a.type === 'deadline').length,
                overdue: allAlerts.filter(a => a.type === 'overdue').length,
                inactivity: allAlerts.filter(a => a.type === 'inactivity').length,
                revenue_variance: allAlerts.filter(a => a.type === 'revenue_variance').length,
                risk: allAlerts.filter(a => a.type === 'risk').length
            }
        };

        console.log('\n📊 Alert Summary:');
        console.log(`   Total: ${summary.total}`);
        console.log(`   🔴 Critical: ${summary.critical}`);
        console.log(`   🟡 Warning: ${summary.warning}`);
        console.log(`   ℹ️  Info: ${summary.info}`);
        console.log('\n   By Type:');
        Object.entries(summary.by_type).forEach(([type, count]) => {
            if (count > 0) console.log(`   - ${type}: ${count}`);
        });
        console.log('');

        return { alerts: allAlerts, summary };
    }

    // Get active alerts
    async getActiveAlerts(severity = null) {
        let alerts = this.supabase
            ? (await this.supabase.from('alerts').select('*').eq('acknowledged', false)).data || []
            : this.alerts.filter(a => !a.acknowledged);

        if (severity) {
            alerts = alerts.filter(a => a.severity === severity);
        }

        return alerts.sort((a, b) => {
            const severityOrder = { critical: 1, warning: 2, info: 3 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });
    }

    // Acknowledge an alert
    async acknowledgeAlert(alertId) {
        if (this.supabase) {
            await this.supabase
                .from('alerts')
                .update({ acknowledged: true })
                .eq('id', alertId);
        } else {
            const alert = this.alerts.find(a => a.id === alertId);
            if (alert) alert.acknowledged = true;
        }
    }
}

// Test if run directly
if (require.main === module) {
    (async () => {
        const alertService = new AlertService();
        await alertService.generateAlerts();
    })();
}

module.exports = AlertService;
