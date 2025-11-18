// Revenue Service - Financial Projections (Priority #2)
// 4 scenarios: Optimistic (100%), Realistic (85%), Conservative (60%), Minimum (40%)
// Service line breakdown by programme type

require('dotenv').config();
const fs = require('fs').promises;

class RevenueService {
    constructor() {
        this.scenarios = {
            optimistic: 1.0,
            realistic: 0.85,
            conservative: 0.60,
            minimum: 0.40
        };
        this.projects = [];
    }

    // Load all project data
    async loadProjects() {
        try {
            const diversification = require('../web/js/data.js');
            const turnaround = require('../web/js/turnaround-data.js');
            const wellness = require('../web/js/wellness-data.js');

            this.projects = [
                { name: 'Diversification', data: diversification },
                { name: 'Turnaround', data: turnaround },
                { name: 'Wellness', data: wellness }
            ];

            console.log(`📦 Loaded ${this.projects.length} projects for revenue analysis`);
            return this.projects;
        } catch (error) {
            console.error('❌ Error loading projects:', error.message);
            return [];
        }
    }

    // Calculate revenue by scenario
    calculateRevenue(baseRevenue, scenario = 'realistic') {
        const multiplier = this.scenarios[scenario] || this.scenarios.realistic;
        return baseRevenue * multiplier;
    }

    // Get revenue by service line (Turnaround vs Wellness)
    async getServiceLineBreakdown() {
        await this.loadProjects();

        const breakdown = {};

        this.projects.forEach(project => {
            const data = project.data;
            if (!data || !data.phases) return;

            // Calculate total revenue
            const totalRevenue = data.phases.reduce((sum, phase) => sum + (phase.revenue || 0), 0);

            // Service line categorization
            const serviceLine = project.name === 'Turnaround' ? 'Turnaround' :
                                project.name === 'Wellness' ? 'Wellness' :
                                'Diversification';

            if (!breakdown[serviceLine]) {
                breakdown[serviceLine] = {
                    base_revenue: 0,
                    phases: [],
                    milestones_count: 0
                };
            }

            breakdown[serviceLine].base_revenue += totalRevenue;
            breakdown[serviceLine].phases.push(...data.phases);
            breakdown[serviceLine].milestones_count += data.phases.reduce(
                (sum, phase) => sum + (phase.milestones ? phase.milestones.length : 0), 0
            );
        });

        // Add scenario projections to each service line
        Object.keys(breakdown).forEach(line => {
            breakdown[line].scenarios = {};
            Object.keys(this.scenarios).forEach(scenario => {
                breakdown[line].scenarios[scenario] = this.calculateRevenue(
                    breakdown[line].base_revenue,
                    scenario
                );
            });
        });

        return breakdown;
    }

    // Get comprehensive revenue projection
    async getProjection() {
        await this.loadProjects();

        // Calculate total base revenue
        let totalBaseRevenue = 0;
        const phaseDetails = [];

        this.projects.forEach(project => {
            const data = project.data;
            if (!data || !data.phases) return;

            data.phases.forEach(phase => {
                totalBaseRevenue += phase.revenue || 0;
                phaseDetails.push({
                    project: project.name,
                    phase_id: phase.id,
                    phase_name: phase.name,
                    base_revenue: phase.revenue || 0,
                    start_date: phase.startDate,
                    end_date: phase.endDate,
                    milestones_count: phase.milestones ? phase.milestones.length : 0
                });
            });
        });

        // Calculate scenario projections
        const scenarios = {};
        Object.entries(this.scenarios).forEach(([name, multiplier]) => {
            scenarios[name] = {
                multiplier: multiplier,
                percentage: (multiplier * 100).toFixed(0) + '%',
                total_revenue: this.calculateRevenue(totalBaseRevenue, name),
                phases: phaseDetails.map(p => ({
                    ...p,
                    projected_revenue: this.calculateRevenue(p.base_revenue, name)
                }))
            };
        });

        // Get service line breakdown
        const serviceLines = await this.getServiceLineBreakdown();

        // Calculate monthly breakdown for cashflow
        const monthlyBreakdown = this.calculateMonthlyBreakdown(phaseDetails);

        return {
            total_base_revenue: totalBaseRevenue,
            scenarios,
            service_lines: serviceLines,
            monthly_breakdown: monthlyBreakdown,
            summary: {
                optimistic: scenarios.optimistic.total_revenue,
                realistic: scenarios.realistic.total_revenue,
                conservative: scenarios.conservative.total_revenue,
                minimum: scenarios.minimum.total_revenue
            },
            generated_at: new Date().toISOString()
        };
    }

