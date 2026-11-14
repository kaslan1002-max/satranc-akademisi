(function(g){
const START='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const N=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]],D=[[-1,-1],[-1,1],[1,-1],[1,1]],R=[[-1,0],[1,0],[0,-1],[0,1]];
const sq=n=>(8-n[1])*8+'abcdefgh'.indexOf(n[0]),nm=i=>'abcdefgh'[i&7]+(8-(i>>3)),isW=p=>p===p.toUpperCase();
function parse(fen,v='std'){const[p,t,c,e,h,f]=fen.split(' ');const b=[];for(const ch of p){if(ch=='/')continue;if(/\d/.test(ch))for(let i=0;i<+ch;i++)b.push(null);else b.push(ch)}
return{b,t,c:c==='-'?'':c,e:!e||e==='-'?-1:sq(e),h:+h||0,f:+f||1,v,k:{w:0,b:0}}}
function att(b,i,w){const r=i>>3,c=i&7,has=(rr,cc,s)=>{if(rr<0||rr>7||cc<0||cc>7)return false;const p=b[rr*8+cc];return p&&isW(p)===w&&s.includes(p.toLowerCase())};
for(const[a,d]of N)if(has(r+a,c+d,'n'))return true;
for(let a=-1;a<2;a++)for(let d=-1;d<2;d++)if((a||d)&&has(r+a,c+d,'k'))return true;
const pr=w?r+1:r-1;if(has(pr,c-1,'p')||has(pr,c+1,'p'))return true;
for(const[ds,t]of[[D,'b'],[R,'r']])for(const[a,d]of ds){let rr=r+a,cc=c+d;while(rr>=0&&rr<8&&cc>=0&&cc<8){const p=b[rr*8+cc];if(p){if(isW(p)===w&&(p.toLowerCase()==t||p.toLowerCase()=='q'))return true;break}rr+=a;cc+=d}}
return false}
function gen(s){const mv=[],w=s.t==='w',b=s.b;
for(let i=0;i<64;i++){const p=b[i];if(!p||isW(p)!==w)continue;const k=p.toLowerCase(),r=i>>3,c=i&7;
const add=t=>mv.push({f:i,t});
if(k=='p'){const dr=w?-1:1,st=w?6:1,pr=w?0:7;const push=t=>{if(t>>3==pr)for(const q of'qrbn')mv.push({f:i,t,p:q});else add(t)};
if(!b[i+dr*8]){push(i+dr*8);if((r==st||(s.v=='horde'&&w&&r==7))&&!b[i+dr*16])add(i+dr*16)}
for(const d of[-1,1]){const cc=c+d;if(cc<0||cc>7)continue;const t=i+dr*8+d;if((b[t]&&isW(b[t])!==w)||t==s.e)push(t)}}
else if(k=='n'||k=='k'){const L=k=='n'?N:[...D,...R];for(const[a,d]of L){const rr=r+a,cc=c+d;if(rr<0||rr>7||cc<0||cc>7)continue;const t=rr*8+cc;if(!b[t]||isW(b[t])!==w)add(t)}
if(k=='k'&&i==(w?60:4)&&!att(b,i,!w)){const o=!w;
if(s.c.includes(w?'K':'k')&&!b[i+1]&&!b[i+2]&&/r/i.test(b[i+3])&&!att(b,i+1,o)&&!att(b,i+2,o))add(i+2);
if(s.c.includes(w?'Q':'q')&&!b[i-1]&&!b[i-2]&&!b[i-3]&&/r/i.test(b[i-4])&&!att(b,i-1,o)&&!att(b,i-2,o))add(i-2)}}
else{const L=k=='b'?D:k=='r'?R:[...D,...R];for(const[a,d]of L){let rr=r+a,cc=c+d;while(rr>=0&&rr<8&&cc>=0&&cc<8){const t=rr*8+cc;if(b[t]){if(isW(b[t])!==w)add(t);break}add(t);rr+=a;cc+=d}}}}
return mv}
function make(s,m){const b=s.b.slice(),p=b[m.f],w=s.t==='w',k=p.toLowerCase();let c=s.c,e=-1,cap=b[m.t];
b[m.t]=m.p?(w?m.p.toUpperCase():m.p):p;b[m.f]=null;
if(k=='p'){if(m.t==s.e){b[m.t+(w?8:-8)]=null;cap=1}if(Math.abs(m.t-m.f)==16)e=(m.f+m.t)/2}
if(k=='k'){if(Math.abs(m.t-m.f)==2){const r=m.t>m.f?[m.f+3,m.f+1]:[m.f-4,m.f-1];b[r[1]]=b[r[0]];b[r[0]]=null}c=c.replace(w?/[KQ]/g:/[kq]/g,'')}
for(const[i,x]of[[0,'q'],[7,'k'],[56,'Q'],[63,'K']])if(m.f==i||m.t==i)c=c.replace(x,'');
if(s.v=='atomic'&&cap){b[m.t]=null;for(let a=-1;a<2;a++)for(let d=-1;d<2;d++){const rr=(m.t>>3)+a,cc=(m.t&7)+d;if(rr<0||rr>7||cc<0||cc>7)continue;const x=b[rr*8+cc];if(x&&x.toLowerCase()!='p')b[rr*8+cc]=null}}
const n={b,t:w?'b':'w',c,e,h:(k=='p'||cap)?0:s.h+1,f:s.f+(w?0:1),v:s.v,k:s.k};
if(s.v=='3c'){n.k={...s.k};if(inCheck(n))n.k[w?'w':'b']++}return n}
const kingAt=(s,w)=>s.b.findIndex(p=>p===(w?'K':'k'));
const inCheck=s=>{const w=s.t==='w',k=kingAt(s,w);return k>=0&&att(s.b,k,!w)};
function legal(s){const w=s.t==='w',v=s.v,ms=gen(s);
if(v=='anti'){const c=ms.filter(m=>s.b[m.t]||(s.b[m.f].toLowerCase()=='p'&&m.t==s.e));return c.length?c:ms}
return ms.filter(m=>{const n=make(s,m),k=kingAt(n,w);
if(v=='atomic'){if(s.b[m.t]&&s.b[m.f].toLowerCase()=='k')return false;if(k<0)return false;const o=kingAt(n,!w);if(o<0)return true;if(Math.abs((k>>3)-(o>>3))<2&&Math.abs((k&7)-(o&7))<2)return true;return!att(n.b,k,!w)}
if(v=='racing'){const o=kingAt(n,!w);return!att(n.b,k,!w)&&!att(n.b,o,w)}
return k<0||!att(n.b,k,!w)})}
function status(s,hist){const v=s.v,ms=legal(s),chk=v=='anti'?false:inCheck(s);
if(v=='anti'){const my=s.b.some(p=>p&&isW(p)==(s.t=='w'));if(!my||!ms.length)return'win:'+s.t;return s.h>=100?'50':'devam'}
if(v=='atomic')for(const w of[true,false])if(kingAt(s,w)<0)return'win:'+(w?'b':'w');
if(v=='3c'){if(s.k.w>=3)return'win:w';if(s.k.b>=3)return'win:b'}
if(v=='koth')for(const[c,x]of[['w','K'],['b','k']])if([27,28,35,36].includes(s.b.indexOf(x)))return'win:'+c;
if(v=='racing'&&s.t=='w'){const a=s.b.indexOf('K')<8,d=s.b.indexOf('k')<8;if(a&&d)return'yetersiz';if(a)return'win:w';if(d)return'win:b'}
if(v=='horde'&&!s.b.some(p=>p&&isW(p)))return'win:b';
if(!ms.length)return chk?'mat':'pat';if(s.h>=100)return'50';
const ps=s.b.filter(Boolean).map(p=>p.toLowerCase()).filter(p=>p!='k');
if(['std','960','koth','3c'].includes(v)&&(!ps.length||(ps.length==1&&'bn'.includes(ps[0]))))return'yetersiz';
if(hist){const key=x=>x.b.join('')+x.t+x.c+x.e;let n=0;for(const x of hist)if(key(x)==key(s))n++;if(n>=3)return'tekrar'}
return chk?'sah':'devam'}
const V={p:100,n:320,b:330,r:500,q:900,k:0};
function ev(s){let v=0;for(let i=0;i<64;i++){const p=s.b[i];if(!p)continue;const w=isW(p),k=p.toLowerCase(),r=i>>3,c=i&7,cd=Math.abs(3.5-c)+Math.abs(3.5-r);
const x=V[k]+(k=='k'?(s.v=='racing'?(7-r)*60:s.v=='koth'?(7-cd)*15:0):k=='p'?(w?6-r:r-1)*6+(7-cd)*2:(7-cd)*4);v+=w?x:-x}v=s.t==='w'?v:-v;return s.v=='anti'?-v:v}
let TL=0;
function srch(s,d,a,b){if(Date.now()>TL)throw 0;if(s.v=='atomic'&&kingAt(s,s.t=='w')<0)return-99999-d;const ms=legal(s);if(!ms.length)return s.v=='anti'?99999:inCheck(s)?-99999-d:0;if(!d)return ev(s);
ms.sort((x,y)=>(s.b[y.t]?V[s.b[y.t].toLowerCase()]:0)-(s.b[x.t]?V[s.b[x.t].toLowerCase()]:0));
for(const m of ms){const v=-srch(make(s,m),d-1,-b,-a);if(v>=b)return b;if(v>a)a=v}return a}
const LV=[null,{d:0},{d:1,n:80},{d:2,n:15},{d:3},{d:6,t:2500}];
function best(s,lv=3,fixed){const ms=legal(s);if(!ms.length)return null;const L=LV[lv];if(!L.d)return ms[Math.random()*ms.length|0];
TL=Date.now()+(L.t||60000);let res=ms[0];
for(let d=1;d<=(fixed||L.d);d++){let bm=null,ba=-1e9;try{for(const m of ms){const v=-srch(make(s,m),d-1,-1e9,-ba)+(L.n?Math.random()*L.n:0);if(v>ba){ba=v;bm=m}}}catch(e){break}res=bm;
ms.sort((x,y)=>x===bm?-1:y===bm?1:0)}return res}
function perft(s,d){if(!d)return 1;let n=0;for(const m of legal(s))n+=perft(make(s,m),d-1);return n}
function f960(){const a=Array(8).fill(null),pk=r=>r.splice(Math.random()*r.length|0,1)[0],fr=()=>[0,1,2,3,4,5,6,7].filter(i=>!a[i]);
a[pk([1,3,5,7])]='b';a[pk([0,2,4,6])]='b';a[pk(fr())]='q';a[pk(fr())]='n';a[pk(fr())]='n';const e=fr();a[e[0]]='r';a[e[1]]='k';a[e[2]]='r';
const r=a.join('');return r+'/pppppppp/8/8/8/8/PPPPPPPP/'+r.toUpperCase()+' w - - 0 1'}
const VF={std:START,koth:START,'3c':START,atomic:START,anti:START.replace(' KQkq',' -'),racing:'8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1',horde:'rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1'};
const startFen=v=>v=='960'?f960():VF[v];
const API={startFen,START,parse,make,legal,status,inCheck,best,perft,sq,nm,isW};
if(typeof module!=='undefined')module.exports=API;else g.Chess=API})(this);
