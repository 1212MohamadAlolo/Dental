"""Phase 1: reproducible source-led assessment data. Run from site/ or its parent.
Requires the checked-in normalized page evidence (generated initially from the supplied PDF).
"""
from pathlib import Path
import json,csv,re,hashlib,html,collections
R=Path(__file__).resolve().parents[1];D=R/'data/assessment';OUT=R/'docs/phase1'
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def norm(s):
 s=re.sub(r'[\u0610-\u061a\u064b-\u065f\u0670\u200e\u200f\u202a-\u202e\u0640]','',s)
 s=re.sub('ج{2,}','',s);s=re.sub(r'(.)\1{2,}',r'\1',s)
 return re.sub(r'\s+',' ',s).strip()
s=(R/'course-path-data.js').read_text();legacy=json.loads(s[s.index('{'):].rstrip(';\n '));units=[u for m in legacy['modules'] for u in m['units']];lessons=[{**l,'unitId':u['id']} for u in units for l in u['lessons']]
sourceFile=D/'source-pages.json'
if not sourceFile.exists():
 pages=(R.parent/'source-clean.txt').read_text().split('\f')[:70]
 save(sourceFile,{'document':'source/course.pdf','sha256':hashlib.sha256((R/'source/course.pdf').read_bytes()).hexdigest(),'normalization':'Bidi/diacritic removal, whitespace collapse; repeated decorative extraction jeem removed; other 3+ repeats collapsed. Numbers retained; tables 13 and 15 visually checked separately.','pages':[{'pdfPage':i+1,'text':norm(p)} for i,p in enumerate(pages)]})
source=json.loads(sourceFile.read_text());assert source['sha256']==hashlib.sha256((R/'source/course.pdf').read_bytes()).hexdigest()
pages={x['pdfPage']:x['text'] for x in source['pages']}
rows=list(csv.DictReader((D/'curated-facts.tsv').open(),delimiter='\t'));goals=[];questions=[];anchors=[]
for i,row in enumerate(rows):
 assert all(row.values()),row
 unit='page-'+row['unit'];lids=[unit+'-lesson-'+x for x in row['lessons'].split(',')];assert set(lids)<=set(l['id'] for l in lessons)
 page=int(row['page']);text=pages[page];anchor=norm(row['anchor']);at=text.find(anchor)
 if at<0:anchors.append((i+1,row['prompt'],anchor));continue
 oid='goal-'+row['unit']+'-'+hashlib.sha256(row['prompt'].encode()).hexdigest()[:10]
 span={'document':'source/course.pdf','pdfPage':page,'anchor':anchor,'anchorStart':at,'excerpt':text[max(0,at-180):min(len(text),at+len(anchor)+400)],'excerptStart':max(0,at-180),'kind':'normalized-source-excerpt','verification':'visual-table' if 'جدول المقرر' in row['prompt'] else 'source-text-reviewed'}
 goal={'id':oid,'unitId':unit,'lessonIds':lids,'objective':row['prompt'],'answer':row['answer'],'source':span,'status':'source-aligned-learning','humanAcademicApproval':'pending','scope':'curriculum-recall-not-clinical-guidance','questionIds':[]}
 base={'objectiveId':oid,'unitId':unit,'lessonIds':lids,'prompt':row['prompt']+' (وفق المقرر)','explanation':row['answer']+' — راجع صفحة PDF '+str(page)+'.','source':span,'eligibility':'practice','humanAcademicApproval':'pending','semanticFamily':oid}
 opts=[row['answer']]+row['distractors'].split('~');assert len(opts)==4 and len(set(opts))==4,row
 mcq={**base,'id':oid+'-choice','type':'choice','cognitiveDemand':'recognition','options':[{'id':str(j),'text':v} for j,v in enumerate(opts)],'correctOptionId':'0','scoring':'objective'}
 answer=row['answer'];accepted=[answer]
 if answer.startswith('ال'):accepted.append(answer[2:])
 aliases={'قناة ستنسن':['ستنسن','ستنسون','قناة ستنسون','ستنون','قناة ستنون'],'قناة وارطون':['وارطون','وارتون','قناة وارتون'],'قناة بارتولين':['بارتولين'],'في مدخله':['مدخل جهاز الهضم','في مدخل جهاز الهضم'],'حافظة مسافة':['حافظة المسافة'],'لقمتا الفك السفلي':['لقمتين','لقمتي الفك السفلي'],'المبيضات البيض':['المبيضات البيضاء'],'20':['عشرون'],'10':['عشرة'],'32':['اثنان وثلاثون','اثنتان وثلاثون'],'8':['ثمانية','ثمان']}
 accepted+=aliases.get(answer,[])
 short=len(answer.split())<=4 and not re.search(r'أكثر|أقل|فقط|معًا|دائم|وخصوص|أو',answer)
 written={**base,'id':oid+'-write','type':'short-answer' if short else 'explanation','cognitiveDemand':'retrieval','acceptedAnswers':list(dict.fromkeys(accepted)),'modelAnswer':answer,'scoring':'exact-or-review' if short else 'human-rubric','rubric':[{'criterion':answer,'weight':1}],'unknownAnswerPolicy':'needs-review-not-wrong','masteryEvidence':short}
 for q in [mcq,written]:questions.append(q);goal['questionIds'].append(q['id'])
 goals.append(goal)
