
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkStatus() {
    const { data, error } = await supabase
        .from('milestones')
        .select('status, count(*)')
        .maybeSingle(); // This won't work for aggregation in standard Supabase client without rpc or grouping manually

    // Let's just get all statuses
    const { data: milestones, error: err } = await supabase
        .from('milestones')
        .select('status');

    if (err) {
        console.error(err);
        return;
    }

    const counts = {};
    milestones.forEach(m => {
        counts[m.status] = (counts[m.status] || 0) + 1;
    });

    console.log('Milestone Status Counts:', counts);
}

checkStatus();
