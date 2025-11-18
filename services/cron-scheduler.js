// Cron Scheduler - Automated Tasks
// Runs alert generation every 6 hours and other periodic tasks

require('dotenv').config();
const cron = require('node-cron');
const AlertService = require('./alert-service');
const RevenueService = require('./revenue-service');
const fs = require('fs').promises;
const path = require('path');

class CronScheduler {
    constructor(supabase = null) {
        this.supabase = supabase;
        this.alertService = new AlertService(supabase);
        this.revenueService = new RevenueService();
        this.jobs = [];
    }

    // Start all scheduled tasks
    start() {
        console.log('⏰ Starting Cron Scheduler...\n');

        // Job 1: Generate alerts every 6 hours
        const alertJob = cron.schedule('0 */6 * * *', async () => {
            console.log(`\n[${new Date().toISOString()}] Running scheduled alert generation...`);
            try {
                await this.alertService.generateAlerts();
            } catch (error) {
                console.error('❌ Alert generation error:', error);
            }
        });
        this.jobs.push({ name: 'Alert Generation', schedule: 'Every 6 hours', job: alertJob });

        // Job 2: Generate revenue report daily at 8 AM
        const revenueJob = cron.schedule('0 8 * * *', async () => {
            console.log(`\n[${new Date().toISOString()}] Running daily revenue report...`);
            try {
                const projection = await this.revenueService.getProjection();
                await this.saveReport('revenue-daily', projection);
            } catch (error) {
                console.error('❌ Revenue report error:', error);
            }
        });
        this.jobs.push({ name: 'Revenue Report', schedule: 'Daily at 8 AM', job: revenueJob });

        // Job 3: Backup changes log daily at midnight
        const backupJob = cron.schedule('0 0 * * *', async () => {
            console.log(`\n[${new Date().toISOString()}] Running daily backup...`);
            try {
                await this.backupData();
            } catch (error) {
                console.error('❌ Backup error:', error);
            }
        });
        this.jobs.push({ name: 'Daily Backup', schedule: 'Daily at midnight', job: backupJob });

        // Job 4: Health check every hour
        const healthJob = cron.schedule('0 * * * *', async () => {
            console.log(`\n[${new Date().toISOString()}] Health check...`);
            await this.healthCheck();
        });
        this.jobs.push({ name: 'Health Check', schedule: 'Every hour', job: healthJob });

        console.log('✅ Scheduled Jobs:');
        this.jobs.forEach(j => {
            console.log(`   - ${j.name}: ${j.schedule}`);
        });
        console.log('\n⏳ Scheduler running...\n');
    }

    // Stop all jobs
    stop() {
        this.jobs.forEach(j => j.job.stop());
        console.log('🛑 All scheduled jobs stopped');
    }

    // Save report to file
    async saveReport(name, data) {
        const reportsDir = path.join(__dirname, '../reports/automated');
        await fs.mkdir(reportsDir, { recursive: true });

        const filename = `${name}-${new Date().toISOString().split('T')[0]}.json`;
        const filepath = path.join(reportsDir, filename);

        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
        console.log(`   ✅ Report saved: ${filename}`);
    }

    // Backup in-memory data
    async backupData() {
        const backupDir = path.join(__dirname, '../backups');
        await fs.mkdir(backupDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

        const data = {
            alerts: this.alertService.alerts,
            timestamp: new Date().toISOString()
        };

        await fs.writeFile(backupFile, JSON.stringify(data, null, 2));
        console.log(`   ✅ Backup saved: backup-${timestamp}.json`);
    }

    // Health check
    async healthCheck() {
        const status = {
            timestamp: new Date().toISOString(),
            services: {
                alerts: 'ok',
                revenue: 'ok',
                database: this.supabase ? 'connected' : 'in-memory'
            }
        };

        // Check database connection if available
        if (this.supabase) {
            try {
                const { error } = await this.supabase.from('milestones').select('count').limit(1);
                status.services.database = error ? 'error' : 'connected';
            } catch (error) {
                status.services.database = 'error';
            }
        }

        console.log(`   ✅ Health: ${Object.values(status.services).every(s => s === 'ok' || s === 'connected' || s === 'in-memory') ? 'GOOD' : 'DEGRADED'}`);
    }
}

// Test if run directly
if (require.main === module) {
    const scheduler = new CronScheduler();
    scheduler.start();

    // Keep running
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Shutting down scheduler...');
        scheduler.stop();
        process.exit(0);
    });
}

module.exports = CronScheduler;
