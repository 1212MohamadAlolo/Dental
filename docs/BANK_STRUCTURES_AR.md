# بنية بنك المعرفة والأسئلة

مصدر التحرير: `data/adaptive-bank.json`. نسخة التشغيل في `data/adaptive-bank.js`؛ يجب مزامنتهما بـ`python3 scripts/sync-bank.py`.

## المفهوم (Concept)

`id`, `title`, `definition`, `explanation`, `importantFacts`, `unitId`, `lessonIds`, `topicId`, `learningObjective`, `prerequisites`, `relatedConcepts`, `commonConfusions`, `sourceReference`, `sourceQuote`, `sourceQuoteKind`, `images`, `reviewStatus`, `clinicalApproval`.

`sourceQuoteKind=normalized-summary-not-verbatim` يوضح أن الحقل تلخيص عربي منظم، وليس اقتباسًا حرفيًا. `sourceReference.pdfPages` أرقام PDF الحقيقية؛ `printedPages` ترقيم الورق المطبوع. عند التصحيح الخارجي المعلن يوجد `external` و`correctionNotice`. لا ينبغي احتساب العبارات التعليمية مثل «لا يكفي اللون للتشخيص» اقتباسًا حرفيًا من المقرر.

## السؤال (Question)

`id`, `conceptId`, `lessonIds`, `unitId`, `learningObjective`, `type`, `difficulty`, `cognitiveLevel`, `prompt`, `options?`, `correctAnswer`, `explanation`, `hint`, `sourceReference`, `sourceQuote`, `tags`, `misconceptionTarget`, `reviewStatus`, `clinicalApproval`, `authorship`, `sourceSupport`.

| النوع | correctAnswer | طريقة التصحيح |
|---|---|---|
| mcq / true-false | فهرس أصلي يبدأ من 0 | حفظ الفهرس رغم خلط ترتيب العرض |
| recall | نص مرجعي | تقييم ذاتي منفصل |
| fill | قائمة صيغ مقبولة | تطبيع محدود للتشكيل والألف والمسافات، دون حكم دلالي AI |
| ordering | قائمة مرتبة | تطابق الترتيب |
| matching | قاموس من العنصر إلى وصفه | تطابق كل زوج |

الصيغ غير المدرجة في fill قد تكون صحيحة لغويًا لكنها ترفض؛ لذلك الأسئلة النصية قصيرة ومحددة وتعرض الجواب المرجعي. توسيع الصيغ مقبول بعد مراجعة، ولا يضاف تقارب نصي قد يقبل مصطلحًا طبيًا خاطئًا.

## التدقيق والتغطية

`data/coverage.json` يوضح الارتباط بالدروس. وجود مفهوم مرتبط بدرس لا يعني استيعاب كل تفاصيله. البنك القديم جرد منفصل ولا يدخل آليًا في التدريب الجديد. الاختبار الشامل القديم باقٍ ولا يصبح معتمدًا طبيًا لمجرد وجوده في المشروع.
