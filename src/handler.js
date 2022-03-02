'use strict';
const { LCDClient } = require('@terra-money/terra.js');

const dev = {
  url: 'https://bombay-lcd.terra.dev',
  chainId: 'bombay-12',
  contractPrism: '',
  contractOther: ''
};

const prod = {
  url: 'https://lcd.terra.dev',
  chainId: 'columbus-5',
  contractPrism: 'terra19d2alknajcngdezrdhq40h6362k92kz23sz62u',
  contractOther: 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c',
  cw20Prism: 'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw',
  cw20Xprism: 'terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz',
};

// the addresses of tokens
const CW20 = new Map();
CW20.set('prism', 'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw');
CW20.set('xprism', 'terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz');
CW20.set('yluna', 'terra17wkadg0tah554r35x6wvff0y5s7ve8npcjfuhz');
CW20.set('pluna', 'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2');
CW20.set('cluna', 'terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau');

// the price receives from the API has no decimal
const DECIMAL = 1e6;

// this is 1$
const ONE_DOLLAR = 1000000;

function getOperation(tokenOffer, tokenAsk) {
  const ask = tokenAsk === 'UST' ? { native: 'uusd' } : { cw20: CW20.get(tokenAsk) };
  return { prism_swap: { offer_asset_info: { cw20: CW20.get(tokenOffer) }, ask_asset_info: ask }};
}

function swapUstToPrism(amount) {
  return { simulation: { offer_asset: { amount: `${amount}`, info: { cw20: CW20.get('prism') }}}};
}

function swapUstToXprism(amount) {
  return { simulate_swap_operations: { offer_amount: `${amount}`, operations: [ getOperation('xprism', 'prism'), getOperation('prism', 'UST')] }};
}

function swapUstToYluna(amount) {
  return { simulate_swap_operations: { offer_amount: `${amount}`, operations: [ getOperation('yluna', 'prism'), getOperation('prism', 'UST')] }};
}

function swapUstToPluna(amount) {
  return { simulate_swap_operations: { offer_amount: `${amount}`, operations: [ getOperation('pluna', 'prism'), getOperation('prism', 'UST')] }};
}

function swapUstToCluna(amount) {
  return { simulate_swap_operations: { offer_amount: `${amount}`, operations: [ getOperation('cluna', 'prism'), getOperation('prism', 'UST')] }};
}


// find the % difference
function getArbitrage(tokenA, tokenB) {
  return ((tokenB - tokenA) * 100 / tokenA).toFixed(2);
}

module.exports.run = async (event, context) => {
  const time = new Date();
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);

  const config = event.isDev ? dev : prod;

  const terra = new LCDClient({
    URL: config.url,
    chainID: config.chainId,
  });
 

  // PRISM
  // const prismResponse = await terra.wasm.contractQuery(config.contractPrism, PRISM_QUERY);
  const prismResponse = await terra.wasm.contractQuery(config.contractPrism, swapUstToPrism(ONE_DOLLAR));
  const prismValue = prismResponse.return_amount/DECIMAL;
  console.log(`PRISM:  ${prismValue}`);

  // xPRISM
  // const xprismResponse = await terra.wasm.contractQuery(config.contractOther, XPRISM_QUERY);
  const xprismResponse = await terra.wasm.contractQuery(config.contractOther, swapUstToXprism(ONE_DOLLAR));
  const xprismValue = xprismResponse.amount/DECIMAL;
  console.log(`xPRISM: ${xprismValue}`);

  // LUNA
  const exchangeRate = await terra.oracle.exchangeRate('uusd');
  const lunaValue = exchangeRate.amount;
  console.log(`LUNA:  ${lunaValue}`);

  // yLUNA
  const ylunaResponse = await terra.wasm.contractQuery(config.contractOther, swapUstToYluna(ONE_DOLLAR));
  const ylunaValue = ylunaResponse.amount/DECIMAL;
  console.log(`yLUNA: ${ylunaValue}`);

  // pLUNA
  const plunaResponse = await terra.wasm.contractQuery(config.contractOther, swapUstToPluna(ONE_DOLLAR));
  const plunaValue = plunaResponse.amount/DECIMAL;
  console.log(`pLUNA: ${plunaValue}`);

  // cLUNA
  const clunaResponse = await terra.wasm.contractQuery(config.contractOther, swapUstToCluna(ONE_DOLLAR));
  const clunaValue = clunaResponse.amount/DECIMAL;
  console.log(`cLUNA: ${clunaValue}`);


  console.log('\nArbitrage opportunity:');

  const prismXprismArb = getArbitrage(prismValue, xprismValue);
  if (prismXprismArb < 0) {
    console.log(`  Arb = ${prismXprismArb * -1 }% xPRISM -> PRISM`);
  } else {
    console.log(`  Arb = ${prismXprismArb}% PRISM -> xPRISM`);
  }

  const lunaClunaArb = getArbitrage(lunaValue, clunaValue);
  if (lunaClunaArb < 0) {
    console.log(`  Arb = ${lunaClunaArb * -1 }% cLUNA -> LUNA`);
  } else {
    console.log(`  Arb = ${lunaClunaArb}% LUNA -> cLUNA`);
  }

  const lunaPYlunaArb = getArbitrage(lunaValue, (plunaValue + ylunaValue));
  if (lunaPYlunaArb < 0) {
    console.log(`  Arb = ${lunaPYlunaArb * -1 }% pLUNA + yLUNA -> LUNA`);
  } else {
    console.log(`  Arb = ${lunaPYlunaArb}% LUNA -> pLUNA + yLUNA`);
  }

  const clunaPYlunaArb = getArbitrage(clunaValue, (plunaValue + ylunaValue));
  if (clunaPYlunaArb < 0) {
    console.log(`  Arb = ${clunaPYlunaArb * -1 }% pLUNA + yLUNA -> cLUNA`);
  } else {
    console.log(`  Arb = ${clunaPYlunaArb}% cLUNA -> pLUNA + yLUNA`);
  }
};
