import assert from 'node:assert/strict';
import {test} from 'node:test';
import {startAtlas} from './desktop/runtime.mjs';
import http from 'node:http';
test('Local server serves real UI, JS and globe assets; refuses foreign host/origin and writes',async()=>{
 const {server,origin}=await startAtlas({assetsDir:'dist/client',port:0});
 try{for(const [url,type] of [['/','text/html'],['/editorial.js','text/javascript'],['/samples/atlas-qr.gif','image/gif'],['/gods-eye/','text/html'],['/cesium/Cesium.js','text/javascript']]){const response=await fetch(origin+url);assert.equal(response.status,200,url);assert(response.headers.get('Content-Type').includes(type),url);await response.body.cancel();}
 const index=await (await fetch(origin+'/')).text();assert(index.includes('scenario-company'));assert(index.includes('editorial.css'));
 assert.equal((await fetch(origin+'/',{method:'POST'})).status,405);
 assert.equal((await fetch(origin+'/',{headers:{Origin:'https://foreign.example'}})).status,403);
 const wrongHost=await new Promise((resolve,reject)=>{http.get(origin+'/',{headers:{Host:'foreign.example'}},response=>{response.resume();resolve(response.statusCode);}).on('error',reject);});assert.equal(wrongHost,403);
 const status=await (await fetch(origin+'/api/atlas/status')).json();assert.equal(status.configuredKeyProviders.length,0);
 const head=await fetch(origin+'/editorial.js',{method:'HEAD'});assert.equal(head.status,200);assert.equal((await head.text()).length,0);
 }finally{await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});}
});
test('Port collision chooses another loopback port instead of using another app',async()=>{
 const first=await startAtlas({assetsDir:'dist/client',port:0});const second=await startAtlas({assetsDir:'dist/client',port:Number(new URL(first.origin).port)});
 try{assert.notEqual(first.origin,second.origin);assert.equal(first.server.address().address,'127.0.0.1');assert.equal(second.server.address().address,'127.0.0.1');}finally{for(const {server} of [first,second]){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}}
});
