const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function createServer(){return http.createServer((req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const rel=name==='/'?'index.html':name.replace(/^\/+/,''),file=path.resolve(root,rel);
  if(!file.startsWith(root+path.sep)||rel.split(/[\\/]/).some(x=>x.startsWith('.')||x==='node_modules'||x==='private-assets')){res.writeHead(403);res.end();return;}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  const type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.mp4':'video/mp4','.vtt':'text/vtt; charset=utf-8'};
  res.setHeader('Content-Type',type[path.extname(file)]||'application/octet-stream');
  res.setHeader('X-Content-Type-Options','nosniff');fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
});}
if(require.main===module)createServer().listen(Number(process.env.PORT||8770),'127.0.0.1',()=>console.log('PaperPuppetKit: http://127.0.0.1:'+(process.env.PORT||8770)));
module.exports={createServer};
