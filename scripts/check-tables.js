// Direct table creation using Supabase REST API
require('dotenv').config();
const fetch = require('node-fetch');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function executeSQL(sql) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({ query: sql })
    });

    return response;
}

async function createAllTables() {
    console.log('🔨 Creating tables directly via API...\n');

    // Since we can't use RPC without it being set up, let's use HTTP REST API
    const createMilestones = await fetch(`${SUPABASE_URL}/rest/v1/milestones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            id: '__test__',
            title: 'Test',
            phase_id: 'TEST',
            status: 'planned'
        })
    });

    if (createMilestones.status === 404) {
        console.log('❌ Tables do not exist\n');
        console.log('📋 Please create tables manually:');
        console.log(`   1. Go to: ${SUPABASE_URL.replace('.supabase.co', '.supabase.co/project/_/editor')}`);
        console.log('   2. Click "New Query"');
        console.log('   3. Copy paste content from database/schema.sql');
        console.log('   4. Click "RUN"');
        console.log('\n   Then rerun: node scripts/setup-database.js\n');
        return false;
    }

    // Delete test record
    await fetch(`${SUPABASE_URL}/rest/v1/milestones?id=eq.__test__`, {
        method: 'DELETE',
        headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`
        }
    });

    console.log('✅ Tables exist!\n');
    return true;
}

if (require.main === module) {
    createAllTables();
}

module.exports = { createAllTables };
