from pathlib import Path
import json,re,collections,subprocess
root=Path(__file__).resolve().parents[1];b=json.loads((root/'data/adaptive-bank.json').read_text())
concepts={c['id']:c for c in b['concepts']};questions={q['id']:q for q in b['questions']};assert len(concepts)==len(b['concepts']);assert len(questions)==len(b['questions'])
lessons={l['id'] for u in b['units'] for l in u['lessons']};assert len(lessons)==93
covered=set();types=collections.Counter()
for c in concepts.values():
 assert set(c['lessonIds'])<=lessons
 covered.update(c['lessonIds'])
 assert c['definition'] and c['sourceReference']['pdfPages'] and c['clinicalApproval']=='pending-human-review'
for q in questions.values():
 assert q['conceptId'] in concepts
 assert q['prompt'] and q['explanation'] and q['hint']
 assert set(q['lessonIds'])<=lessons
 assert all(1<=p<=70 for p in q['sourceReference']['pdfPages'])
 assert (root/q['sourceReference']['document']).is_file()
 if q['type'] in ['mcq','true-false']:assert len(q['options'])==len(set(q['options'])) and 0<=q['correctAnswer']<len(q['options'])
 assert q['reviewStatus']=='source-checked';types[q['type']]+=1
assert covered==lessons
prompts=[q['prompt'] for q in questions.values()];assert len(prompts)==len(set(prompts)),[k for k,v in collections.Counter(prompts).items() if v>1]
js=(root/'data/adaptive-bank.js').read_text();assert json.loads(js[js.index('{'):].rstrip(';\n '))==b
missing=[];refs=0
for p in root.glob('*.html'):
 for ref in re.findall(r'(?:src|href)=["\']([^"\']+)',p.read_text()):
  if re.match(r'^(?:https?:|data:|mailto:|#)',ref):continue
  name=ref.split('#')[0].split('?')[0]
  if name:
   refs+=1
   if not (p.parent/name).exists():missing.append((p.name,ref))
assert not missing,missing
old=(root/'course-path-data.js').read_text();old=json.loads(old[old.index('{'):].rstrip(';\n '));assert sum(len(u['lessons']) for m in old['modules'] for u in m['units'])==93
for m in old['modules']:
 for u in m['units']:
  for l in u['lessons']:assert all(x in old['questionBank'] for x in l['questionIds'])
for f in root.rglob('*.js'):subprocess.run(['node','--check',str(f)],check=True,stdout=subprocess.DEVNULL)
print(json.dumps({'concepts':len(concepts),'newQuestions':len(questions),'legacyQuestions':len(old['questionBank']),'coveredLessons':len(covered),'types':dict(types),'localReferences':refs,'missingReferences':missing},ensure_ascii=False))
