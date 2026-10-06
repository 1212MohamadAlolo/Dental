# QA — المرحلة الأولى

- نجح 23 اختبارًا جديدًا للمصدر ومحرك الامتحان.
- نجح 18 اختبارًا لمحرك التدريب السابق بعد إضافة الملفات.
- نجح فحص بيانات النسخة الحالية و842 مرجعًا محليًا وفحص تركيب JavaScript.
- التحقق من 365 مفتاح إجابة ومرجع؛ الإجابات التفسيرية بقيت غير مصححة آليًا.
- اختبار الشامل تحت تركيز كثيف للأخطاء في وحدة واحدة: تمثيل الوحدات الـ17 محفوظ.
- اختبار تصحيح العربية: النفي والأرقام العشرية والإشارة لم تندمج خطأً.
- اختبار عدم تكرار احتساب الضغط، وتغيير الصيغ، وإغلاق الخطأ بعد مراجعات متباعدة، وإعادة فتحه عند تكراره.
- اختبار استئناف جلسة كاملة بالترتيب والإجابات نفسها، وفشل التخزين والبيانات التالفة.
- قوبلت جداول البزوغ والسقوط في PDF 13 و15 بصريًا؛ لا اعتماد آلي للأرقام الملتبسة في المصدر.

## الحدود

اجتياز الاختبارات البرمجية لا يساوي اعتمادًا طبيًا ولا استقصاء كل تفاصيل الدروس. 92 درسًا لها تغطية جزئية ممتحنة؛ درس المذاقات قراءة مصدر غير مصححة آليًا. جميع الدروس مفتوحة في عقد المحرك.

لم تغير الواجهة أو بيانات المستخدم في هذه المرحلة، لذلك لا توجد دعوى اختبار واجهة جديدة على الهاتف أو التابلت. يجب اختبار الربط البصري في المرحلتين 2 و3. يحتفظ البنك الجديد بحالة pending للاعتماد الأكاديمي البشري.

## نتائج الاختبارات

```text
PASS All 93 lessons open; no fake certification
PASS Every source anchor and excerpt is reproducible from PDF-derived evidence
PASS Semantic families count objectives, not duplicated formats
PASS All supported answer keys grade; open prose remains ungraded
PASS Arabic spelling normalization preserves numbers and negation
PASS Writing uses full answer equality, not keyword acceptance
PASS All objective answer choices can be reshuffled without losing key
PASS Comprehensive represents all 17 units under heavy error bias
PASS Short rounds explicitly disclose incomplete unit representation
PASS Lesson exam cannot leak other lessons
PASS Disputed taste lesson stays open with source review and no fake grade
PASS Empty error review does not invent new errors
PASS All supported structured answers reject malformed submissions
PASS Wrong answer creates objective-level error; repeated submit is idempotent
PASS Seeing answer and retrying same day cannot close mistake
PASS Spaced independent evidence resolves error and recurrence reopens it
PASS Hints and self ratings do not supply mastery evidence
PASS Written self review can queue work but cannot grant objective credit
PASS Exam mode suppresses immediate feedback until submission
PASS New attempts vary question sequence; no duplicate objectives
PASS Mistake practice chooses other available format and only open goals
PASS Resume preserves question order, answers and source snapshots
PASS Corrupt or denied storage does not overwrite existing data
{"passed":23,"bankVersion":"2.0-phase1","objectives":181,"variants":365}
```