assert not anchors,anchors
# Structured activities are variants of existing source objectives, not inflated new facts.
def structured_match():
 channelGoals=[g for g in goals if g['answer'] in ['قناة ستنسن','قناة وارطون','قناة بارتولين']]
 first=channelGoals[0];oid='goal-05-channel-matching'
 g={'id':oid,'unitId':'page-05','lessonIds':['page-05-lesson-02','page-05-lesson-03','page-05-lesson-07'],'objective':'مطابقة الغدد اللعابية الكبرى بالقنوات المذكورة في المقرر','answer':'النكفية: ستنسن؛ تحت الفكية: وارطون؛ تحت اللسان: بارتولين','source':first['source'],'status':'source-aligned-learning','humanAcademicApproval':'pending','scope':'curriculum-recall-not-clinical-guidance','questionIds':[oid+'-match'],'componentObjectiveIds':[x['id'] for x in channelGoals]}
 q={'id':oid+'-match','objectiveId':oid,'semanticFamily':oid,'unitId':g['unitId'],'lessonIds':g['lessonIds'],'type':'matching','scoring':'objective','eligibility':'practice','humanAcademicApproval':'pending','cognitiveDemand':'association','prompt':g['objective']+' (وفق المقرر)','explanation':g['answer'],'source':g['source'],'leftOptions':[{'id':'parotid','text':'الغدة النكفية'},{'id':'submandibular','text':'الغدة تحت الفكية'},{'id':'sublingual','text':'الغدة تحت اللسان'}],'rightOptions':[{'id':'stensen','text':'قناة ستنسن'},{'id':'wharton','text':'قناة وارطون'},{'id':'bartholin','text':'قناة بارتولين'}],'pairs':[{'leftId':'parotid','rightId':'stensen'},{'leftId':'submandibular','rightId':'wharton'},{'leftId':'sublingual','rightId':'bartholin'}]}
 q['source']={**first['source'],'excerpt':pages[9],'excerptStart':0};q['objectiveId']=first['id'];q['semanticFamily']=first['id'];q['supportingObjectiveIds']=[x['id'] for x in channelGoals[1:]];first['questionIds'].append(q['id']);questions.append(q)
structured_match()
for target,items,prompt in [('أي مجموعة تمثل الأسنان اللبنية في ربع واحد؟',['الثنية','الرباعية','الناب','الرحى الأولى','الرحى الثانية'],'رتب الأسنان اللبنية في ربع واحد من الأمام إلى الخلف وفق قائمة المقرر.'),('إلى أين قد تمتد الجراثيم بعد عبور ذرى الجذور وفق المقرر؟',['الميناء','العاج','اللب','النسج المحيطة بالسن'],'رتب مراحل امتداد النخر والعدوى في المسار الموصوف بالمقرر من السطح إلى النسج المحيطة.')]:
 g=next(g for g in goals if g['objective']==target);q={'id':g['id']+'-order','objectiveId':g['id'],'semanticFamily':g['id'],'unitId':g['unitId'],'lessonIds':g['lessonIds'],'type':'ordering','scoring':'objective','eligibility':'practice','humanAcademicApproval':'pending','cognitiveDemand':'sequence','prompt':prompt,'explanation':' ← '.join(items),'source':g['source'],'items':[{'id':str(i),'text':v} for i,v in enumerate(items)],'correctOrder':[str(i) for i in range(len(items))]};q['source']={**g['source'],'excerpt':pages[g['source']['pdfPage']],'excerptStart':0};questions.append(q);g['questionIds'].append(q['id'])
