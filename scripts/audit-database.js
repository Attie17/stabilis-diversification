#!/usr/bin/env node

/**
 * Database Audit Script
 * Checks milestone data accuracy across database and data files
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Import project data
const diversificationData = require('../web/js/data.js');
const turnaroundData = require('../web/js/turnaround-data.js');
const wellnessData = require('../web/js/wellness-data.js');

async function auditDatabase() {
    console.log('\n🔍 DATABASE ACCURACY AUDIT\n');
    console.log('=' .repeat(70));

    // Initialize Supabase
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        console.error('❌ Supabase credentials not configured');
        process.exit(1);
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );

    // Fetch all milestones from database
    const { data: allMilestones, error } = await supabase
        .from('milestones')
        .select('id, phase_id, status, title')
        .order('phase_id', { ascending: true });

    if (error) {
        console.error('❌ Database query failed:', error);
        process.exit(1);
    }

    console.log(`\n📊 TOTAL MILESTONES IN DATABASE: ${allMilestones.length}\n`);

    // Separate by project
    const divMilestones = allMilestones.filter(m => m.phase_id.startsWith('P'));
    const turnMilestones = allMilestones.filter(m => m.phase_id.startsWith('T'));
    const wellMilestones = allMilestones.filter(m => m.phase_id.startsWith('W'));

    console.log(`  📈 Diversification: ${divMilestones.length} milestones`);
    console.log(`  🚨 Turnaround:      ${turnMilestones.length} milestones`);
    console.log(`  💚 Wellness:        ${wellMilestones.length} milestones`);

    // Count milestones in data files
    function countDataFileMilestones(data) {
        let count = 0;
        if (data && data.phases) {
            data.phases.forEach(phase => {
                if (phase.milestones) {
                    count += phase.milestones.length;
                }
            });
        }
        return count;
    }

    const divDataCount = countDataFileMilestones(diversificationData);
    const turnDataCount = countDataFileMilestones(turnaroundData);
    const wellDataCount = countDataFileMilestones(wellnessData);

    console.log(`\n📄 MILESTONES IN DATA FILES:\n`);
    console.log(`  📈 Diversification: ${divDataCount} milestones`);
    console.log(`  🚨 Turnaround:      ${turnDataCount} milestones`);
    console.log(`  💚 Wellness:        ${wellDataCount} milestones`);
    console.log(`  📊 TOTAL:           ${divDataCount + turnDataCount + wellDataCount} milestones`);

    // Check for discrepancies
    console.log(`\n⚖️  COMPARISON:\n`);
    const divDiff = divMilestones.length - divDataCount;
    const turnDiff = turnMilestones.length - turnDataCount;
    const wellDiff = wellMilestones.length - wellDataCount;

    console.log(`  📈 Diversification: ${divDiff > 0 ? '+' : ''}${divDiff}`);
    console.log(`  🚨 Turnaround:      ${turnDiff > 0 ? '+' : ''}${turnDiff}`);
    console.log(`  💚 Wellness:        ${wellDiff > 0 ? '+' : ''}${wellDiff}`);

    // Check for duplicate IDs
    console.log(`\n🔎 CHECKING FOR DUPLICATES:\n`);
    const idCounts = {};
    allMilestones.forEach(m => {
        idCounts[m.id] = (idCounts[m.id] || 0) + 1;
    });

    const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
    if (duplicates.length > 0) {
        console.log(`  ❌ Found ${duplicates.length} duplicate milestone IDs:`);
        duplicates.forEach(([id, count]) => {
            console.log(`     - ${id}: ${count} entries`);
        });
    } else {
        console.log(`  ✅ No duplicate IDs found`);
    }

    // List extra milestones (in DB but not in data files)
    function extractDataFileIds(data) {
        const ids = [];
        if (data && data.phases) {
            data.phases.forEach(phase => {
                if (phase.milestones) {
                    phase.milestones.forEach(m => ids.push(m.id));
                }
            });
        }
        return ids;
    }

    const divDataIds = new Set(extractDataFileIds(diversificationData));
    const turnDataIds = new Set(extractDataFileIds(turnaroundData));
    const wellDataIds = new Set(extractDataFileIds(wellnessData));

    const extraDiv = divMilestones.filter(m => !divDataIds.has(m.id));
    const extraTurn = turnMilestones.filter(m => !turnDataIds.has(m.id));
    const extraWell = wellMilestones.filter(m => !wellDataIds.has(m.id));

    console.log(`\n🔍 EXTRA MILESTONES (in DB but not in data files):\n`);
    if (extraDiv.length > 0) {
        console.log(`  📈 Diversification (${extraDiv.length}):`);
        extraDiv.forEach(m => console.log(`     - ${m.id}: ${m.title}`));
    }
    if (extraTurn.length > 0) {
        console.log(`  🚨 Turnaround (${extraTurn.length}):`);
        extraTurn.forEach(m => console.log(`     - ${m.id}: ${m.title}`));
    }
    if (extraWell.length > 0) {
        console.log(`  💚 Wellness (${extraWell.length}):`);
        extraWell.forEach(m => console.log(`     - ${m.id}: ${m.title}`));
    }
    if (extraDiv.length === 0 && extraTurn.length === 0 && extraWell.length === 0) {
        console.log(`  ✅ All database milestones match data files`);
    }

    // Status summary
    console.log(`\n📊 COMPLETION STATUS:\n`);
    
    function statusSummary(milestones, projectName) {
        const completed = milestones.filter(m => m.status === 'completed' || m.status === 'complete').length;
        const percentage = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;
        console.log(`  ${projectName}: ${completed}/${milestones.length} (${percentage}%)`);
    }

    statusSummary(divMilestones, '📈 Diversification');
    statusSummary(turnMilestones, '🚨 Turnaround     ');
    statusSummary(wellMilestones, '💚 Wellness       ');

    const allCompleted = allMilestones.filter(m => m.status === 'completed' || m.status === 'complete').length;
    const overallPercentage = allMilestones.length > 0 ? Math.round((allCompleted / allMilestones.length) * 100) : 0;
    console.log(`  🎯 Overall:        ${allCompleted}/${allMilestones.length} (${overallPercentage}%)`);

    console.log('\n' + '=' .repeat(70));
    console.log('✅ Audit complete\n');
}

auditDatabase().catch(error => {
    console.error('\n❌ Audit failed:', error);
    process.exit(1);
});
