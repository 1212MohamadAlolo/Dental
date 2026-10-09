"""Build curriculum-bound open responses from authored prompts and anchored lesson evidence.
Does not certify clinical accuracy or infer fact coverage from a lesson tag.
Run after build-assessment.py when the underlying course changes.
"""
from pathlib import Path
import json,re,html,hashlib,collections
R=Path(__file__).resolve().parents[1];D=R/'data/assessment'
def norm(s):
 s=html.unescape(re.sub('<[^>]*>',' ',s));s=re.sub(r'[\u0610-\u061a\u064b-\u065f\u0670\u200e\u200f\u202a-\u202e\u0640]','',s);s=re.sub('ج{2,}','',s);s=re.sub(r'(.)\1{2,}',r'\1',s)
 return re.sub(r'\s+',' ',s).strip()
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
s=(R/'course-path-data.js').read_text();course=json.loads(s[s.index('{'):].rstrip(';\n '));raw={l['id']:{**l,'unitId':u['id']} for m in course['modules'] for u in m['units'] for l in u['lessons']};base=json.loads((D/'bank.json').read_text());ls={l['id']:l for l in base['lessons']};blueprints=json.loads((D/'written-blueprints.json').read_text());objectives=[];questions=[];covered=collections.defaultdict(set)
for spec in blueprints:
 oid='written-'+hashlib.sha256((spec['sourceLessonId']+spec['prompt']).encode()).hexdigest()[:14];rubric=[];evidence=[]
 for i,c in enumerate(spec['criteria']):
  l=raw[c['sourceLessonId']];full=norm(l['contentHtml']);anchor=norm(c.get('anchor',ls[l['id']]['contentBlocks'][c['blockIndex']] if 'blockIndex' in c else ''))
  assert anchor and anchor in full,(spec['prompt'],anchor)
  at=full.index(anchor);ev={'lessonId':l['id'],'lessonTitle':l['title'],'contentSha256':hashlib.sha256(l['contentHtml'].encode()).hexdigest(),'anchor':anchor,'anchorStart':at,'excerpt':full[at:at+len(anchor)],'blockIndex':c.get('blockIndex')};evidence.append(ev)
  rubric.append({'id':oid+'-r'+str(i+1),'criterion':c['text'],'weight':1,'sourceEvidenceIndex':i})
  if 'blockIndex' in c:covered[l['id']].add(c['blockIndex'])
 sid=spec['sourceLessonId'];unit=raw[sid]['unitId'];model='\n'.join(str(i+1)+'. '+r['criterion'] for i,r in enumerate(rubric));source={'document':'course-path-data.js','kind':'anchored-course-lesson','lessonId':sid,'pdfPages':ls[sid]['sourcePages'],'excerpt':'\n'.join(e['excerpt'] for e in evidence),'evidence':evidence,'verification':'authored-task-with-exact-lesson-anchors','pdfMappingScope':'unit-reference-pages-not-item-specific-proof'}
 task={'id':oid,'unitId':unit,'lessonIds':spec['lessonIds'],'objective':spec['prompt'],'answer':model,'source':source,'status':'source-aligned-written-practice','humanAcademicApproval':'pending','scope':'course-description-not-clinical-guidance','questionIds':[oid+'-response'],'collection':'written','objectiveKind':'compound-response-task-not-an-independent-fact'}
 question={'id':oid+'-response','objectiveId':oid,'semanticFamily':oid,'unitId':unit,'lessonIds':spec['lessonIds'],'prompt':spec['prompt']+' (وفق محتوى الدرس)','command':spec['command'],'type':'short-answer' if spec.get('term') else 'explanation','scoring':'exact-or-review' if spec.get('term') else 'human-rubric','acceptedAnswers':[spec['criteria'][0]['text']] if spec.get('term') else [],'modelAnswer':model,'explanation':model,'rubric':rubric,'source':source,'eligibility':'practice','humanAcademicApproval':'pending','cognitiveDemand':'terminology' if spec.get('term') else 'constructed-response','collection':'written','masteryEvidence':bool(spec.get('term')),'unknownAnswerPolicy':'needs-review-not-wrong','rubricScoring':'self-assessment-separate-from-objective-grade'}
 objectives.append(task);questions.append(question)
assert len({q['id'] for q in questions})==len(questions)
coverage=[]
for id,l in ls.items():
 qs=[q for q in questions if id in q['lessonIds']];coverage.append({'lessonId':id,'title':l['title'],'writtenTaskIds':[q['id'] for q in qs],'commands':sorted({q['command'] for q in qs}),'directlyReferencedParagraphIndices':sorted(covered[id]),'paragraphsNotDirectlyReferencedInWrittenTasks':[{'index':i,'text':v} for i,v in enumerate(l['contentBlocks']) if i not in covered[id]],'unreferencedInterpretation':'Includes image captions, repeated summaries, excluded claims, and remaining details; not automatically mastered or fully covered.','fullLessonCoverageCertified':False,'pendingReviewIds':l['pendingReviewIds']})
metrics={'writtenTasks':len(questions),'extendedResponseTasks':sum(q['type']=='explanation' for q in questions),'terminologyTasks':sum(q['type']=='short-answer' for q in questions),'rubricCriteria':sum(len(q['rubric']) for q in questions),'lessonsWithWrittenTasks':sum(bool(c['writtenTaskIds']) for c in coverage),'units':len({q['unitId'] for q in questions}),'commands':dict(collections.Counter(q['command'] for q in questions)),'totalBaseAndWrittenVariants':len(base['questions'])+len(questions),'countsNote':'Compound tasks and repeated synthesis cannot be added to 181 base objectives as independent facts.','fullCurriculumCertified':False}
bank={'version':'2.1-written','baseBankVersion':base['version'],'source':base['source'],'objectives':objectives,'questions':questions,'coverage':coverage,'metrics':metrics};save(D/'written-bank.json',bank);save(D/'written-coverage.json',coverage)
# Keep audit data out of the browser payload.
(R/'assessment/written-bank.js').write_text('window.WrittenBank = '+json.dumps({k:v for k,v in bank.items() if k!='coverage'},ensure_ascii=False,separators=(',',':'))+';\n');save(R/'docs/written-bank/metrics.json',metrics)
print(json.dumps(metrics,ensure_ascii=False))
