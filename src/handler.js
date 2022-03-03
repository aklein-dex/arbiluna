'use strict';
const prismContract = require('./prismProtocol/prismContract');
const swapContract = require('./prismProtocol/swapContract');

// the price receives from the API has no decimal
const DECIMAL = 1e6;
const ONE_UNIT = 1 * DECIMAL;

function formatValue(value) {
  return (value / DECIMAL).toFixed(3);
}

module.exports.run = async (event, context) => {
  const time = new Date();
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);

  const prism = await prismContract.execute(ONE_UNIT);
  const xprism = await swapContract.execute(ONE_UNIT, ['xprism', 'prism', 'ust',]);
  const luna = await swapContract.execute(ONE_UNIT, ['luna', 'prism', 'ust',]);
  const yluna = await swapContract.execute(ONE_UNIT, ['yluna', 'prism', 'ust',]);
  const pluna = await swapContract.execute(ONE_UNIT, ['pluna', 'prism', 'ust',]);
  const cluna = await swapContract.execute(ONE_UNIT, ['cluna', 'prism', 'ust',]);

  console.log(`1 PRISM:  ${formatValue(prism)} UST`);
  console.log(`1 xPRISM: ${formatValue(xprism)} UST`);
  console.log(`1 LUNA:   ${formatValue(luna)} UST`);
  console.log(`1 yLUNA:  ${formatValue(yluna)} UST`);
  console.log(`1 pLUNA:  ${formatValue(pluna)} UST`);
  console.log(`1 cLUNA:  ${formatValue(cluna)} UST`);

  const ccluna = await swapContract.execute(ONE_UNIT, ['luna', 'prism', 'cluna'])
  console.log(`1 LUNA = ${formatValue(ccluna)} cLUNA`);
  
};

// Another way to get the price of LUNA:
// const exchangeRate = await terra.oracle.exchangeRate('uusd');
// const lunaValue = exchangeRate.amount;
// console.log(`1 LUNA:  ${lunaValue.toFixed(3)} UST`);