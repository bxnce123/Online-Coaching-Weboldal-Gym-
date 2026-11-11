/* Termékek – ugyanazok az árak és nevek, mint a teljes oldal katalógusában (db/seeds/products.js).
   Az alap weboldalon a kosár ebből számol (a böngészőben, localStorage-ban). */
window.PRODUCTS = {
  'online-coaching':            { name: 'Online coaching (havi)', price: 39900, max: 1 },
  'szemelyre-szabott-edzesterv':{ name: 'Személyre szabott edzésterv (havi)', price: 19900, max: 1 },
  'szemelyre-szabott-etrend':   { name: 'Személyre szabott étrend', price: 24900, max: 1 },
  'szemelyi-edzes':             { name: 'Személyi edzés (alkalom)', price: 7000, max: 10 },
  'technika-ellenorzes':        { name: 'Technika-ellenőrzés (videó alapján)', price: 4990, max: 5 },
  'fitt-receptfuzet':           { name: 'Fitt receptfüzet', price: 4990, max: 1 },
  'ppl-terv':                   { name: 'Push-Pull-Legs (PPL) edzésterv', price: 8999, max: 1 },
  'felsotest-alsotest-terv':    { name: 'Felsőtest-Alsótest edzésterv', price: 8999, max: 1 },
  'full-body-terv':             { name: 'Full Body edzésterv', price: 8999, max: 1 },
  'bro-split-terv':             { name: 'Testrész-split edzésterv', price: 8999, max: 1 },
  'arnold-split-terv':          { name: 'Arnold split edzésterv', price: 8999, max: 1 },
  'kalisztenika-terv':          { name: 'Saját testsúlyos (kalisztenika) edzésterv', price: 8999, max: 1 },
  'ppl-etrend-csomag':          { name: 'Push-Pull-Legs + Étrend csomag', price: 25999, max: 1 },
  'upper-lower-etrend-csomag':  { name: 'Upper Lower + Étrend csomag', price: 20999, max: 1 }
};