    // Calculate monthly cashflow projection
    calculateMonthlyBreakdown(phaseDetails) {
        const monthly = {};

        phaseDetails.forEach(phase => {
            if (!phase.start_date || !phase.end_date) return;

            const start = new Date(phase.start_date);
            const end = new Date(phase.end_date);
            const months = Math.ceil((end - start) / (30 * 24 * 60 * 60 * 1000));

            if (months <= 0) return;

            const monthlyRevenue = phase.base_revenue / months;

            let current = new Date(start);
            for (let i = 0; i < months; i++) {
                const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;

                if (!monthly[key]) {
                    monthly[key] = {
                        month: key,
                        base_revenue: 0,
                        optimistic: 0,
                        realistic: 0,
                        conservative: 0,
                        minimum: 0,
                        phases: []
                    };
                }

                monthly[key].base_revenue += monthlyRevenue;
                monthly[key].optimistic += monthlyRevenue * this.scenarios.optimistic;
                monthly[key].realistic += monthlyRevenue * this.scenarios.realistic;
                monthly[key].conservative += monthlyRevenue * this.scenarios.conservative;
                monthly[key].minimum += monthlyRevenue * this.scenarios.minimum;
                monthly[key].phases.push({
                    project: phase.project,
                    phase_name: phase.phase_name,
                    monthly_revenue: monthlyRevenue
                });

                current.setMonth(current.getMonth() + 1);
            }
        });

        // Sort by month
        return Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));
    }

    // Get revenue variance (actual vs projected)
    async getVarianceAnalysis() {
        await this.loadProjects();

        const analysis = [];
        const today = new Date();

        this.projects.forEach(project => {
            const data = project.data;
            if (!data || !data.phases) return;

            data.phases.forEach(phase => {
                const phaseStart = new Date(phase.startDate);
                const phaseEnd = new Date(phase.endDate);
                const phaseDuration = (phaseEnd - phaseStart) / (24 * 60 * 60 * 1000);
                const elapsed = Math.max(0, (today - phaseStart) / (24 * 60 * 60 * 1000));
                const progress = Math.min(1, elapsed / phaseDuration);

                // Expected revenue (realistic scenario)
                const expectedRevenue = phase.revenue * this.scenarios.realistic * progress;

                // Actual revenue (based on completed milestones)
                const completedCount = phase.milestones
                    ? phase.milestones.filter(m => m.status === 'completed').length
                    : 0;
                const totalCount = phase.milestones ? phase.milestones.length : 1;
                const completionRate = completedCount / totalCount;
                const actualRevenue = phase.revenue * completionRate;

                // Variance
                const variance = actualRevenue - expectedRevenue;
                const variancePercent = expectedRevenue > 0 ? (variance / expectedRevenue) * 100 : 0;

                analysis.push({
                    project: project.name,
                    phase_id: phase.id,
                    phase_name: phase.name,
                    base_revenue: phase.revenue,
                    expected_revenue: expectedRevenue,
                    actual_revenue: actualRevenue,
                    variance: variance,
                    variance_percent: variancePercent,
                    progress_percent: (progress * 100).toFixed(1),
                    completion_rate: (completionRate * 100).toFixed(1),
                    status: variancePercent < -15 ? 'behind' : variancePercent > 15 ? 'ahead' : 'on-track'
                });
            });
        });

        return {
            phases: analysis,
            summary: {
                total_expected: analysis.reduce((sum, a) => sum + a.expected_revenue, 0),
                total_actual: analysis.reduce((sum, a) => sum + a.actual_revenue, 0),
                total_variance: analysis.reduce((sum, a) => sum + a.variance, 0),
                behind_count: analysis.filter(a => a.status === 'behind').length,
                ahead_count: analysis.filter(a => a.status === 'ahead').length,
                on_track_count: analysis.filter(a => a.status === 'on-track').length
            },
            generated_at: new Date().toISOString()
        };
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Display formatted projection
    async displayProjection() {
        const projection = await this.getProjection();

        console.log('\n💰 REVENUE PROJECTION\n');
        console.log('═══════════════════════════════════════════════════════\n');

        console.log('📊 Scenario Summary:');
        console.log(`   Optimistic (100%):  ${this.formatCurrency(projection.summary.optimistic)}`);
        console.log(`   Realistic (85%):    ${this.formatCurrency(projection.summary.realistic)}`);
        console.log(`   Conservative (60%): ${this.formatCurrency(projection.summary.conservative)}`);
        console.log(`   Minimum (40%):      ${this.formatCurrency(projection.summary.minimum)}\n`);

        console.log('📈 Service Line Breakdown:');
        Object.entries(projection.service_lines).forEach(([line, data]) => {
            console.log(`\n   ${line}:`);
            console.log(`   Base Revenue: ${this.formatCurrency(data.base_revenue)}`);
            console.log(`   Milestones: ${data.milestones_count}`);
            console.log(`   Scenarios:`);
            Object.entries(data.scenarios).forEach(([scenario, revenue]) => {
                console.log(`     - ${scenario}: ${this.formatCurrency(revenue)}`);
            });
        });

        console.log('\n📅 Monthly Cashflow (Next 6 months):');
        projection.monthly_breakdown.slice(0, 6).forEach(month => {
            console.log(`\n   ${month.month}:`);
            console.log(`     Realistic: ${this.formatCurrency(month.realistic)}`);
            console.log(`     Phases: ${month.phases.length}`);
        });

        console.log('\n═══════════════════════════════════════════════════════\n');

        return projection;
    }
}

// Test if run directly
if (require.main === module) {
    (async () => {
        const revenueService = new RevenueService();
        await revenueService.displayProjection();

        console.log('\n📉 Variance Analysis:\n');
        const variance = await revenueService.getVarianceAnalysis();
        console.log(`   Expected: ${revenueService.formatCurrency(variance.summary.total_expected)}`);
        console.log(`   Actual: ${revenueService.formatCurrency(variance.summary.total_actual)}`);
        console.log(`   Variance: ${revenueService.formatCurrency(variance.summary.total_variance)}\n`);
        console.log(`   Behind: ${variance.summary.behind_count} phases`);
        console.log(`   On Track: ${variance.summary.on_track_count} phases`);
        console.log(`   Ahead: ${variance.summary.ahead_count} phases\n`);
    })();
}

module.exports = RevenueService;
