#!/usr/bin/env node

const data = require('../web/js/wellness-data.js');

console.log('\n🔍 WELLNESS MILESTONE DETAILED COUNT\n');
console.log('='.repeat(70));

let total = 0;

data.phases.forEach(phase => {
    const count = phase.milestones ? phase.milestones.length : 0;
    total += count;
    
    console.log(`\n  💚 ${phase.name} (${phase.id}): ${count} milestones`);
    
    if (phase.milestones) {
        phase.milestones.forEach(m => {
            console.log(`     - ${m.id}: ${m.title || m.name}`);
        });
    }
});

console.log('\n' + '='.repeat(70));
console.log(`\n  📊 TOTAL WELLNESS MILESTONES: ${total}\n`);
