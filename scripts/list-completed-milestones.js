// List all completed milestones from database
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function listCompletedMilestones() {
    console.log('\n📋 Fetching completed milestones from database...\n');
    
    const { data, error } = await supabase
        .from('milestones')
        .select('id, title, status, phase_id, completion_date')
        .eq('status', 'complete')
        .order('phase_id');
    
    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }
    
    if (!data || data.length === 0) {
        console.log('ℹ️  No completed milestones found in database.');
        return;
    }
    
    console.log(`✅ Found ${data.length} completed milestones:\n`);
    
    // Group by project
    const byProject = {
        'Turnaround': [],
        'Diversification': [],
        'Wellness': []
    };
    
    data.forEach(m => {
        if (m.phase_id.startsWith('T')) {
            byProject['Turnaround'].push(m);
        } else if (m.phase_id.startsWith('P')) {
            byProject['Diversification'].push(m);
        } else if (m.phase_id.startsWith('W')) {
            byProject['Wellness'].push(m);
        }
    });
    
    // Print by project
    for (const [project, milestones] of Object.entries(byProject)) {
        if (milestones.length > 0) {
            console.log(`\n🎯 ${project} (${milestones.length} completed):`);
            milestones.forEach(m => {
                const date = m.completion_date ? ` - Completed: ${m.completion_date.split('T')[0]}` : '';
                console.log(`   ✓ ${m.id}: ${m.title}${date}`);
            });
        }
    }
    
    console.log('\n');
}

listCompletedMilestones().catch(console.error);
