const { LCDClient } = require('@terra-money/terra.js');
const { config } = require('./config');

module.exports.terra = new LCDClient({
  URL: config.url,
  chainID: config.chainId,
});
