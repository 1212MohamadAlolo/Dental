/* Pure assessment engine. Phase 1: no changes to existing progress or page flows. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AssessmentEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION=1,KEY='dental-assessment-v2',DAY=86400000;
function empty(){return {schemaVersion:VERSION,records:{},attempts:[],active:null};}
function normalize(value){return String(value??'').normalize('NFKC').replace(/[\u0610-\u061a\u064b-\u065f\u0670\u0640\u200e\u200f\u202a-\u202e]/g,'').replace(/[أإآ]/g,'ا').replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[–—]/g,'-').replace(/٫/g,'.').replace(/٪/g,'%').trim().replace(/[؟?!.،]+$/g,'').replace(/\s+/g,' ');}
function grade(q,response){
 if(q.type==='explanation'||q.scoring==='human-rubric')return {status:'needs-review',correct:null,evidence:false,reason:'open-response-requires-rubric'};
 if(q.type==='choice'){if(!q.options.some(o=>o.id===response))return {status:'unanswered',correct:null,evidence:false};return {status:response===q.correctOptionId?'correct':'incorrect',correct:response===q.correctOptionId,evidence:true};}
 if(q.type==='short-answer'){
  const val=normalize(response);if(!val)return {status:'unanswered',correct:null,evidence:false};
  const correct=q.acceptedAnswers.some(a=>normalize(a)===val);
  return {status:correct?'correct':'needs-review',correct:correct?true:null,evidence:correct,reason:correct?'exact-approved-answer':'unknown-wording-not-automatically-wrong'};
 }
 if(q.type==='ordering'){
  if(!Array.isArray(response)||response.length!==q.correctOrder.length||new Set(response).size!==response.length||!response.every(id=>q.items.some(x=>x.id===id)))return {status:'unanswered',correct:null,evidence:false};
  const correct=response.every((id,i)=>id===q.correctOrder[i]);return {status:correct?'correct':'incorrect',correct,evidence:true};
 }
 if(q.type==='matching'){
  if(!response||typeof response!=='object'||Array.isArray(response)||Object.keys(response).length!==q.pairs.length||!q.pairs.every(p=>q.rightOptions.some(o=>o.id===response[p.leftId])))return {status:'unanswered',correct:null,evidence:false};
  const correct=q.pairs.every(p=>response[p.leftId]===p.rightId);return {status:correct?'correct':'incorrect',correct,evidence:true};
 }
 throw Error('Unsupported question type');
}
function rng(seed){let h=2166136261;for(const c of String(seed)){h=Math.imul(h^c.charCodeAt(0),16777619);}return ()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function shuffle(list,random){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function fresh(){return {attempts:0,errors:0,open:false,lastWrong:null,lastSeen:null,lastQuestionId:null,evidence:[],due:null};}
function record(s,id){return s.records[id]||(s.records[id]=fresh());}
function select(bank,state,options={}){
 const mode=options.mode||'comprehensive';if(!['lesson','comprehensive','mistakes'].includes(mode))throw Error('Unknown mode');
 if(mode==='lesson'&&!bank.lessons.some(l=>l.id===options.lessonId))throw Error('Unknown lesson');
 const random=rng(options.seed??`${Date.now()}-${Math.random()}`);let pool=bank.objectives.filter(o=>bank.questions.some(q=>q.objectiveId===o.id&&q.eligibility==='practice'));
 if(mode==='lesson')pool=pool.filter(o=>o.lessonIds.includes(options.lessonId));
 if(mode==='mistakes')pool=pool.filter(o=>state.records[o.id]?.open);
 const activeUnits=bank.units.filter(u=>pool.some(o=>o.unitId===u.id));
 const wanted=options.count??(mode==='comprehensive'?34:Math.max(1,pool.length));if(!Number.isInteger(wanted)||wanted<1)throw Error('Invalid count');const limit=Math.min(wanted,pool.length);
 const previous=state.attempts.filter(a=>a.mode===mode&&a.lessonId===(options.lessonId||null)).at(-1);
 const usedPreviously=new Set(previous?.items.map(q=>q.objectiveId)||[]);
 function priority(o){const r=state.records[o.id];return (r?.attempts||0)*10+(usedPreviously.has(o.id)?5:0)+random();}
 const ranks=new Map(pool.map(o=>[o.id,priority(o)]));const available=pool.slice().sort((a,b)=>ranks.get(a.id)-ranks.get(b.id));let selected=[];let prioritySlots=0;
 function take(o){selected.push(o);available.splice(available.findIndex(x=>x.id===o.id),1);}
 if(mode==='comprehensive'){
  // Guarantee one objective per unit before any error bonus (unless the requested count is too short).
  const unitOrder=shuffle(activeUnits,random).sort((a,b)=>{
   const ah=previous?.items.filter(q=>q.unitId===a.id).length||0,bh=previous?.items.filter(q=>q.unitId===b.id).length||0;return ah-bh;
  });
  for(const u of unitOrder){if(selected.length>=limit)break;take(available.find(o=>o.unitId===u.id));}
  const maxPriority=Math.floor(limit*.35),cap=Math.ceil(limit/Math.max(1,activeUnits.length))+1;
  for(const o of available.slice().sort((a,b)=>(state.records[b.id]?.errors||0)-(state.records[a.id]?.errors||0))){
   if(selected.length>=limit||prioritySlots>=maxPriority)break;
   if(state.records[o.id]?.open&&selected.filter(x=>x.unitId===o.unitId).length<cap){take(o);prioritySlots++;}
  }
  while(selected.length<limit){const counts=Object.fromEntries(activeUnits.map(u=>[u.id,selected.filter(o=>o.unitId===u.id).length]));const candidates=available.slice().sort((a,b)=>counts[a.unitId]-counts[b.unitId]||ranks.get(a.id)-ranks.get(b.id));take(candidates[0]);}
 }else{
  if(mode==='mistakes')available.sort((a,b)=>(state.records[a.id]?.due||0)-(state.records[b.id]?.due||0)||(state.records[b.id]?.errors||0)-(state.records[a.id]?.errors||0)||ranks.get(a.id)-ranks.get(b.id));
  selected=available.slice(0,limit);
 }
 selected=shuffle(selected,random);
 let items=selected.map(o=>{
  const variants=bank.questions.filter(q=>q.objectiveId===o.id&&q.eligibility==='practice'&&!(q.supportingObjectiveIds||[]).some(id=>selected.some(x=>x.id===id)));
  // Open explanations remain practice only; an exam never counts them as automatically correct.
  const ranked=shuffle(variants,random).sort((a,b)=>Number(a.id===state.records[o.id]?.lastQuestionId)-Number(b.id===state.records[o.id]?.lastQuestionId));
  const q=JSON.parse(JSON.stringify(ranked[0]));if(q.options)q.options=shuffle(q.options,random);if(q.items)q.items=shuffle(q.items,random);if(q.leftOptions)q.leftOptions=shuffle(q.leftOptions,random);if(q.rightOptions)q.rightOptions=shuffle(q.rightOptions,random);return q;
 });
 if(previous&&items.length>1&&items.map(q=>q.id).join('|')===previous.items.map(q=>q.id).join('|'))[items[0],items[1]]=[items[1],items[0]];
 const lesson=bank.lessons.find(l=>l.id===options.lessonId);const represented=new Set(items.map(q=>q.unitId));
 return {schemaVersion:VERSION,id:options.attemptId||`${Date.now()}-${Math.floor(random()*1e9)}`,bankVersion:bank.version,sourceSha256:bank.source.sha256,mode,feedback:options.feedback==='exam'?'exam':'training',lessonId:options.lessonId||null,createdAt:options.now??Date.now(),items,answers:{},finishedAt:null,heldItems:lesson?.heldItemIds?.map(id=>bank.heldItems.find(h=>h.id===id))||[],coverage:{eligibleObjectives:pool.length,selectedObjectives:items.length,allEligibleSelected:items.length===pool.length,representedUnits:represented.size,totalUnits:activeUnits.length,allUnitsRepresented:represented.size===activeUnits.length,prioritySlots,fullCurriculumCertified:false,fullLessonCertified:false,lessonCoverageStatus:lesson?.coverageStatus||null},warnings:[...(pool.length===0?['لا توجد أسئلة مصححة آليًا لهذا الاختيار؛ تبقى قراءة المصدر مفتوحة.']:[]),...(mode==='comprehensive'&&represented.size<activeUnits.length?['عدد الأسئلة أقل من عدد الوحدات: هذه جولة مختصرة وليست امتحانًا شاملًا لجميع الوحدات.']:[]),'تغطية أهداف منتقاة موثقة، وليست اعتمادًا لكل جزئية في المنهج.']};
}
function start(bank,state,options={}){if(state.active&&!state.active.finishedAt)throw Error('Resume or explicitly finish the active attempt first');const attempt=select(bank,state,options);if(state.attempts.some(a=>a.id===attempt.id))throw Error('Duplicate attempt id');state.attempts.push(attempt);state.active=attempt;return attempt;}
function submit(state,questionId,response,meta={}){
 const a=state.active;if(!a||a.finishedAt)throw Error('No active attempt');const q=a.items.find(x=>x.id===questionId);if(!q)throw Error('Question outside attempt');
 if(a.answers[questionId])return a.answers[questionId];
 const result=grade(q,response);if(result.status==='unanswered')return result;
 const now=meta.now??Date.now(),saved={questionId,response:JSON.parse(JSON.stringify(response)),...result,answeredAt:now,hint:!!meta.hint,selfRated:!!meta.selfRated};a.answers[questionId]=saved;
 const r=record(state,q.objectiveId);r.attempts++;r.lastSeen=now;r.lastQuestionId=q.id;
 if(result.correct===false){r.errors++;r.open=true;r.lastWrong=now;r.evidence=[];r.due=now+10*60000;}
 if(result.correct===true&&!meta.hint&&!meta.selfRated){
  const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
  const laterThanError=r.lastWrong===null||now-r.lastWrong>=DAY;
  const prior=r.evidence.at(-1);if(laterThanError&&(!prior||now-prior.at>=DAY)&&!r.evidence.some(e=>e.day===day))r.evidence.push({day,at:now,questionId:q.id,type:q.type,attemptId:a.id});
  const distinct=new Set(r.evidence.map(e=>e.type)).size;const stable=r.evidence.length>=3||(r.evidence.length>=2&&distinct>=2);
  if(stable){r.open=false;r.due=now+7*DAY;}else r.due=now+DAY;
 }
 return saved;
}
function reviewWritten(state,questionId,decision,now=Date.now()){
 const a=state.active,q=a?.items.find(q=>q.id===questionId),saved=a?.answers[questionId];
 if(!q||!saved||saved.status!=='needs-review')throw Error('No pending written answer');
 if(!['incorrect','uncertain','matches-model'].includes(decision))throw Error('Unknown self review');
 if(saved.selfReview)return saved;
 saved.selfReview=decision;
 // Self review opens practice needs but can never manufacture objective success.
 if(decision!=='matches-model'){const r=record(state,q.objectiveId);r.open=true;r.lastWrong=now;r.evidence=[];r.due=now+10*60000;}
 return saved;
}
function publicFeedback(attempt,questionId){if(attempt.feedback==='exam'&&!attempt.finishedAt)return {status:'recorded'};const q=attempt.items.find(q=>q.id===questionId);return {answer:attempt.answers[questionId]||null,explanation:q?.explanation,source:q?.source};}
function finish(state,now=Date.now()){
 const a=state.active;if(!a)throw Error('No attempt');a.finishedAt=a.finishedAt||now;return result(a);
}
function result(a){const answers=Object.values(a.answers),correct=answers.filter(x=>x.correct===true).length,wrong=answers.filter(x=>x.correct===false).length,pending=answers.filter(x=>x.status==='needs-review').length,unanswered=a.items.length-answers.length;return {correct,wrong,pending,unanswered,percentage:correct+wrong?Math.round(100*correct/(correct+wrong)):null,percentageScope:'objectively-graded-answers-only',complete:pending===0&&unanswered===0,coverage:a.coverage,fullLessonMastery:false};}
function valid(s){
 try{
  if(!s||s.schemaVersion!==VERSION||!s.records||typeof s.records!=='object'||Array.isArray(s.records)||!Array.isArray(s.attempts))return false;
  if(!Object.values(s.records).every(r=>r&&Number.isInteger(r.attempts)&&r.attempts>=0&&Number.isInteger(r.errors)&&r.errors>=0&&typeof r.open==='boolean'&&Array.isArray(r.evidence)&&r.evidence.every(e=>typeof e.day==='string'&&Number.isFinite(e.at))))return false;
  if(new Set(s.attempts.map(a=>a?.id)).size!==s.attempts.length)return false;
  if(!s.attempts.every(a=>a&&typeof a.id==='string'&&Array.isArray(a.items)&&a.answers&&typeof a.answers==='object'&&!Array.isArray(a.answers)&&a.coverage&&['lesson','comprehensive','mistakes'].includes(a.mode)&&a.items.every(q=>q&&typeof q.id==='string'&&typeof q.objectiveId==='string'&&['choice','short-answer','explanation','matching','ordering'].includes(q.type)&&(q.type!=='choice'||(Array.isArray(q.options)&&q.options.some(o=>o.id===q.correctOptionId)))&&(q.type!=='short-answer'||Array.isArray(q.acceptedAnswers)))&&Object.keys(a.answers).every(id=>a.items.some(q=>q.id===id))))return false;
  return !s.active||s.attempts.some(a=>a.id===s.active.id);
 }catch{return false;}
}
function save(storage,state){try{storage.setItem(KEY,JSON.stringify(state));return {ok:true};}catch{return {ok:false,warning:'تعذر حفظ التقدم؛ احتفظ بنسخة مصدّرة.'};}}
function load(storage){try{const raw=storage.getItem(KEY);if(!raw)return {state:empty(),warning:null};const s=JSON.parse(raw);if(!valid(s))throw Error();if(s.active)s.active=s.attempts.find(a=>a.id===s.active.id);return {state:s,warning:null};}catch{return {state:empty(),warning:'بيانات غير قابلة للقراءة؛ لم تُحذف النسخة المخزنة.'};}}
return {VERSION,KEY,DAY,empty,normalize,grade,select,start,submit,reviewWritten,finish,result,publicFeedback,save,load,valid};
});
