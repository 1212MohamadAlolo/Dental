/* Run from the directory containing site/. Requires playwright and Chromium. */
const {chromium}=require('playwright'),{spawn}=require('node:child_process'),fs=require('node:fs'),assert=require('node:assert/strict');
const executablePath=process.env.CHROMIUM_PATH||'/tmp/chromium',base='http://127.0.0.1:8013/site/';
(async()=>{const server=spawn('python3',['-m','http.server','8013'],{stdio:'ignore'});await new Promise(r=>setTimeout(r,400));let browser;const report={date:new Date().toISOString(),layouts:[],flows:[],errors:[]};try{
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-gpu']});
 for(const [width,height] of [[320,568],[360,640],[390,844],[430,932],[768,1024],[1440,900]]){
  const context=await browser.newContext({viewport:{width,height}}),p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));
  await p.goto(base+'adaptive.html?unit=page-07');await p.evaluate(()=>document.fonts.ready);
  async function layout(name){const info=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bodyOverflow:document.body.scrollWidth>innerWidth,footer:document.querySelector('.learn-footer')?.getBoundingClientRect().bottom,font:getComputedStyle(document.body).fontFamily}));assert.equal(info.overflow,false,`${width} ${name} horizontal overflow`);assert.equal(info.bodyOverflow,false);if(info.footer)assert.ok(info.footer<=height+1);report.layouts.push({width,height,name,...info});}
  await layout('dashboard');await p.click('[data-mode="standard"]');await layout('learn');await p.click('#primaryAction');await layout('recall');await p.fill('#recallText','إجابة تجريبية');await p.click('#primaryAction');await p.click('#selfNo');await layout('recall-feedback');
  await p.reload();assert.ok(await p.locator('#resume').count());await p.click('#resume');assert.ok(await p.locator('.learn-feedback').count());await p.click('#primaryAction');
  assert.ok(await p.locator('[data-option]').count());
  await p.locator('[data-option]').first().click();await p.click('[data-confidence="unsure"]');await p.click('#hintButton');await p.click('#primaryAction');await layout('answer-feedback');await p.click('#themeButton');await layout('dark-feedback');
  if(width===390){await p.screenshot({path:'qa/mobile-feedback-dark.png'});await p.click('#pause');await p.screenshot({path:'qa/mobile-dashboard-dark.png',fullPage:true});await p.click('#themeButton');await p.screenshot({path:'qa/mobile-dashboard.png',fullPage:true});}
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));await p.goto(base+'adaptive.html?unit=page-07');await p.click('[data-mode="deep"]');let steps=0;
 while(await p.locator('#primaryAction').count()){
  assert.ok(steps++<100,'session terminates');
  const step=await p.evaluate(()=>JSON.parse(localStorage.getItem(AdaptiveEngine.KEY)).session);
  const current=step.steps[step.index];
  if(current.kind==='learn'||current.checked){await p.click('#primaryAction');continue;}
  const q=await p.evaluate(id=>AdaptiveBank.questions.find(q=>q.id===id),current.questionId);
  if(q.type==='recall'){if(!current.revealed)await p.click('#primaryAction');await p.click('#selfYes');continue;}
  if(q.options)await p.click(`[data-option="${q.correctAnswer}"]`);
  else if(q.type==='fill')await p.fill('#answerText',q.correctAnswer[0]);
  else if(q.type==='matching'){for(const [k,v] of Object.entries(q.correctAnswer))await p.locator('[data-match]').filter({hasNotText:'zzzz'}).evaluateAll((els,{k,v})=>{const x=els.find(x=>x.dataset.match===k);x.value=v;x.dispatchEvent(new Event('change'));},{k,v});}
  else if(q.type==='ordering'){for(let i=0;i<q.correctAnswer.length;i++){let arr=await p.locator('.learn-order li span').allTextContents();let at=arr.findIndex(x=>x.includes(q.correctAnswer[i]));while(at>i){await p.click(`[data-up="${at}"]`);at--;}}}
  await p.click('#primaryAction');
 }
 assert.ok(await p.locator('#returnDashboard').count());report.flows.push({name:'deep practice full completion',steps});await p.screenshot({path:'qa/mobile-complete.png'});await p.click('#returnDashboard');
 // Every question interaction type independently, with a genuine UI submit.
 for(const type of ['mcq','true-false','fill','matching','ordering','recall']){
  const bank=JSON.parse(fs.readFileSync('site/data/adaptive-bank.json')),q0=bank.questions.find(q=>q.type===type),engine=require('../adaptive/engine.js'),seed=engine.empty();seed.session={id:'type-'+type,mode:'test',steps:[{kind:'question',questionId:q0.id,conceptId:q0.conceptId,reason:'QA'}],index:0,used:[q0.id],retries:{},done:false};await p.addInitScript(({key,seed})=>localStorage.setItem(key,JSON.stringify(seed)),{key:engine.KEY,seed});
  await p.reload();await p.click('#resume');
  if(type==='recall'){await p.click('#primaryAction');await p.click('#selfYes');}
  else {const q=await p.evaluate(type=>AdaptiveBank.questions.find(q=>q.type===type),type);if(q.options)await p.click(`[data-option="${q.correctAnswer}"]`);if(type==='fill')await p.fill('#answerText',q.correctAnswer[0]);if(type==='matching')for(const [k,v] of Object.entries(q.correctAnswer))await p.locator(`[data-match="${k}"]`).selectOption(v);if(type==='ordering')for(let i=0;i<q.correctAnswer.length;i++){let arr=await p.locator('.learn-order li span').allTextContents();let at=arr.findIndex(x=>x.includes(q.correctAnswer[i]));while(at>i){await p.click(`[data-up="${at}"]`);at--;}}await p.click('#primaryAction');}
  assert.equal(await p.locator('.learn-feedback.wrong').count(),0);report.flows.push({name:'interaction '+type,result:'pass'});
 }
 // Legacy features and navigation smoke checks, all kept online and offline-capable local assets.
 for(const page of ['index.html','learning-map.html','review.html','search.html','saved.html','comprehensive-exam.html','page-07.html','lesson.html?unit=page-01&lesson=page-01-lesson-01']){await p.goto(base+page);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'legacy overflow '+page);report.flows.push({name:'legacy '+page,result:'pass'});}
 await p.goto(base+'adaptive.html');await p.addInitScript(()=>localStorage.setItem('oral-health-adaptive-v1','{corrupt'));await p.reload();assert.ok((await p.locator('#storageWarning').textContent()).length>0);assert.equal(await p.evaluate(()=>localStorage.getItem(AdaptiveEngine.KEY)),'{corrupt');report.flows.push({name:'corrupt storage retained and warning visible',result:'pass'});
 await context.close();assert.deepEqual(report.errors,[]);fs.writeFileSync('qa/browser-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({layouts:report.layouts.length,flows:report.flows.length,errors:report.errors}));
 }finally{await browser?.close();server.kill();}})().catch(e=>{console.error(e);process.exit(1)});
