/* Deterministic learning rules. No medical inference or opaque learner model. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AdaptiveEngine=api;})(typeof window==='object'?window:globalThis,function(){
'use strict';
const KEY='oral-health-adaptive-v1',DAY=86400000;
const empty=()=>({version:1,records:{},events:[],session:null});
const fresh=()=>({score:0,attempts:0,errors:0,unresolved:0,streak:0,interval:0,due:0,lastReview:0,lastQuestion:null,objectiveDays:[],types:[],qualifiedDays:[],verifiedQuestions:[],lastQualified:0,reason:'مفهوم جديد',lastMistake:null});
function valid(s){
 if(!s||s.version!==1||!s.records||typeof s.records!=='object'||Array.isArray(s.records)||!Array.isArray(s.events)||s.events.length>2000)return false;
 if(!Object.values(s.records).every(r=>r&&Number.isFinite(r.score)&&r.score>=0&&r.score<=100&&['attempts','errors','unresolved','due','interval'].every(k=>Number.isFinite(r[k])&&r[k]>=0)&&['objectiveDays','types','qualifiedDays'].every(k=>Array.isArray(r[k])&&r[k].every(x=>typeof x==='string'))))return false;
 if(!s.events.every(e=>e&&typeof e.id==='string'&&Number.isFinite(e.at)))return false;
 if(s.session!==null){const x=s.session;if(!x||typeof x.id!=='string'||!Array.isArray(x.steps)||x.steps.length>200||!Number.isInteger(x.index)||x.index<0||x.index>x.steps.length||!Array.isArray(x.used)||!x.retries||!x.steps.every(t=>t&&typeof t.conceptId==='string'&&['learn','question'].includes(t.kind)&&(t.kind!=='question'||typeof t.questionId==='string')))return false;}
 return true;
}
function load(storage){try{const raw=storage.getItem(KEY);if(!raw)return {state:empty(),warning:''};const s=JSON.parse(raw);if(!valid(s))throw Error('schema');return {state:s,warning:''};}catch(e){return {state:empty(),warning:'تعذر قراءة التقدم المحفوظ. لم نكتب فوقه. صدّر بياناتك أو أعد ضبط التدريب من الإعدادات.'};}}
function save(storage,state){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch(e){return false;}}
function record(state,id){return state.records[id]||fresh();}
function status(r){if(!r.attempts)return 'new';if(r.unresolved||r.score<30)return r.errors?'weak':'learning';if(r.score<55)return 'learning';if(r.score<80)return 'improving';if(r.score>=90&&r.objectiveDays.length>=3&&(r.verifiedQuestions||[]).length>=2&&!r.unresolved)return 'mastered';return 'strong';}
function grade(q,response){if(q.type==='recall')return null;if(q.type==='mcq'||q.type==='true-false')return Number(response)===q.correctAnswer;if(q.type==='fill')return q.correctAnswer.some(v=>normalize(v)===normalize(response));if(q.type==='ordering')return JSON.stringify(q.correctAnswer)===JSON.stringify(response);if(q.type==='matching')return Object.entries(q.correctAnswer).every(([k,v])=>response&&response[k]===v);return false;}
function normalize(s){return String(s??'').trim().toLowerCase().replace(/[\u064B-\u065F\u0670ـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/\s+/g,' ');}
function answer(state,q,{correct,hint=false,confidence='sure',self=false,latency=0,eventId},now=Date.now()){
 if(!eventId)throw Error('eventId required');if(state.events.some(e=>e.id===eventId))return record(state,q.conceptId);
 const r={...fresh(),...record(state,q.conceptId)};const day=new Date(now).toISOString().slice(0,10),objective=!self&&q.type!=='recall';
 r.attempts++;r.lastReview=now;r.lastQuestion=q.id;
 const qualified=objective&&correct&&!hint&&confidence==='sure';const spaced=!r.lastQualified||now-r.lastQualified>=20*3600000;
 if(!correct){r.errors++;r.unresolved++;r.streak=0;r.score=Math.max(0,r.score-25);r.interval=10/1440;r.reason='إجابة غير صحيحة؛ نعيد الفكرة بصيغة أخرى ثم نراجعها قريبًا.';r.lastMistake={questionId:q.id,type:self?'self-reported':'incorrect-answer',at:now,misconception:q.misconceptionTarget||null};}
 else if(self){r.score=r.score<55?Math.min(55,r.score+3):r.score;if(!r.due)r.interval=1/24;r.reason='استرجاع ذاتي؛ يلزم سؤال موضوعي لتأكيد الإتقان.';}
 else if(hint||confidence==='unsure'){r.score=Math.min(79,r.score+6);r.interval=1;r.streak=0;r.reason=hint?'إجابة بمساعدة؛ مراجعة غدًا قبل توسيع الفاصل.':'إجابة صحيحة مع تردد؛ مراجعة غدًا لتثبيت الفكرة.';}
 else {
  if(!r.qualifiedDays.includes(day)){r.score=Math.min(100,r.score+24);r.qualifiedDays=[...r.qualifiedDays,day].slice(-90);}
  if(spaced){r.streak++;r.interval=r.streak===1?1:r.streak===2?3:Math.min(60,Math.max(7,Math.round(r.interval*2)));r.lastQualified=now;r.objectiveDays=[...new Set([...r.objectiveDays,day])].slice(-90);}
  r.types=[...new Set([...r.types,q.type])];r.verifiedQuestions=[...new Set([...(r.verifiedQuestions||[]),q.id])];r.unresolved=Math.max(0,r.unresolved-1);r.reason=spaced?'إجابة مستقلة صحيحة بعد فاصل زمني؛ توسعت مدة المراجعة.':'نجاح إضافي في الجلسة؛ لا يرفع الإتقان بتكرار النقر.';
 }
 // Do not let rapid same-day retries push the due date indefinitely.
 if(!correct||(self&&!r.due)||(!self&&(hint||confidence==='unsure'||spaced))||!r.due)r.due=now+r.interval*DAY;
 state.records[q.conceptId]=r;
 state.events.push({id:eventId,questionId:q.id,conceptId:q.conceptId,correct:!!correct,hint,self,confidence,latency:Math.max(0,Math.min(latency,3600000)),at:now,score:r.score});state.events=state.events.slice(-2000);return r;
}
function selectQuestion(bank,state,cid,used=[],kind='practice'){
 const r=record(state,cid);let pool=bank.questions.filter(q=>q.conceptId===cid&&q.reviewStatus==='source-checked'&&!used.includes(q.id));
 if(kind==='recall')return pool.find(q=>q.type==='recall')||null;
 pool=pool.filter(q=>q.type!=='recall');const target=kind==='apply'?3:r.score>=55?3:1;
 return pool.sort((a,b)=>(a.id===r.lastQuestion)-(b.id===r.lastQuestion)||Math.abs(a.difficulty-target)-Math.abs(b.difficulty-target)||a.id.localeCompare(b.id))[0]||null;
}
function queue(bank,state,{mode='daily',unitId,lessonId,limit=8}={},now=Date.now()){
 let pool=bank.concepts.filter(c=>c.reviewStatus==='source-checked'&&(!unitId||c.unitId===unitId)&&(!lessonId||c.lessonIds.includes(lessonId)));
 if(mode==='mistakes')pool=pool.filter(c=>record(state,c.id).unresolved>0);
 if(mode==='weak')pool=pool.filter(c=>['weak','learning'].includes(status(record(state,c.id))));
 if(mode==='daily')pool=pool.filter(c=>{const r=record(state,c.id);return !r.attempts||r.due<=now||r.unresolved;});
 function priority(c){const r=record(state,c.id);return r.unresolved?0:r.attempts&&r.due<=now?1:r.attempts&&r.score<55?2:!r.attempts?3:4;}
 pool.sort((a,b)=>priority(a)-priority(b)||record(state,a.id).due-record(state,b.id).due||bank.concepts.indexOf(a)-bank.concepts.indexOf(b));
 return pool.slice(0,limit).map(c=>({conceptId:c.id,reason:!record(state,c.id).attempts?'مفهوم جديد؛ تعلم ثم استرجع':record(state,c.id).unresolved?'خطأ سابق يحتاج تثبيتًا':record(state,c.id).due<=now?'حان موعد المراجعة':record(state,c.id).reason}));
}
function aggregate(bank,state,filter=()=>true){const c=bank.concepts.filter(filter);const mastered=c.filter(c=>status(record(state,c.id))==='mastered').length;return {count:c.length,mastered,score:c.length?Math.round(c.reduce((s,c)=>s+record(state,c.id).score,0)/c.length):0};}
function stats(bank,state,now=Date.now()){const rs=bank.concepts.map(c=>record(state,c.id));return {...aggregate(bank,state),due:rs.filter(r=>r.attempts&&r.due<=now).length,weak:rs.filter(r=>r.attempts&&r.score<55).length,mistakes:rs.filter(r=>r.unresolved).length,new:rs.filter(r=>!r.attempts).length};}
return {KEY,DAY,empty,fresh,valid,load,save,record,status,grade,normalize,answer,queue,selectQuestion,aggregate,stats};
});
