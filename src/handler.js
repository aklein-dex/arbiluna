'use strict';
// const axios = require('axios');
const { LCDClient } = require('@terra-money/terra.js');

// How to get these values?
// Go to https://prismprotocol.app/swap and "inspect" the code and look at the request sent
const PRISM_QUERY = {'simulation':{'offer_asset':{'amount':'1000000','info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}}};
const XPRISM_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}},{'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
const YLUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra17wkadg0tah554r35x6wvff0y5s7ve8npcjfuhz'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}},{'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
const PLUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}},{'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
const CLUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}},{'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
// const LUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'native':'uluna'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}},{'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};

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
  contractOther: 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c'
};

// the price receives from the API has no decimal
const DECIMAL = 1e6;

module.exports.run = async (event, context) => {
  const time = new Date();
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);

  const config = event.isDev ? dev : prod;

  const terra = new LCDClient({
    URL: config.url,
    chainID: config.chainId,
  });
 

  // PRISM
  const prismResponse = await terra.wasm.contractQuery(config.contractPrism, PRISM_QUERY);
  const prismValue = prismResponse.return_amount/DECIMAL;
  console.log(`PRISM:  ${prismValue}`);

  // xPRISM
  const xprismResponse = await terra.wasm.contractQuery(config.contractOther, XPRISM_QUERY);
  const xprismValue = xprismResponse.amount/DECIMAL;
  console.log(`xPRISM: ${xprismValue}`);

  // LUNA
  const exchangeRate = await terra.oracle.exchangeRate('uusd');
  const lunaValue = exchangeRate.amount;
  console.log(`LUNA:  ${lunaValue}`);

  // yLUNA
  const ylunaResponse = await terra.wasm.contractQuery(config.contractOther, YLUNA_QUERY);
  const ylunaValue = ylunaResponse.amount/DECIMAL;
  console.log(`yLUNA: ${ylunaValue}`);

  // pLUNA
  const plunaResponse = await terra.wasm.contractQuery(config.contractOther, PLUNA_QUERY);
  const plunaValue = plunaResponse.amount/DECIMAL;
  console.log(`pLUNA: ${plunaValue}`);

  // cLUNA
  const clunaResponse = await terra.wasm.contractQuery(config.contractOther, CLUNA_QUERY);
  const clunaValue = clunaResponse.amount/DECIMAL;
  console.log(`cLUNA: ${clunaValue}`);


  console.log('\nArbitrage opportunity:')
  if (prismValue > xprismValue) {
    console.log('  change your PRISM for XPRISM');
  } else {
    console.log('  change your xPRISM for PRISM');
  }

  if (lunaValue > clunaValue) {
    console.log('  change your LUNA for cLUNA');
  } else {
    console.log('  change your cLUNA for LUNA');
  }

  if (lunaValue > (ylunaValue + plunaValue)) {
    console.log('  change your LUNA for pLUNA and yLuna');
  } else {
    console.log('  change your pLUNA and yLuna for LUNA');
  }

  if (clunaValue > (ylunaValue + plunaValue)) {
    console.log('  change your cLUNA for pLUNA and yLuna');
  } else {
    console.log('  change your pLUNA and yLuna for cLUNA');
  }
};
