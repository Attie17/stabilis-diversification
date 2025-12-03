/**
 * Automated Audit Trail Verification Test
 * Tests database schema and recent audit entries
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function testAuditTrail() {
    console.log('\n========================================');
    console.log('  Audit Trail Verification Test');
    console.log('========================================\n');

    let passed = 0;
    let failed = 0;

    // Test 1: Check milestone_updates table exists and has correct schema
    console.log('Test 1: Verifying milestone_updates table schema...');
    try {
        const { data, error } = await supabase
            .from('milestone_updates')
            .select('*')
            .limit(1);

        if (error && error.code === '42P01') {
            console.log('❌ FAILED: milestone_updates table does not exist');
            failed++;
        } else if (error) {
            console.log(`❌ FAILED: ${error.message}`);
            failed++;
        } else {
            console.log('✅ PASSED: milestone_updates table exists');
            passed++;
        }
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}`);
        failed++;
    }

    // Test 2: Check milestones table has data
    console.log('\nTest 2: Verifying milestones table has data...');
    try {
        const { data, error, count } = await supabase
            .from('milestones')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ FAILED: ${error.message}`);
            failed++;
        } else if (count === 0) {
            console.log('❌ FAILED: milestones table is empty');
            failed++;
        } else {
            console.log(`✅ PASSED: milestones table has ${count} records`);
            passed++;
        }
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}`);
        failed++;
    }

    // Test 3: Check recent audit entries (if any exist)
    console.log('\nTest 3: Checking for recent audit entries...');
    try {
        const { data, error } = await supabase
            .from('milestone_updates')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(10);

        if (error) {
            console.log(`❌ FAILED: ${error.message}`);
            failed++;
        } else {
            if (data.length === 0) {
                console.log('⚠️  WARNING: No audit entries found (no milestone changes yet)');
                console.log('✅ PASSED: Query successful (table ready for audit logging)');
            } else {
                console.log(`✅ PASSED: Found ${data.length} recent audit entries`);
                console.log('\nSample recent entry:');
                console.log(JSON.stringify(data[0], null, 2));
            }
            passed++;
        }
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}`);
        failed++;
    }

    // Test 4: Verify milestone_updates has required columns
    console.log('\nTest 4: Verifying milestone_updates has required columns...');
    try {
        const { data, error } = await supabase
            .from('milestone_updates')
            .select('id, milestone_id, field_changed, old_value, new_value, changed_by, is_financial, timestamp')
            .limit(1);

        if (error) {
            console.log(`❌ FAILED: Missing required columns - ${error.message}`);
            failed++;
        } else {
            console.log('✅ PASSED: All required columns exist');
            passed++;
        }
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}`);
        failed++;
    }

    // Test 5: Check alerts table
    console.log('\nTest 5: Verifying alerts table...');
    try {
        const { data, error, count } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ FAILED: ${error.message}`);
            failed++;
        } else {
            console.log(`✅ PASSED: alerts table exists with ${count} records`);
            passed++;
        }
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}`);
        failed++;
    }

    // Summary
    console.log('\n========================================');
    console.log('  Test Summary');
    console.log('========================================\n');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total:  ${passed + failed}`);
    console.log(`🎯 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    console.log('');

    process.exit(failed > 0 ? 1 : 0);
}

testAuditTrail().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
