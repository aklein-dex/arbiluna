'use strict';
const prismContract = require('./prismContract');
const swapContract = require('./swapContract');

// the price receives from the API has no decimal
const DECIMAL = 1e6;
const ONE_UNIT = 1 * DECIMAL;

/**
 * To get the price for PRISM we should not call the same contract
 * as for the other tokens.
 * If the token is not prism, then we should always swap it for prism first.
 * @param {*} pair 
 * @returns 
 */
module.exports.swap = async (pair) => {
  let price = 0;

  if (pair === 'prism/ust') {
    price = await prismContract.execute(ONE_UNIT);
  } else {
    const tokens = pair.split('/');
    const swapTokens = [];
    swapTokens.push(tokens[0]);
    swapTokens.push('prism');
    swapTokens.push(tokens[1]);
    price = await swapContract.execute(ONE_UNIT, swapTokens);
  }

  return price / DECIMAL;
}

// Another way to get the price of LUNA:
// const exchangeRate = await terra.oracle.exchangeRate('uusd');
// const lunaValue = exchangeRate.amount;
// console.log(`1 LUNA:  ${lunaValue.toFixed(3)} UST`);
