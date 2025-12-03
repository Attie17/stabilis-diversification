
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkMilestoneStatuses() {
    const { data, error } = await supabase
        .from('milestones')
        .select('id, status')
        .neq('status', 'planned');

    if (error) {
        console.error('Error fetching milestones:', error);
        return;
    }

    console.log('Milestones with status != planned:', data);
}

checkMilestoneStatuses();
