import {cp,mkdir,rename,rm,stat,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),dist=path.join(root,'dist');
if(path.dirname(dist)!==root||path.basename(dist)!=='dist')throw Error('Unsafe build directory');
await stat(path.join(root,'vendor-build/gods-eye/index.html'));
await rm(dist,{recursive:true,force:true});
await mkdir(path.join(dist,'client'),{recursive:true});await mkdir(path.join(dist,'server'),{recursive:true});
await cp(path.join(root,'web'),path.join(dist,'client'),{recursive:true});
await cp(path.join(root,'vendor-build/gods-eye'),path.join(dist,'client/gods-eye'),{recursive:true});
try{await rename(path.join(dist,'client/gods-eye/gods-eye/cesium'),path.join(dist,'client/gods-eye/cesium'));await rm(path.join(dist,'client/gods-eye/gods-eye'),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
for(const name of ['LICENSE','DATA_SOURCES.md','THIRD_PARTY_NOTICES.md'])await cp(path.join(root,'apps/gods-eye',name),path.join(dist,'client/gods-eye',name==='LICENSE'?'LICENSE.txt':name));
await cp(path.join(root,'worker/index.js'),path.join(dist,'server/index.js'));
await writeFile(path.join(dist,'server/wrangler.json'),JSON.stringify({name:'osint-atlas',main:'index.js',compatibility_date:'2026-11-03',assets:{directory:'../client',binding:'ASSETS',run_worker_first:true,not_found_handling:'none'}},null,2)+'\n');
console.log('Atlas: dist/client + dist/server ready.');
