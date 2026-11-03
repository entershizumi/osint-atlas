import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {tools,review,categories} from './web/data.js';
assert.equal(tools.length,20);assert.equal(review.length,19);
assert.equal(new Set(tools.map(t=>t.id)).size,tools.length);
for(const t of tools){assert(categories.some(c=>c[0]===t.category));for(const k of ['name','description','evidence','limit','kind','example','checkedAt'])assert(t[k]?.length,`${t.id}: ${k}`);for(const k of ['url','test'])assert.equal(new URL(t[k]).protocol,'https:');assert.match(t.checkedAt,/^\d{4}-\d{2}-\d{2}$/);}
for(const t of review){assert(t.reason);assert(!tools.some(a=>a.name===t.name));}
const html=await readFile('web/index.html','utf8');const app=await readFile('web/app.js','utf8');
for(const match of app.matchAll(/\$\('#([\w-]+)'\)/g)){if(['clear-filters'].includes(match[1]))continue;assert(html.includes(`id="${match[1]}"`),`Missing element ${match[1]}`);}
console.log(`Passed: ${tools.length} resource records, ${review.length} review records, unique IDs, source URLs, categories, dates and UI element references.`);
