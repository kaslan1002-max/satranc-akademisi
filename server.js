const http=require('http'),fs=require('fs'),path=require('path'),{exec}=require('child_process');
const PUB=path.join(__dirname,'public'),T={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css'};
const srv=http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';
const f=path.join(PUB,path.normalize(u));if(!f.startsWith(PUB)){r.writeHead(403);return r.end()}
fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('Bulunamadı')}
r.writeHead(200,{'Content-Type':T[path.extname(f)]||'text/plain','Cache-Control':'no-store'});r.end(d)})});
let port=+process.env.PORT||4173;
srv.on('error',e=>{if(e.code==='EADDRINUSE'){console.log('Port '+port+' dolu, '+(port+1)+' deneniyor...');srv.listen(++port)}else throw e});
srv.on('listening',()=>{const u='http://localhost:'+port+'/';console.log('\n♞ Satranç Akademi çalışıyor: '+u+'\n(Kapatmak için Ctrl+C)');
if(!process.env.NO_OPEN)exec((process.platform=='win32'?'start "" ':process.platform=='darwin'?'open ':'xdg-open ')+u)});
srv.listen(port);