# Source-only reading item for a disputed single-topic lesson; never objectively graded.
heldLesson='page-04-lesson-05';held={'id':'held-taste-map','unitId':'page-04','lessonId':heldLesson,'pdfPages':[9],'reason':'التوزيع الحصري للمذاقات معلّق في سجل المراجعة؛ لا يحوّل إلى حقيقة مصححة آليًا.','action':'source-reading-ungraded','sourceText':pages[9].split('الغدد اللعابية')[0]}
save(D/'held-items.json',[held])
sourceMap=json.loads((R/'data/source-map.json').read_text())
issues=[
 ('taste-map',['page-04-lesson-05'],[9],'خريطة مذاقات حصرية','لا سؤال موضوعي قبل الحسم الأكاديمي'),
 ('teething-treatment',['page-06-lesson-04','page-06-lesson-06-b'],[14,16],'وصفات وتدابير التسنين','استبعاد جرعات ووصفات التدبير من البنك'),
 ('enamel-hardness',['page-07-lesson-02'],[17],'قيمة موس وتشبيه الكوارتز','معلّق؛ التركيز على الوصف البنيوي'),
 ('tomes',['page-07-lesson-03','page-17-lesson-04-b'],[18,70],'ألياف تومز وآلية الألم','استبعاد تفسير الآلية الملتبس'),
 ('cement-junction',['page-07-lesson-04'],[19],'أنماط التقاء الملاط بالميناء','تعليق تفاصيل القائمة'),
 ('pocket-threshold',['page-08-lesson-01','page-08-lesson-02'],[21,22],'تباين عتبات الميزاب والجيب داخل المقرر','لا اعتماد حد منفرد للتشخيص'),
 ('old-classifications',['page-09-lesson-02','page-09-lesson-02-b','page-09-lesson-04','page-10-lesson-01'],[27,28,29,30],'تصنيفات وأوصاف تاريخية','تقييد الأسئلة بوصف المقرر لا ببروتوكول سريري'),
 ('bruxism-treatment',['page-10-lesson-03','page-10-lesson-04'],[31,32,33],'أسباب الصرير والسحل والفتح القسري','تعليق التوصيات العلاجية'),
 ('tobacco-flow',['page-11-lesson-02','page-16-lesson-05'],[35,63],'تعميمات الدوران الدموي والتغيرات اللثوية','عدم إدخال التعميمات محل الإشكال'),
 ('prosthesis-cancer',['page-11-lesson-03'],[36],'انتقال الطيات التخريشية إلى خباثة','تعليق السببية'),
 ('aphthae-scar',['page-12-lesson-01','page-12-lesson-01-b'],[40],'ندبة كل حالات القلاع ووصف العلاج','تعليق الندبة والعلاج؛ المحتوى الحالي يخفف كل إلى معظم دون حسم'),
 ('cancer-statistics',['page-13-lesson-01','page-13-lesson-02','page-13-lesson-03','page-13-lesson-04'],[44,45,46,47],'نسب وأسباب وإطلاقات سرطانية','لا اختبار للنسب ولا تشخيص من وصف واحد'),
 ('halitosis',['page-15-lesson-01','page-15-lesson-03'],[53,55],'الصباح وحقن الغلوكوز ومضادات البخر','استبعاد المقارنة والحقن والوصفات'),
 ('thumb-causation',['page-16-lesson-04','page-16-lesson-04-b'],[60,61,62],'نقص الحنان والتعميمات النفسية','تعليق السببية؛ اختبار الوضعية والتكرار والمدة'),
 ('caries-generalizations',['page-17-lesson-01','page-17-lesson-02-b','page-17-lesson-03'],[65,66,67,68],'أرقام وانتشار والسكر بلا حد والعمر والجنس','استبعاد التعميمات غير المحسومة'),
 ('arsenic',['page-17-lesson-04-b'],[70],'إماتة اللب بالزرنيخ','لا أسئلة علاجية مؤيدة لهذا التدبير')]
save(D/'review-register.json',[{'id':i,'lessonIds':ls,'pdfPages':ps,'topic':t,'decision':d,'status':'pending-specialist-review','basis':'source inspection and existing SCIENTIFIC_REVIEW_AR.md; no new clinical validation claimed'} for i,ls,ps,t,d in issues])
coverage=[]
for l in lessons:
 gs=[g for g in goals if l['id'] in g['lessonIds']];plain=html.unescape(re.sub('<[^>]*>',' ',l['contentHtml']));plain=norm(plain)
 blocks=[norm(html.unescape(re.sub('<[^>]*>',' ',x))) for x in re.findall(r'<(?:p|li|tr|figcaption)\b[^>]*>(.*?)</(?:p|li|tr|figcaption)>',l['contentHtml'],re.S)]
 blocks=[x for x in blocks if x];special=[]
 if 'مصطلحات' in l['title'] or 'قاموس' in l['title']:special.append('الترجمات والمفردات الأجنبية غير المعثور عليها نصيًا في PDF غير معتمدة تلقائيًا؛ الأسئلة المرتبطة تختبر المصطلحات العربية المدعومة فقط.')
 if '<img' in l['contentHtml']:special.append('الصور التعليمية المولدة ليست دليلًا أصليًا؛ تسميات الصور التي لا يدعمها نص المقرر تحتاج مقابلة بصرية مستقلة.')
 coverage.append({'id':l['id'],'title':l['title'],'unitId':l['unitId'],'unlocked':True,'sourcePages':sourceMap[l['unitId']]['pdfPages'],'contentBlocks':blocks,'contentSha256':hashlib.sha256(l['contentHtml'].encode()).hexdigest(),'objectiveIds':[g['id'] for g in gs],'independentObjectiveCount':len(gs),'questionVariantCount':sum(len(g['questionIds']) for g in gs),'coverageStatus':'partial-source-aligned' if gs else 'source-review-only','coveragePercent':None,'fullLessonCoverageCertified':False,'pendingReviewIds':[i for i,ls,ps,t,d in issues if l['id'] in ls],'notes':special,'heldItemIds':[held['id']] if l['id']==heldLesson else []})
