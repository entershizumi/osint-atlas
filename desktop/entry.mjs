import {startAtlas,version} from './runtime.mjs';
if(process.argv.includes('--version')){console.log('OSINT Atlas '+version);process.exit(0);}
if(process.argv.includes('--help')){console.log('Atlas.exe [--no-open] [--port=4173]\nRuns only on 127.0.0.1. Close this window or press Ctrl+C to stop.');process.exit(0);}
const portArg=process.argv.find(v=>v.startsWith('--port='));
startAtlas({port:portArg?Number(portArg.slice(7)):4173,openBrowser:!process.argv.includes('--no-open')}).then(({server})=>{for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{server.close();server.closeAllConnections();});}).catch(error=>{console.error('Atlas could not start: '+error.message);process.exitCode=1;});
