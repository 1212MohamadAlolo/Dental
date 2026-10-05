(() => {
 'use strict';
 let promptEvent, registration;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;refreshInstall();});
 window.addEventListener('appinstalled',()=>{promptEvent=null;refreshInstall();});
 const home=/^(index\.html|home\.html)?$/.test(location.pathname.split('/').pop());
 let panel,installButton,status,downloadButton,updateButton;
 function refreshInstall(){if(installButton)installButton.hidden=standalone();}
 if(home){
  panel=document.createElement('section');panel.className='pwa-panel';panel.setAttribute('aria-label','التطبيق على هاتفك');
  panel.innerHTML='<h2>دراستك معك على الهاتف</h2><div class="pwa-actions"><button id="pwa-install" type="button">ثبّت التطبيق</button><button id="pwa-download" type="button" disabled>حفظ الدروس دون إنترنت</button><button id="pwa-update" type="button" hidden>تحديث التطبيق</button></div><p id="pwa-help" hidden></p><p id="pwa-status" role="status" aria-live="polite">جارٍ تجهيز الحفظ دون إنترنت…</p><p>تقدمك محفوظ على هذا الجهاز. صدّر بيانات التدريب من «مراجعة اليوم» للاحتفاظ بنسخة. ملف المصدر PDF يحتاج الإنترنت ما لم تحفظه بنفسك.</p>';
  const hero=document.querySelector('.home-hero');if(hero)hero.insertAdjacentElement('afterend',panel);else(document.querySelector('main')||document.body).append(panel);
  installButton=panel.querySelector('#pwa-install');downloadButton=panel.querySelector('#pwa-download');status=panel.querySelector('#pwa-status');updateButton=panel.querySelector('#pwa-update');refreshInstall();
  installButton.onclick=async()=>{const help=panel.querySelector('#pwa-help');help.hidden=false;if(promptEvent){try{const event=promptEvent;promptEvent=null;await event.prompt();const choice=await event.userChoice;help.textContent=choice.outcome==='accepted'?'تم قبول التثبيت. تابع تأكيد المتصفح.':'يمكنك التثبيت لاحقًا من هذا الزر أو قائمة المتصفح.';}catch{help.textContent='افتح قائمة المتصفح واختر تثبيت التطبيق أو الإضافة إلى الشاشة الرئيسية.';}}else{help.textContent=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'على iPhone: افتح الرابط في Safari ثم مشاركة ← إضافة إلى الشاشة الرئيسية.':'افتح الرابط في Chrome، ثم القائمة ⋮ ← تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية. إذا كنت داخل تطبيق آخر، افتح الرابط في المتصفح أولًا.';}};
  downloadButton.onclick=async()=>{downloadButton.disabled=true;status.textContent='جارٍ تنزيل الدروس والصور والأسئلة… أبقِ هذه الصفحة مفتوحة.';const channel=new MessageChannel();channel.port1.onmessage=({data})=>{if(data.type==='PROGRESS')status.textContent=`جارٍ الحفظ: ${data.done} / ${data.total}`;else{downloadButton.disabled=false;status.textContent=data.ok?'جاهز دون إنترنت: حُفظت الدروس والصور وبنكا الأسئلة على هذا الجهاز.':'لم يكتمل الحفظ. تحقق من الاتصال والمساحة ثم حاول مجددًا.';channel.port1.close();}};registration.active.postMessage({type:'DOWNLOAD'},[channel.port2]);};
  updateButton.onclick=()=>{if(registration.waiting){updateButton.disabled=true;registration.waiting.postMessage({type:'ACTIVATE'});let reloaded=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloaded){reloaded=true;location.reload();}});}};
 }
 if(!('serviceWorker' in navigator)||!['https:','http:'].includes(location.protocol)){if(status)status.textContent='الحفظ دون إنترنت متاح عند فتح رابط الموقع في متصفح داعم.';return;}
 navigator.serviceWorker.register('sw.js',{scope:'./',updateViaCache:'none'}).then(async reg=>{
  registration=reg;
  const checkUpdate=()=>{if(updateButton)updateButton.hidden=!(reg.waiting&&navigator.serviceWorker.controller);};checkUpdate();
  reg.addEventListener('updatefound',()=>{reg.installing?.addEventListener('statechange',checkUpdate);});
  await navigator.serviceWorker.ready;
  if(downloadButton){downloadButton.disabled=false;const channel=new MessageChannel();channel.port1.onmessage=({data})=>{status.textContent=data.complete?'جاهز دون إنترنت: الدروس والصور والأسئلة محفوظة.':'التطبيق جاهز. اضغط «حفظ الدروس دون إنترنت» قبل الدراسة بلا اتصال.';channel.port1.close();};reg.active.postMessage({type:'STATUS'},[channel.port2]);}
 }).catch(()=>{if(status)status.textContent='تعذر تجهيز الحفظ دون إنترنت. يمكنك استخدام الموقع بالاتصال والمحاولة لاحقًا.';});
})();