# Do not quietly reuse the old banks; keep individual audit rows and provenance.
s=(R/'comprehensive-exam.js').read_text();exam=json.JSONDecoder().raw_decode(s.split('const QUESTION_BANK = ',1)[1])[0]
adaptive=json.loads((R/'data/adaptive-bank.json').read_text())['questions'];audit=[]
for bank,qs in [('lesson-legacy',list(legacy['questionBank'].values())),('comprehensive-legacy',exam),('adaptive-v1.2',adaptive)]:
 for q in qs:
  lids=q.get('lessonIds',[]);risk=[i for i,ls,ps,t,d in issues if set(lids)&set(ls)]
  audit.append({'bank':bank,'id':q['id'],'prompt':q['prompt'],'lessonIds':lids,'sourceReference':q.get('sourceReference'),'status':'not-imported-into-new-bank','reason':'requires item-specific answer/distractor/source recheck; prior tags do not certify exhaustive coverage','relatedReviewIds':risk,'broadLink':len(lids)>1})
prompts=collections.Counter(norm(x['prompt']) for x in audit)
report={'bankCounts':dict(collections.Counter(x['bank'] for x in audit)),'entriesWithoutLessonLinks':sum(not x['lessonIds'] for x in audit),'broadlyLinkedEntries':sum(x['broadLink'] for x in audit),'repeatedPromptGroups':sum(n>1 for n in prompts.values()),'policy':'No old item auto-approved by similarity or source-checked label; originals unchanged.'}
save(D/'legacy-audit.json',{'summary':report,'items':audit})
bank={'schemaVersion':1,'version':'2.0-phase1','status':'source-aligned-prototype-pending-human-academic-approval','source':{'document':source['document'],'sha256':source['sha256'],'pdfPages':70},'units':[{'id':u['id'],'title':u['title'],'lessonIds':[l['id'] for l in u['lessons']]} for u in units],'lessons':coverage,'objectives':goals,'questions':questions,'heldItems':[held],'metrics':{'lessons':len(lessons),'units':len(units),'independentObjectives':len(goals),'questionVariants':len(questions),'objectiveQuestionVariants':sum(q['scoring']!='human-rubric' for q in questions),'humanRubricVariants':sum(q['scoring']=='human-rubric' for q in questions),'lessonsWithAssessedSubset':sum(bool(x['objectiveIds']) for x in coverage),'fullLessonCoverageCertified':0}}
save(D/'bank.json',bank);save(D/'coverage.json',coverage)
# Static browser adapter is available for phase 2 without changing existing pages.
(R/'assessment/bank.js').write_text('window.AssessmentBank = '+json.dumps(bank,ensure_ascii=False,separators=(',',':'))+';\n')
rowsMD=['# خريطة التغطية — المرحلة الأولى','', 'هذه خريطة **الأهداف المدعومة المنتقاة** وليست شهادة شمول لكل جزئية. عدد الصيغ ليس عدد أهداف مستقلة. جميع الدروس مفتوحة.','', '| الدرس | أهداف مستقلة | صيغ | حالة |', '|---|---:|---:|---|']
for c in coverage:rowsMD.append(f"| {c['id']} — {c['title']} | {c['independentObjectiveCount']} | {c['questionVariantCount']} | {'قراءة غير مصححة آليًا' if not c['objectiveIds'] else 'تغطية جزئية موثقة'} |")
(OUT/'COVERAGE_AR.md').write_text('\n'.join(rowsMD)+'\n');save(OUT/'metrics.json',{'newBank':bank['metrics'],'oldBanks':report})
print(json.dumps({'newBank':bank['metrics'],'oldBanks':report},ensure_ascii=False))
