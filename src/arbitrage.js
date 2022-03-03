
// find the % difference
function getArbitrage(tokenA, tokenB) {
  return ((tokenB - tokenA) * 100 / tokenA).toFixed(2);
}

console.log('\nArbitrage opportunity:');

// const prismXprismArb = getArbitrage(prismValue, xprismValue);
// if (prismXprismArb < 0) {
//   console.log(`  Arb = ${prismXprismArb * -1 }% xPRISM -> PRISM`);
// } else {
//   console.log(`  Arb = ${prismXprismArb}% PRISM -> xPRISM`);
// }

// const lunaClunaArb = getArbitrage(lunaValue, clunaValue);
// if (lunaClunaArb < 0) {
//   console.log(`  Arb = ${lunaClunaArb * -1 }% cLUNA -> LUNA`);
// } else {
//   console.log(`  Arb = ${lunaClunaArb}% LUNA -> cLUNA`);
// }

// const lunaPYlunaArb = getArbitrage(lunaValue, (plunaValue + ylunaValue));
// if (lunaPYlunaArb < 0) {
//   console.log(`  Arb = ${lunaPYlunaArb * -1 }% pLUNA + yLUNA -> LUNA`);
// } else {
//   console.log(`  Arb = ${lunaPYlunaArb}% LUNA -> pLUNA + yLUNA`);
// }

// const clunaPYlunaArb = getArbitrage(clunaValue, (plunaValue + ylunaValue));
// if (clunaPYlunaArb < 0) {
//   console.log(`  Arb = ${clunaPYlunaArb * -1 }% pLUNA + yLUNA -> cLUNA`);
// } else {
//   console.log(`  Arb = ${clunaPYlunaArb}% cLUNA -> pLUNA + yLUNA`);
// }