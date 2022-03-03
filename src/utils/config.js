
// the addresses of tokens
const CW20 = new Map();
CW20.set('prism', { cw20: 'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw'});
CW20.set('xprism', { cw20: 'terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz'});
CW20.set('yluna', { cw20: 'terra17wkadg0tah554r35x6wvff0y5s7ve8npcjfuhz'});
CW20.set('pluna', { cw20: 'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2'});
CW20.set('cluna', { cw20: 'terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau'});
CW20.set('ust', { native: 'uusd' });
CW20.set('luna', { native: 'uluna' });

// in test
// url: 'https://bombay-lcd.terra.dev',
// chainId: 'bombay-12',

module.exports.config = {
  url: 'https://lcd.terra.dev',
  chainId: 'columbus-5',
  contractPrism: 'terra19d2alknajcngdezrdhq40h6362k92kz23sz62u',
  contractSwap: 'terra1yrc0zpwhuqezfnhdgvvh7vs5svqtgyl7pu3n6c',
  cw20: CW20,
};
