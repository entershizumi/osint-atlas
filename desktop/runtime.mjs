import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import * as sea from 'node:sea';
import {spawn} from 'node:child_process';
import worker from '../worker/index.js';
export const version='1.2.0';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.geojson':'application/geo+json','.geojsonl':'application/geo+json-seq','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.wasm':'application/wasm','.glb':'model/gltf-binary','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.xml':'application/xml','.webmanifest':'application/manifest+json','.ico':'image/x-icon','.woff2':'font/woff2'};
export async function startAtlas({assetsDir,port=4173,openBrowser=false}={}){
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('Invalid port');
 const embedded=sea.isSea();const base=assetsDir&&path.resolve(assetsDir);
 if(!embedded&&!base)throw Error('Assets directory is required outside the executable');
 const env={ASSETS:{async fetch(req){try{let pathname=decodeURIComponent(new URL(req.url).pathname);if(pathname.includes('\0')||pathname.includes('\\'))return new Response('Forbidden',{status:403});let name=path.posix.normalize('/'+pathname).slice(1);if(!name||name.endsWith('/'))name+='index.html';let data;
  if(embedded){data=Buffer.from(sea.getAsset('client/'+name));}
  else{let file=path.resolve(base,name);if(!file.startsWith(base+path.sep))return new Response('Forbidden',{status:403});if((await stat(file)).isDirectory())file=path.join(file,'index.html');data=await readFile(file);name=file;}
  return new Response(data,{headers:{'Content-Type':types[path.extname(name).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}});
 }catch{return new Response('Not found',{status:404});}}}};
 let origin;
 const server=http.createServer(async(req,res)=>{try{
  if(!req.url?.startsWith('/')||req.url.startsWith('//')||req.headers.host!==new URL(origin).host){res.writeHead(403);res.end('Invalid local host');return;}
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{Allow:'GET, HEAD'});res.end('Read only');return;}
  if(req.headers.origin&&req.headers.origin!==origin){res.writeHead(403);res.end('Cross-origin request refused');return;}
  const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value);
  const response=await worker.fetch(new Request(origin+req.url,{method:req.method,headers}),env,{});
  res.writeHead(response.status,Object.fromEntries(response.headers));if(req.method==='HEAD'){await response.body?.cancel();res.end();}else res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500,{'Content-Type':'text/plain'});res.end('Atlas could not process this request.');}});
 async function listen(selected){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(selected,'127.0.0.1',()=>{server.removeListener('error',reject);resolve();});});}
 try{await listen(port);}catch(error){if(error.code!=='EADDRINUSE'||port===0)throw error;await listen(0);}
 origin='http://127.0.0.1:'+server.address().port;
 console.log(`OSINT Atlas ${version}\nLocal: ${origin}/#catalog\nOnly this computer: 127.0.0.1\nPress Ctrl+C to stop Atlas. External data sources require internet.`);
 if(openBrowser&&process.platform==='win32'){const browser=spawn('rundll32.exe',['url.dll,FileProtocolHandler',origin+'/#catalog'],{windowsHide:true,stdio:'ignore',detached:true});browser.on('error',()=>console.log('Open the Local URL in your browser.'));browser.unref();}
 return {server,origin};
}
