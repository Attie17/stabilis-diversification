#!/usr/bin/env node

/**
 * Compare Database State vs localStorage State
 * Checks if what's in Supabase matches what users see in their browsers
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function compareStates() {
    console.log('\n🔍 DATABASE vs LOCALSTORAGE STATE COMPARISON\n');
    console.log('='.repeat(70));

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        console.error('❌ Supabase credentials not configured');
        process.exit(1);
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );

    // Fetch all milestones from database
    const { data: dbMilestones, error } = await supabase
        .from('milestones')
        .select('id, phase_id, status, title')
        .order('id', { ascending: true });

    if (error) {
        console.error('❌ Database query failed:', error);
        process.exit(1);
    }

    console.log(`\n📊 Database State: ${dbMilestones.length} milestones\n`);

    // Separate by project
    const projects = {
        'Turnaround': dbMilestones.filter(m => m.phase_id.startsWith('T')),
        'Diversification': dbMilestones.filter(m => m.phase_id.startsWith('P')),
        'Wellness': dbMilestones.filter(m => m.phase_id.startsWith('W'))
    };

    Object.entries(projects).forEach(([name, milestones]) => {
        const completed = milestones.filter(m => m.status === 'completed' || m.status === 'complete');
        const planned = milestones.filter(m => m.status === 'planned');
        const inProgress = milestones.filter(m => m.status === 'in_progress');
        const blocked = milestones.filter(m => m.status === 'blocked');
        
        console.log(`\n  ${name}:`);
        console.log(`    ✅ Completed:   ${completed.length}/${milestones.length}`);
        console.log(`    📋 Planned:     ${planned.length}`);
        console.log(`    🔄 In Progress: ${inProgress.length}`);
        console.log(`    🚫 Blocked:     ${blocked.length}`);
        
        if (completed.length > 0) {
            console.log(`\n    Completed Milestones in Database:`);
            completed.forEach(m => {
                console.log(`      ✓ ${m.id}: ${m.title}`);
            });
        }
    });

    console.log('\n' + '='.repeat(70));
    console.log('\n⚠️  IMPORTANT: Check Your Browser\n');
    console.log('To verify if checkboxes match the database:');
    console.log('1. Open each dashboard (Turnaround, Diversification, Wellness)');
    console.log('2. Compare the checked boxes with the list above');
    console.log('3. If they DON\'T match, the dashboard is using localStorage');
    console.log('   instead of database values\n');
    
    console.log('To check what\'s in your browser\'s localStorage:');
    console.log('1. Press F12 to open DevTools');
    console.log('2. Go to Application > Local Storage > http://localhost:3000');
    console.log('3. Look for keys like: div-status-*, turn-status-*, wellness-status-*');
    console.log('4. These should match the database values shown above\n');

    console.log('If there\'s a mismatch, run:');
    console.log('  Clear-Host; node scripts/check-localstorage-sync.js');
    console.log('');
}

compareStates().catch(error => {
    console.error('\n❌ Comparison failed:', error);
    process.exit(1);
});
