// Apply database schema programmatically
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function createTables() {
    console.log('🔨 Creating database tables...\n');

    const queries = [
        // Milestones table
        `CREATE TABLE IF NOT EXISTS milestones (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            phase_id TEXT NOT NULL,
            phase_name TEXT,
            owner TEXT,
            due_date DATE,
            status TEXT DEFAULT 'planned',
            description TEXT,
            revenue NUMERIC DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )`,

        // Milestone updates
        `CREATE TABLE IF NOT EXISTS milestone_updates (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            milestone_id TEXT,
            field_changed TEXT NOT NULL,
            old_value TEXT,
            new_value TEXT,
            notes TEXT,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        )`,

        // Alerts
        `CREATE TABLE IF NOT EXISTS alerts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type TEXT NOT NULL,
            severity TEXT DEFAULT 'info',
            milestone_id TEXT,
            phase_id TEXT,
            message TEXT NOT NULL,
            details JSONB,
            acknowledged BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )`,

        // Conversations
        `CREATE TABLE IF NOT EXISTS conversations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            thread_id TEXT,
            user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            function_calls JSONB,
            tokens_used INTEGER,
            response_time_ms INTEGER,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        )`,

        // Change log
        `CREATE TABLE IF NOT EXISTS change_log (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            file_path TEXT NOT NULL,
            change_type TEXT,
            diff_summary TEXT,
            lines_added INTEGER DEFAULT 0,
            lines_removed INTEGER DEFAULT 0,
            full_diff TEXT,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        )`,

        // Research cache
        `CREATE TABLE IF NOT EXISTS research_cache (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            query TEXT NOT NULL,
            results JSONB NOT NULL,
            source TEXT DEFAULT 'tavily',
            expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
            created_at TIMESTAMPTZ DEFAULT NOW()
        )`
    ];

    for (const query of queries) {
        const { error } = await supabase.rpc('exec_sql', { sql: query }).catch(e => {
            // If RPC doesn't exist, that's ok - tables might already be created via SQL editor
            return { error: null };
        });

        if (error) {
            console.log(`   Note: ${error.message}`);
        }
    }

    console.log('✅ Table creation attempted (check Supabase dashboard for confirmation)\n');
}

async function testConnection() {
    try {
        const { count, error } = await supabase
            .from('milestones')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log('ℹ️  Tables may not exist yet. Please apply schema.sql in Supabase SQL Editor:');
            console.log(`   ${process.env.SUPABASE_URL}/project/_/sql\n`);
            return false;
        }

        console.log(`✅ Database ready (${count || 0} milestones found)\n`);
        return true;
    } catch (e) {
        console.log('❌ Connection test failed:', e.message, '\n');
        return false;
    }
}

async function main() {
    console.log('🗄️  Stabilis AI - Database Setup\n');
    console.log('='.repeat(60), '\n');

    const isReady = await testConnection();

    if (!isReady) {
        console.log('📋 Copy the content of database/schema.sql');
        console.log('📍 Paste it into Supabase SQL Editor');
        console.log('▶️  Run the query');
        console.log('\n   Then rerun this script.\n');
        process.exit(0);
    }

    console.log('🎉 Database is ready for data sync!\n');
}

if (require.main === module) {
    main();
}

module.exports = { createTables, testConnection };
