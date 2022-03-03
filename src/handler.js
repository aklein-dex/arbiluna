'use strict';
const prismProtocol = require('./prismProtocol/prismProtocol');

module.exports.run = async (event, context) => {
  const time = new Date();
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);

  const prism = await prismProtocol.swap('prism/ust');
  const xprism = await prismProtocol.swap('xprism/ust');
  const luna = await prismProtocol.swap('luna/ust');
  const yluna = await prismProtocol.swap('yluna/ust');
  const pluna = await prismProtocol.swap('pluna/ust');
  const cluna = await prismProtocol.swap('cluna/ust');

  console.log(`1 PRISM:  ${prism} UST`);
  console.log(`1 xPRISM: ${xprism} UST`);
  console.log(`1 LUNA:   ${luna} UST`);
  console.log(`1 yLUNA:  ${yluna} UST`);
  console.log(`1 pLUNA:  ${pluna} UST`);
  console.log(`1 cLUNA:  ${cluna} UST`);

  const ccluna = await prismProtocol.swap('luna/cluna');
  console.log(`1 LUNA = ${ccluna} cLUNA`);
};
