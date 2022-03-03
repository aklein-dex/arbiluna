const { config } = require('../utils/config');
const { terra } = require('../utils/terra');

// Example of param to swap 1 xPRISM and get UST
// {
//   simulate_swap_operations: {
//     offer_amount: "1000000",
//     operations: [
//       {
//         prism_swap: {
//           offer_asset_info: {
//             cw20: "terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz",
//           },
//           ask_asset_info: {
//             cw20: "terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw",
//           },
//         },
//       },
//       {
//         prism_swap: {
//           offer_asset_info: {
//             cw20: "terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw",
//           },
//           ask_asset_info: { native: "uusd" },
//         },
//       },
//     ],
//   },
// }

function getOperation(tokenOffer, tokenAsk) {
  return {
    prism_swap: { 
      offer_asset_info: config.cw20.get(tokenOffer), 
      ask_asset_info: config.cw20.get(tokenAsk)
    }
  };
}

// xprism, prism
// ulunam prism cluna
function createSwapOperations(tokens) {
  const operations = [];
  tokens.forEach((token, i) => {
    if (i === tokens.length - 1) {
      return;
    }

    const op = getOperation(tokens[i], tokens[i + 1]);
    operations.push(op);
  });
  return operations;
}

module.exports.execute = async (amount, tokens) => {
  const param = {
    simulate_swap_operations: {
      offer_amount: `${amount}`,
      operations: createSwapOperations(tokens)
    }
  };
  // console.log(JSON.stringify(param));
  const response = await terra.wasm.contractQuery(config.contractSwap, param);
  return response.amount;
}
