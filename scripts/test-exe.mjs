import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
const exe=fileURLToPath(new URL('../release/Atlas.exe',import.meta.url));
const child=spawn(exe,['--no-open','--port=0'],{cwd:tmpdir(),windowsHide:true,stdio:['ignore','pipe','pipe']});
let output='',error='';child.stderr.on('data',d=>error+=d);
try{
 const origin=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('EXE startup timed out: '+error)),20000);child.on('error',reject);child.on('exit',code=>reject(Error('EXE exited '+code+': '+error)));child.stdout.on('data',d=>{output+=d;const match=output.match(/Local: (http:\/\/127\.0\.0\.1:\d+)/);if(match){clearTimeout(timer);resolve(match[1]);}});});
 for(const url of ['/','/editorial.js','/metadata-worker.js','/vendor/jsqr.js','/samples/atlas-qr.gif','/gods-eye/','/cesium/Cesium.js','/models/c172.glb']){const res=await fetch(origin+url);assert.equal(res.status,200,url);assert(Number(res.headers.get('content-length')||1)>0);await res.body.cancel();}
 const html=await (await fetch(origin+'/')).text();assert(html.includes('Увидеть'));assert(html.includes('scenario-company'));assert(html.includes('editorial.css'));
 const missing=await fetch(origin+'/not-present-atlas-file');assert.equal(missing.status,404);
 console.log('EXE smoke test passed: starts outside source folder; 8 real embedded assets, globe aliases and missing file handling verified.');
}finally{child.kill();}
