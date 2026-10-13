(function () {
  'use strict';
  const $=id=>document.getElementById(id);
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let activeResult=null,activeInput=null,sinsalBase='day',showAllSinsal=false,selectedKeywords=[];
  $('results').addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(button&&activeResult){
      if(button.dataset.category&&window.OngyeolContent.categories.some(v=>v[0]===button.dataset.category)){
        $('category-content').innerHTML=window.OngyeolInsights.category(activeResult,button.dataset.category);
        document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      }
      if(button.dataset.month!==undefined){const index=Number(button.dataset.month);if(Number.isInteger(index)&&index>=0&&index<12){$('month-detail').innerHTML=window.OngyeolInsights.monthDetail(activeResult,index);document.querySelectorAll('[data-month]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}}
      if(button.dataset.downloadCard){$('share-status').textContent='카드 이미지를 만드는 중이에요.';window.OngyeolInsights.download(activeResult).then(()=>$('share-status').textContent='결과 카드 다운로드를 시작했어요.').catch(e=>$('share-status').textContent=e.message);}
      if(button.dataset.story&&window.OngyeolStories.kinds.some(v=>v[0]===button.dataset.story)){
        $('story-content').innerHTML=window.OngyeolStories.article(activeResult,button.dataset.story);
        document.querySelectorAll('[data-story]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      }
      if(button.dataset.keyword!==undefined){
        const index=Number(button.dataset.keyword),words=window.OngyeolStories.keywords(activeResult);
        if(Number.isInteger(index)&&index>=0&&index<words.length){
          if(selectedKeywords.includes(index))selectedKeywords=selectedKeywords.filter(i=>i!==index);
          else if(selectedKeywords.length<3)selectedKeywords.push(index);
          else{$('keyword-result').innerHTML=window.OngyeolStories.sentence(activeResult,selectedKeywords)+'<p>세 개를 골랐어요. 다른 표현을 고르려면 선택한 표현을 한 번 더 눌러 해제해주세요.</p>';return;}
          $('keyword-result').innerHTML=window.OngyeolStories.sentence(activeResult,selectedKeywords);
          document.querySelectorAll('[data-keyword]').forEach(b=>b.setAttribute('aria-pressed',String(selectedKeywords.includes(Number(b.dataset.keyword)))));
        }
      }
      if(button.dataset.sinsalBase||button.dataset.sinsalAll){
        if(button.dataset.sinsalBase)sinsalBase=button.dataset.sinsalBase;
        if(button.dataset.sinsalAll)showAllSinsal=button.dataset.sinsalAll==='true';
        $('sinsal').innerHTML=window.OngyeolExperience.sinsal(activeResult,sinsalBase,showAllSinsal);
        const selector=button.dataset.sinsalBase?'[data-sinsal-base="'+sinsalBase+'"]':'[data-sinsal-all]';
        $('sinsal').querySelector(selector).focus();
      }
      if(button.dataset.yearIndex!==undefined){
        const index=Number(button.dataset.yearIndex);
        if(index>=0&&index<activeResult.years.length){
          $('year-explorer-detail').innerHTML=window.OngyeolExperience.yearDetail(activeResult,index);
          document.querySelectorAll('[data-year-index]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
        }
      }
      if(button.dataset.reflection){
        $('reflection-answer').innerHTML=window.OngyeolExperience.reflection(activeResult,button.dataset.reflection);
        document.querySelectorAll('[data-reflection]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      }
    }
    const link=event.target.closest('a[href^="#report-page-"]');
    if(link){
      const target=$(link.getAttribute('href').slice(1));
      if(target){event.preventDefault();const chapter=target.closest('details');if(chapter)chapter.open=true;target.scrollIntoView({behavior:'smooth',block:'start'});target.tabIndex=-1;target.focus({preventScroll:true});}
    }
  });
  $('results').addEventListener('change',event=>{if(event.target.id==='partner-unknown'){$('partner-time').disabled=event.target.checked;$('partner-time').required=!event.target.checked;}});
  $('results').addEventListener('submit',event=>{
    if(event.target.id!=='compare-form')return;
    event.preventDefault();$('compare-error').textContent='';$('compare-result').innerHTML='';
    try{const partner=OngyeolEngine.calculate({...activeInput,date:$('partner-date').value,time:$('partner-time').value,unknown:$('partner-unknown').checked,longitude:Number($('partner-longitude').value),gender:Number($('partner-gender').value),transitionChoice:'reject'});$('compare-result').innerHTML=window.OngyeolInsights.comparisonHTML(activeResult,partner);}catch(error){$('compare-error').textContent=error.message;}
  });
  function tab(name) {
    document.querySelectorAll('[data-tab]').forEach(button=>{const active=button.dataset.tab===name;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;$('tab-'+button.dataset.tab).hidden=!active;});
  }
  document.querySelectorAll('[data-tab]').forEach(button=>{
    button.addEventListener('click',()=>tab(button.dataset.tab));
    button.addEventListener('keydown',event=>{const buttons=[...document.querySelectorAll('[data-tab]')];let index=buttons.indexOf(button);if(event.key==='ArrowRight')index=(index+1)%buttons.length;else if(event.key==='ArrowLeft')index=(index+buttons.length-1)%buttons.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=buttons.length-1;else return;event.preventDefault();tab(buttons[index].dataset.tab);buttons[index].focus();});
  });
  $('unknown').addEventListener('change',()=>{$('time').disabled=$('unknown').checked;$('time').required=!$('unknown').checked;});
  $('city').addEventListener('change',()=>{const custom=$('city').value==='custom';$('longitude-field').hidden=!custom;$('longitude').required=custom;});
  $('correction').addEventListener('change',()=>{$('equation').disabled=!$('correction').checked;});
  $('date').max=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());
  $('birth-form').addEventListener('submit',event=>{
    event.preventDefault();$('error').textContent='';
    try {
      if(!window.OngyeolEngine)throw new Error('계산 파일을 불러오지 못했습니다. engine.js 파일을 확인해주세요.');
      const input={date:$('date').value,time:$('time').value,unknown:$('unknown').checked,correction:$('correction').checked,equation:$('equation').checked,daySect:Number($('day-sect').value)||2,yunSect:Number($('yun-sect').value)||2,transitionChoice:$('transition-choice').value||'reject',longitude:Number($('city').value==='custom'?$('longitude').value:$('city').value),gender:Number($('gender').value)};
      const result=OngyeolEngine.calculate(input);
      if(!window.OngyeolExperience)throw new Error('개인 요약 화면 파일 experience.js를 확인해주세요.');
      if(!window.OngyeolStories)throw new Error('나의 이야기 파일 stories.js를 확인해주세요.');
      activeResult=result;activeInput=input;sinsalBase='day';showAllSinsal=false;selectedKeywords=[];
      $('personal-overview').innerHTML=window.OngyeolExperience.personal(result,input);
      const t=result.timing;
      $('timing-audit').innerHTML='<p>기록 시각의 UTC 오프셋: +'+t.offset/60+'시간 · 당시 표준시: +'+t.standard/60+'시간 · 서머타임: '+t.dst+'분</p><p>경도 보정: '+t.longitudeMinutes.toFixed(2)+'분 · 균시차: '+t.eotMinutes.toFixed(2)+'분</p><p>일·시주에 사용한 시각: '+t.dayClock+'</p><p>절기 비교용 UTC+8 시각: '+t.termClock+'</p><p>일주 변경: '+(t.daySect===2?'자정 00시':'자시 23시')+' · 대운: '+(t.yunSect===2?'분 단위':'시진 단위')+' · '+(t.forward?'순행':'역행')+'</p><p>대운 시작까지: '+t.yunDuration.years+'년 '+t.yunDuration.months+'개월 '+t.yunDuration.days+'일 '+t.yunDuration.hours+'시간</p>';
      $('birth-caption').textContent=input.date+' · '+(input.unknown?'출생 시간 미상 (대운은 정오 추정)':input.time)+' · '+$('city').selectedOptions[0].textContent+(input.correction?' · 경도 보정 적용':' · 경도 보정 없음');
      $('summary').innerHTML='<strong>일간 '+escape(result.day)+' · '+result.elements[result.day]+'의 결</strong>아래 글자와 관계를 통해 타고난 구성을 살펴보세요. 오행 개수만으로 성격이나 운의 좋고 나쁨을 단정하지 않습니다.';
      $('pillars').innerHTML=result.pillars.map((p,i)=>'<article class="pillar '+(i===2?'focus':'')+'"><h3>'+p.label+'</h3>'+(p.unknown?'<p>시간 미상</p>':'<span class="glyph element-'+p.element+'">'+p.gan+'</span><span class="glyph element-'+result.elements[p.zhi]+'">'+p.zhi+'</span><div class="meta">'+escape(p.relation)+'</div>')+'</article>').join('');
      const total=Object.values(result.counts).reduce((a,b)=>a+b,0);
      $('elements').innerHTML=Object.entries(result.counts).map(([name,count])=>'<div class="bar-row"><span>'+name+'</span><div class="bar"><span style="width:'+count/total*100+'%"></span></div><span>'+count+'</span></div>').join('');
      $('character-notes').innerHTML=result.pillars.filter(p=>!p.unknown).map(p=>'<div class="char-note">'+p.label+' '+p.gan+p.zhi+' · 천간 '+escape(p.relation)+'</div>').join('');
      $('sinsal').innerHTML='<div class="sinsal-overview"><h3>십이신살 · 일지 / 년지 기준 비교</h3><p>해당 여부는 두 기준을 따로 표시합니다. 시간 미상인 경우 시주는 미확인입니다. 각 항목의 상세 해설로 바로 이동할 수 있습니다.</p></div>'+result.twelveDay.map((s,i)=>{const year=result.twelveYear[i];return '<article class="sinsal-card"><h3>'+s.name+'</h3><p><strong>일지 기준: '+s.status+'</strong><br>'+(s.positions.join(', ')||'확인된 위치 없음')+'</p><p><strong>년지 기준: '+year.status+'</strong><br>'+(year.positions.join(', ')||'확인된 위치 없음')+'</p><div class="basis">일지 '+s.base+' · '+s.group+' → '+s.target+'<br>년지 '+year.base+' · '+year.group+' → '+year.target+'</div><a class="report-link" href="#report-page-'+(i+4)+'">판정 근거와 상세 해설 →</a></article>';}).join('')+'<article class="sinsal-card"><h3>별도 신살 · 천을귀인</h3><p>'+result.sinsal[0].positions.join(', ')+'</p><p>'+result.sinsal[0].note+'</p><a class="report-link" href="#report-page-20">귀인·지장간 해설 →</a></article>';
      $('relations').innerHTML='<p class="muted">알려진 지지의 모든 위치 쌍을 대조했습니다. 한 쌍에 여러 관계가 있으면 함께 표시합니다.</p>'+result.branchRelations.pairs.map(pair=>'<div class="relation"><strong>'+pair.label+'</strong><br>'+(pair.kinds.join(' · ')||'검사한 쌍 관계에 해당 없음')+' · '+(pair.adjacent?'이웃한 위치':'떨어진 위치')+'</div>').join('')+result.branchRelations.found.filter(f=>['삼합','반합','방합','방합 일부','삼형 완비'].includes(f.kind)).map(f=>'<div class="relation"><strong>'+f.kind+' '+f.set+'</strong><br>'+f.label+(f.missing&&f.missing.length?' · 부족 '+f.missing.join('·'):'')+'</div>').join('')+'<a class="report-link" href="#report-page-16">원국 충·합과 위치별 상세 해설 →</a>';
      $('yun-caption').textContent='대운 시작: '+result.start+(input.unknown?' · 출생 시간 미상으로 추정':'')+' · 나이는 라이브러리의 연도 기준';
      $('cycles').innerHTML=result.cycles.map(c=>'<div class="cycle '+(result.year>=c.start&&result.year<=c.end?'current':'')+'"><strong>'+c.ganZhi+'</strong><small>'+c.start+'–'+c.end+'<br>'+c.age+'세부터</small></div>').join('');
      $('years').innerHTML=result.years.map(y=>'<article class="year-card"><span class="year">'+y.year+'년 · 입춘 기준</span><h3>'+y.ganZhi+'</h3><p>천간 '+y.ganZhi[0]+'('+result.elements[y.ganZhi[0]]+') · 지지 '+y.ganZhi[1]+'('+result.elements[y.ganZhi[1]]+')</p><p>해당 연도의 글자를 원국과 함께 살펴보세요. 이 표시는 미래 사건이나 길흉을 예측하지 않습니다.</p></article>').join('');
      if (!window.OngyeolReport) throw new Error('상세 리포트 파일을 불러오지 못했습니다. report.js 파일을 확인해주세요.');
      $('sinsal').innerHTML=window.OngyeolExperience.sinsal(result,sinsalBase,showAllSinsal);
      $('detailed-report').innerHTML=window.OngyeolReport.build(result,input);
      tab('chart');$('results').hidden=false;$('results').scrollIntoView({behavior:'smooth',block:'start'});
    } catch(error) {$('results').hidden=true;$('error').textContent=error.message||'분석 중 오류가 발생했습니다. 입력값을 확인해주세요.';}
  });
  const notices={privacy:['개인정보 안내','출생 정보는 현재 브라우저에서 계산하며 서버에 전송하거나 저장하지 않습니다. 화면을 새로고침하면 결과가 초기화됩니다. 인쇄하거나 PDF로 저장한 파일은 직접 관리해주세요.'],terms:['이용 안내','국내 출생자의 양력 생일을 기준으로 계산합니다. 전통 명리의 참고 정보이며 중요한 판단이나 미래 사건의 예측을 위한 자료가 아닙니다. 계산 관례와 학파에 따라 해석이 달라질 수 있습니다.'], 'launch-info':['출시 준비 안내','심화 리포트는 출시 준비 중입니다. 상품 범위와 가격은 전문가 검수 후 공개할 예정이며 현재 결제와 예약은 제공하지 않습니다. 기본 사주 분석과 인쇄는 무료로 이용할 수 있습니다.']};
  Object.entries(notices).forEach(([id,[title,body]])=>$(id).addEventListener('click',()=>{$('dialog-title').textContent=title;$('dialog-body').textContent=body;$('dialog').showModal();}));
  $('close-dialog').addEventListener('click',()=>$('dialog').close());
  $('dialog').addEventListener('click',event=>{if(event.target===$('dialog')){const rect=$('dialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('dialog').close();}});
  $('print').addEventListener('click',()=>window.print());
})();
