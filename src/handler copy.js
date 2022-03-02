'use strict';
const axios = require('axios');

// How to get these values?
// Go to https://prismprotocol.app/swap and "inspect" the code and look at the request sent
const PRISM_QUERY = {'simulation':{'offer_asset':{'amount':'1000000','info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}}};
const XPRISM_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}}, {'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
const YLUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra17wkadg0tah554r35x6wvff0y5s7ve8npcjfuhz'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}}, {'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
const PLUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}}, {'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
const CLUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'cw20':'terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}}, {'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};
// const LUNA_QUERY = {'simulate_swap_operations':{'offer_amount':'1000000','operations':[{'prism_swap':{'offer_asset_info':{'native':'uluna'},'ask_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'}}},{'prism_swap':{'offer_asset_info':{'cw20':'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'},'ask_asset_info':{'native':'uusd'}}}]}};


const PRISM = 'terra19d2alknajcngdezrdhq40h6362k92kz23sz62u/store?query_msg=eyJzaW11bGF0aW9uIjp7Im9mZmVyX2Fzc2V0Ijp7ImFtb3VudCI6IjEwMDAwMDAiLCJpbmZvIjp7ImN3MjAiOiJ0ZXJyYTFkaDk0NzhrMnF2cWhxZWFqaG43NWEyYTdkc25mNzR5NXVrcmVndyJ9fX19';
const XPRISM = 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExMDQyd3pyd2cydWs2anF4am0zNHlzcXF1eXI5ZXNkZ201cXlzd3oifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0%3D';
const YLUNA = 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExN3drYWRnMHRhaDU1NHIzNXg2d3ZmZjB5NXM3dmU4bnBjamZ1aHoifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0=';
const PLUNA = 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExdGxnZWx1bHo5cGRraGxzNnVnbGZuNWxteGFyeDdmMmd4dGR6aDIifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0=';
const CLUNA = 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExM3phYWdycnJ4ajQ3cWp3Y3pzY3p1amx2bm5udGRlN2ZkdDBtYXUifSwiYXNrX2Fzc2V0X2luZm8iOnsiY3cyMCI6InRlcnJhMWRoOTQ3OGsycXZxaHFlYWpobjc1YTJhN2RzbmY3NHk1dWtyZWd3In19fSx7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlIjoidXVzZCJ9fX1dfX0=';
const LUNA = 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c/store?query_msg=eyJzaW11bGF0ZV9zd2FwX29wZXJhdGlvbnMiOnsib2ZmZXJfYW1vdW50IjoiMTAwMDAwMCIsIm9wZXJhdGlvbnMiOlt7InByaXNtX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJuYXRpdmUiOiJ1bHVuYSJ9LCJhc2tfYXNzZXRfaW5mbyI6eyJjdzIwIjoidGVycmExZGg5NDc4azJxdnFocWVhamhuNzVhMmE3ZHNuZjc0eTV1a3JlZ3cifX19LHsicHJpc21fc3dhcCI6eyJvZmZlcl9hc3NldF9pbmZvIjp7ImN3MjAiOiJ0ZXJyYTFkaDk0NzhrMnF2cWhxZWFqaG43NWEyYTdkc25mNzR5NXVrcmVndyJ9LCJhc2tfYXNzZXRfaW5mbyI6eyJuYXRpdmUiOiJ1dXNkIn19fV19fQ==';

async function sendRequest (tokenContract) {
  const response = await axios.get(`https://lcd.terra.dev/terra/wasm/v1beta1/contracts/${tokenContract}`);
  if (response.data) {
    return response.data;
  }
  return 0; // todo change this
}

module.exports.run = async (event, context) => {
  const time = new Date();
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
  const prismResponse = await sendRequest(PRISM);
  let amount = prismResponse.query_result.return_amount;
  const prismValue = parseFloat(amount) / Math.pow(10, amount.length);
  console.log(`PRISM:  ${prismValue}`);

  const xprismResponse = await sendRequest(XPRISM)
  amount = xprismResponse.query_result.amount;
  const xprismValue = parseFloat(amount) / Math.pow(10, amount.length);
  console.log(`xPRISM: ${xprismValue}`);

  const ylunaResponse = await sendRequest(YLUNA)
  amount = ylunaResponse.query_result.amount;
  const ylunaValue = parseFloat(amount) / Math.pow(10, amount.length - 2);
  console.log(`yLUNA: ${ylunaValue}`);

  const plunaResponse = await sendRequest(PLUNA)
  amount = plunaResponse.query_result.amount;
  const plunaValue = parseFloat(amount) / Math.pow(10, amount.length - 2);
  console.log(`pLUNA: ${plunaValue}`);
  
  const clunaResponse = await sendRequest(CLUNA)
  amount = clunaResponse.query_result.amount;
  const clunaValue = parseFloat(amount) / Math.pow(10, amount.length - 2);
  console.log(`cLUNA: ${clunaValue}`);

  const lunaResponse = await sendRequest(LUNA)
  amount = lunaResponse.query_result.amount;
  const lunaValue = parseFloat(amount) / Math.pow(10, amount.length - 2);
  console.log(`LUNA:  ${lunaValue}`);

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
