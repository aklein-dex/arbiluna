const { config } = require('../utils/config');
const { terra } = require('../utils/terra');

// Example of parameter to get PRISM value:
// {
//   simulation: {
//     offer_asset: {
//       amount: "1000000",
//       info: { cw20: "terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw" },
//     },
//   },
// };

module.exports.execute = async (amount) => {
  const param = {
    simulation: { 
      offer_asset: { 
        amount: `${amount}`, 
        info: config.cw20.get('prism')
      }
    }
  };

  const response = await terra.wasm.contractQuery(config.contractPrism, param);
  return response.return_amount;
}
