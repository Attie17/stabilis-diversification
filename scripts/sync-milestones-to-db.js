#!/usr/bin/env node

/**
 * Milestone Data Migration Script
 * 
 * Syncs all milestone data from JavaScript files to Supabase database.
 * This is a one-time migration to populate the database for the first time.
 * Can be re-run safely (uses upsert logic).
 * 
 * Usage:
 *   node scripts/sync-milestones-to-db.js
 *   npm run sync-db
 * 
 * Options:
 *   --clear    Clear all milestones before syncing (use with caution)
 *   --dry-run  Show what would be synced without actually syncing
 */

require('dotenv').config();
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const shouldClear = args.includes('--clear');

// Import project data
const diversificationData = require('../web/js/data.js');
const turnaroundData = require('../web/js/turnaround-data.js');
const wellnessData = require('../web/js/wellness-data.js');

/**
 * Extract and normalize milestones from project data
 */
function extractMilestones(projectData, projectType) {
    const milestones = [];

    if (!projectData || !projectData.phases) {
        console.warn(`⚠️  No phases found in ${projectType} data`);
        return milestones;
    }

    projectData.phases.forEach(phase => {
        if (!phase.milestones || !Array.isArray(phase.milestones)) {
            console.warn(`⚠️  No milestones in phase ${phase.id}`);
            return;
        }

        phase.milestones.forEach(milestone => {
            milestones.push({
                id: milestone.id,
                title: milestone.title || milestone.name,
                phase_id: phase.id,
                phase_name: phase.name,
                owner: milestone.owner,
                due_date: milestone.due || milestone.dueDate,
                status: milestone.status === 'complete' ? 'completed' : milestone.status || 'planned',
                description: milestone.description || milestone.title,
                revenue: milestone.revenue || 0
            });
        });
    });

    return milestones;
}

/**
 * Clear all milestones from database
 */
async function clearDatabase() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );

    console.log('\n🗑️  Clearing milestones table...');

    const { error } = await supabase
        .from('milestones')
        .delete()
        .neq('id', ''); // Delete all records

    if (error) {
        throw new Error(`Failed to clear database: ${error.message}`);
    }

    console.log('✅ Database cleared\n');
}

/**
 * Sync milestones to database directly via Supabase
 */
async function syncMilestones(milestones, projectName) {
    if (isDryRun) {
        console.log(`[DRY RUN] Would sync ${milestones.length} ${projectName} milestones`);
        console.log('Sample:', JSON.stringify(milestones[0], null, 2));
        return { success: true, synced: milestones.length, dryRun: true };
    }

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
        .from('milestones')
        .upsert(milestones, {
            onConflict: 'id',
            ignoreDuplicates: false
        });

    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }

    return { success: true, synced: milestones.length };
}

/**
 * Main execution
 */
async function main() {
    console.log('\n========================================');
    console.log('  Milestone Database Migration Tool');
    console.log('========================================\n');

    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be made\n');
    }

    if (shouldClear && !isDryRun) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const answer = await new Promise(resolve => {
            readline.question('⚠️  Are you sure you want to clear all milestones? (yes/no): ', resolve);
        });
        readline.close();

        if (answer.toLowerCase() !== 'yes') {
            console.log('Aborted.');
            process.exit(0);
        }

        await clearDatabase();
    }

    // Extract milestones from all projects
    console.log('📦 Extracting milestone data...\n');

    const diversificationMilestones = extractMilestones(diversificationData, 'Diversification');
    const turnaroundMilestones = extractMilestones(turnaroundData, 'Turnaround');
    const wellnessMilestones = extractMilestones(wellnessData, 'Wellness');

    console.log(`   Diversification: ${diversificationMilestones.length} milestones`);
    console.log(`   Turnaround:      ${turnaroundMilestones.length} milestones`);
    console.log(`   Wellness:        ${wellnessMilestones.length} milestones`);
    console.log(`   ─────────────────────────────────`);
    console.log(`   Total:           ${diversificationMilestones.length + turnaroundMilestones.length + wellnessMilestones.length} milestones\n`);

    // Sync each project
    const results = {
        diversification: null,
        turnaround: null,
        wellness: null,
        errors: []
    };

    // Sync Diversification
    try {
        console.log('🔄 Syncing Diversification project...');
        results.diversification = await syncMilestones(diversificationMilestones, 'Diversification');
        console.log(`✅ Synced ${results.diversification.synced} milestones\n`);
    } catch (error) {
        console.error(`❌ Diversification sync failed: ${error.message}\n`);
        results.errors.push({ project: 'Diversification', error: error.message });
    }

    // Sync Turnaround
    try {
        console.log('🔄 Syncing Turnaround project...');
        results.turnaround = await syncMilestones(turnaroundMilestones, 'Turnaround');
        console.log(`✅ Synced ${results.turnaround.synced} milestones\n`);
    } catch (error) {
        console.error(`❌ Turnaround sync failed: ${error.message}\n`);
        results.errors.push({ project: 'Turnaround', error: error.message });
    }

    // Sync Wellness
    try {
        console.log('🔄 Syncing Wellness project...');
        results.wellness = await syncMilestones(wellnessMilestones, 'Wellness');
        console.log(`✅ Synced ${results.wellness.synced} milestones\n`);
    } catch (error) {
        console.error(`❌ Wellness sync failed: ${error.message}\n`);
        results.errors.push({ project: 'Wellness', error: error.message });
    }

    // Summary
    console.log('========================================');
    console.log('  Migration Summary');
    console.log('========================================\n');

    const totalSynced = (results.diversification?.synced || 0) +
        (results.turnaround?.synced || 0) +
        (results.wellness?.synced || 0);

    if (isDryRun) {
        console.log('🔍 DRY RUN - No actual changes made');
        console.log(`   Would sync: ${totalSynced} milestones\n`);
    } else {
        console.log(`✅ Successfully synced: ${totalSynced} milestones`);

        if (results.errors.length > 0) {
            console.log(`\n⚠️  Errors encountered: ${results.errors.length}`);
            results.errors.forEach(err => {
                console.log(`   - ${err.project}: ${err.error}`);
            });
        }
        console.log();
    }

    // Exit with error code if any syncs failed
    process.exit(results.errors.length > 0 ? 1 : 0);
}

// Run if executed directly
if (require.main === module) {
    main().catch(error => {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = { extractMilestones, syncMilestones };
