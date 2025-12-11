#!/usr/bin/env node

const divData = require('../web/js/data.js');
const turnData = require('../web/js/turnaround-data.js');
const wellData = require('../web/js/wellness-data.js');

console.log('\n📊 COMPLETE MILESTONE BREAKDOWN - ALL PROJECTS\n');
console.log('='.repeat(70));

function countProject(data, projectName, icon) {
    console.log(`\n${icon} ${projectName.toUpperCase()}\n`);
    let total = 0;
    
    data.phases.forEach(phase => {
        const count = phase.milestones ? phase.milestones.length : 0;
        total += count;
        console.log(`  ${phase.id}: ${phase.name} (${count} milestones)`);
    });
    
    console.log(`  ${'—'.repeat(50)}`);
    console.log(`  Total: ${total} milestones`);
    return total;
}

const turnTotal = countProject(turnData, 'Turnaround', '🚨');
const divTotal = countProject(divData, 'Diversification', '📈');
const wellTotal = countProject(wellData, 'Wellness Centre', '💚');

console.log('\n' + '='.repeat(70));
console.log(`\n🎯 GRAND TOTAL: ${turnTotal + divTotal + wellTotal} milestones`);
console.log(`   🚨 Turnaround:      ${turnTotal}`);
console.log(`   📈 Diversification: ${divTotal}`);
console.log(`   💚 Wellness:        ${wellTotal}`);
console.log('');
