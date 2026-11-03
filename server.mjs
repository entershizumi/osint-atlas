import {fileURLToPath} from 'node:url';
import {startAtlas} from './desktop/runtime.mjs';
const {server}=await startAtlas({assetsDir:fileURLToPath(new URL('./dist/client/',import.meta.url)),openBrowser:process.argv.includes('--open'),port:process.env.PORT?Number(process.env.PORT):4173});
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{server.close();server.closeAllConnections();});
