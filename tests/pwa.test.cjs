const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),scope='https://example.test/Dental/',events={},stores=new Map();let offline=false,failImages=false;
const cacheApi={async open(name){if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return {async match(req){return m.get(typeof req==='string'?req:req.url)?.clone()},async put(req,res){m.set(typeof req==='string'?req:req.url,res.clone())},async keys(){return [...m.keys()].map(u=>new Request(u))},async add(req){const res=await fetchLocal(req);if(!res.ok)throw Error('download');await this.put(req,res)}}},async keys(){return [...stores.keys()]},async delete(key){return stores.delete(key)}};
async function fetchLocal(req){if(offline)throw Error('offline');const u=new URL(typeof req==='string'?req:req.url);if(failImages&&u.pathname.endsWith('.webp'))throw Error('image network failure');const p=path.join(root,u.pathname.slice('/Dental/'.length));return fs.existsSync(p)&&fs.statSync(p).isFile()?new Response(fs.readFileSync(p)):new Response('missing',{status:404})}
const ctx={URL,Request,Response,Set,location:new URL(scope),caches:cacheApi,fetch:fetchLocal,self:{registration:{scope},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(name,fn)=>events[name]=fn}};
vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),ctx);
async function lifecycle(name){let job;events[name]({waitUntil:p=>job=p});await job}
async function message(type){let job;const messages=[];events.message({data:{type},ports:[{postMessage:m=>messages.push(m)}],waitUntil:p=>job=p});await job;return messages.at(-1)}
async function request(p,mode='navigate'){let result;events.fetch({request:{url:new URL(p,scope).href,method:'GET',mode},respondWith:p=>result=p});return result}
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest')));assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');for(const i of manifest.icons)assert.ok(fs.existsSync(path.join(root,i.src)));
 await lifecycle('install');await lifecycle('activate');assert.equal((await message('STATUS')).complete,false);
 failImages=true;assert.equal((await message('DOWNLOAD')).ok,false);assert.equal((await message('STATUS')).complete,false);failImages=false;
 assert.equal((await message('DOWNLOAD')).ok,true);assert.equal((await message('STATUS')).complete,true);
 offline=true;assert.equal((await request('./')).status,200);assert.match(await (await request('lesson.html?unit=page-01&lesson=test')).text(),/html/);assert.equal((await request('adaptive.html')).status,200);
 assert.equal((await request('source/missing.pdf')).status,503);assert.equal(await request('https://example.test/Other/'),undefined);
 const bank=await request('data/adaptive-bank.json','cors');assert.equal((await bank.json()).questions.length,173);
 assert.equal((await request('course-path-data.js','cors')).status,200);
 console.log('PASS: manifest/icons, install, failed-download recovery, complete offline pack, subpath scope, query URLs, both question banks, missing-page fallback');
})().catch(e=>{console.error(e);process.exit(1)});
