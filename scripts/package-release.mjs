import {readFile,writeFile,mkdir,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {zipSync,strToU8} from '../web/vendor/fflate.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const release=path.join(root,'release');await mkdir(release,{recursive:true});
const skip=new Set(['.git','.openai','.sites-runtime','node_modules','dist','.build','release','.DS_Store']);
const source={};async function walk(dir,prefix){for(const entry of await readdir(dir,{withFileTypes:true})){if(skip.has(entry.name)||/^\.env(?:\.|$)/.test(entry.name)||entry.name.endsWith('.log'))continue;const relative=prefix+entry.name,file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file,relative+'/');else if(entry.isFile())source['osint-atlas/'+relative]=new Uint8Array(await readFile(file));}}
await walk(root,'');await writeFile(path.join(release,'Atlas-GitHub-Source.zip'),zipSync(source,{level:6}));
const windows={};for(const name of ['Atlas.exe','NODE-LICENSE.txt','THIRD_PARTY_NOTICES.md','README.md'])windows[name]=new Uint8Array(await readFile(path.join(name==='Atlas.exe'?release:root,name)));
windows['START-HERE.txt']=strToU8('OSINT Atlas 1.2.0 / Windows x64\r\n\r\nРаспакуйте ZIP и запустите Atlas.exe. Установка Node.js не нужна.\r\nОткроется локальный Atlas в браузере. Окно Atlas должно оставаться открытым.\r\nЗакройте окно или нажмите Ctrl+C, чтобы остановить сервер.\r\n\r\nИнтернет нужен для внешних поисковиков, карт и публичных API.\r\nМетаданные, QR и расчёт солнца обрабатываются локально.\r\nEXE не подписан сертификатом издателя.\r\n\r\nAtlas.exe --no-open   запуск без открытия браузера\r\nAtlas.exe --port=4180 другой порт\r\n');
await writeFile(path.join(release,'Atlas-Windows-x64.zip'),zipSync(windows,{level:6}));
const files=['Atlas.exe','Atlas-Windows-x64.zip','Atlas-GitHub-Source.zip'];const sums=[];for(const name of files){const data=await readFile(path.join(release,name));sums.push(createHash('sha256').update(data).digest('hex')+'  '+name);console.log(name+': '+(data.length/1048576).toFixed(1)+' MiB');}
await writeFile(path.join(release,'SHA256SUMS.txt'),sums.join('\n')+'\n');console.log('Release archives and SHA256SUMS.txt ready.');
