// Quick script to apply schema via Supabase API
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function applySchema() {
    console.log('📋 Reading schema.sql...\n');

    const schema = await fs.readFile('./database/schema.sql', 'utf-8');

    // Split into individual statements
    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements\n`);
    console.log('⚠️  NOTE: Apply schema.sql manually in Supabase SQL Editor');
    console.log(`    URL: ${process.env.SUPABASE_URL.replace('.supabase.co', '.supabase.co/project/_/sql')}\n`);
    console.log('    Then run: node scripts/setup-database.js\n');
}

if (require.main === module) {
    applySchema();
}
