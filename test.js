const C=require('./public/engine.js');
const t=(f,d,x)=>{const n=C.perft(C.parse(f),d);console.log(n===x?'OK':'HATA',f.slice(0,20),n,x)};
t(C.START,3,8902);
t('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',2,2039);
console.log(C.nm(C.best(C.parse(C.START),3).t));
for(const v of['std','koth','3c','anti','atomic','racing','horde','960']){let s=C.parse(C.startFen(v),v);const n=C.legal(s).length;let ok=true,g=0;
while(g++<30&&C.status(s)==='devam'||C.status(s)==='sah'){const m=C.best(s,2);if(!m){ok=false;break}s=C.make(s,m)}
console.log(v,'ilk hamle:',n,'oyun sonu:',C.status(s),g)}
