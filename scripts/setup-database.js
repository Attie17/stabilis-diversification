// Database Initialization and Sync
// Run this to set up Supabase and sync initial data

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Load static data files
function loadProjectData() {
    // Read data.js and extract projectData
    const dataJs = require('../web/js/data.js');
    return dataJs || require('../web/js/data');
}

async function syncMilestones() {
    console.log('🔄 Syncing milestones to Supabase...\n');

    try {
        // Load all three project data sources
        const diversificationData = require('../web/js/data.js');
        const turnaroundData = require('../web/js/turnaround-data.js');
        const wellnessData = require('../web/js/wellness-data.js');

        const allMilestones = [];

        // Extract Diversification milestones
        if (diversificationData && diversificationData.phases) {
            diversificationData.phases.forEach(phase => {
                phase.milestones.forEach(milestone => {
                    allMilestones.push({
                        id: milestone.id,
                        title: milestone.title,
                        phase_id: phase.id,
                        phase_name: phase.name,
                        owner: milestone.owner,
                        due_date: milestone.due,
                        status: milestone.status || 'planned',
                        description: milestone.description || '',
                        revenue: phase.revenue / phase.milestones.length // Distribute evenly
                    });
                });
            });
        }

        // Extract Turnaround milestones
        if (turnaroundData && turnaroundData.phases) {
            turnaroundData.phases.forEach(phase => {
                phase.milestones.forEach(milestone => {
                    allMilestones.push({
                        id: milestone.id,
                        title: milestone.title,
                        phase_id: phase.id,
                        phase_name: phase.name,
                        owner: milestone.owner,
                        due_date: milestone.due,
                        status: milestone.status || 'planned',
                        description: milestone.description || '',
                        revenue: 0 // Turnaround is cost-saving, not revenue-generating
                    });
                });
            });
        }

        // Extract Wellness milestones
        if (wellnessData && wellnessData.phases) {
            wellnessData.phases.forEach(phase => {
                phase.milestones.forEach(milestone => {
                    allMilestones.push({
                        id: milestone.id,
                        title: milestone.title,
                        phase_id: phase.id,
                        phase_name: phase.name,
                        owner: milestone.owner,
                        due_date: milestone.due,
                        status: milestone.status || 'planned',
                        description: milestone.description || '',
                        revenue: phase.revenue / phase.milestones.length
                    });
                });
            });
        }

        console.log(`📦 Loaded ${allMilestones.length} milestones from static files`);

        // Upsert to Supabase
        const { data, error } = await supabase
            .from('milestones')
            .upsert(allMilestones, { onConflict: 'id' });

        if (error) {
            console.error('❌ Error syncing milestones:', error);
            throw error;
        }

        console.log(`✅ Successfully synced ${allMilestones.length} milestones to Supabase\n`);
        return allMilestones.length;

    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        throw error;
    }
}

async function syncLocalStorageNotes() {
    console.log('📝 Checking for localStorage notes to sync...\n');

    // This will be implemented when we have a way to read localStorage from Node
    // For now, notes will be synced when user interacts with the web app
    console.log('ℹ️  LocalStorage sync will happen on first web app load\n');
}

async function runInitialSetup() {
    console.log('🚀 Starting Stabilis AI Assistant Database Setup\n');
    console.log('='.repeat(60));
    console.log('\n');

    try {
        // Test connection
        console.log('🔌 Testing Supabase connection...');
        const { data, error } = await supabase
            .from('milestones')
            .select('count')
            .limit(1);

        if (error && !error.message.includes('does not exist')) {
            throw new Error(`Connection failed: ${error.message}`);
        }

        console.log('✅ Supabase connection successful\n');

        // Sync milestones
        const milestonesCount = await syncMilestones();

        // Check localStorage
        await syncLocalStorageNotes();

        // Summary
        console.log('='.repeat(60));
        console.log('\n✨ Database setup complete!\n');
        console.log(`📊 Stats:`);
        console.log(`   - Milestones synced: ${milestonesCount}`);
        console.log(`   - Database: ${process.env.SUPABASE_URL}`);
        console.log('\n🎯 Next: Run OpenAI Assistant setup\n');

        return { success: true, milestonesCount };

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        console.error('\nPlease check:');
        console.error('1. Supabase credentials in .env file');
        console.error('2. Database schema has been applied');
        console.error('3. Network connection\n');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runInitialSetup().then(() => process.exit(0));
}

module.exports = { syncMilestones, syncLocalStorageNotes, runInitialSetup };
