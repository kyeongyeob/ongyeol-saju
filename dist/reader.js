(function(){
 'use strict';
 let instance=null;
 const sections=[['summary','핵심 요약','나를 읽는 한 문장'],['elements','오행','내 기운의 구성'],['year','올해·대운','올해와 다음 변화'],['month','월운','달마다 달라지는 연결'],['love','연애','가까운 관계에서의 나'],['wealth','재물','성과와 자원을 다루는 방식'],['work','직업','내 능력이 빛나는 조건'],['people','인간관계','반복되는 대화의 실마리'],['sinsal','신살','내게 해당하는 신살'],['chart','원국','여덟 글자와 관계'],['couple','궁합','두 원국이 만나는 방식'],['share','결과 카드','나의 한 줄을 간직하기'],['report','상세 해설','궁금한 장부터 펼쳐보기']];
 function reset(){
  if(!instance)return;
  const state=instance,results=document.getElementById('results');state.observer.disconnect();state.track.removeEventListener('scroll',state.onScroll);clearTimeout(state.timer);
  ['personal-overview','summary','tab-chart','tab-sinsal','tab-flow','detailed-report'].forEach(id=>{const node=document.getElementById(id);if(node)results.append(node);});
  const tabs=results.querySelector('.tabs');if(tabs)results.append(tabs);
  state.shell.remove();document.querySelector('.reader-archive')?.remove();instance=null;
 }
 function element(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text)e.textContent=text;return e;}
 function mount(r){
  // Unit report generation uses a minimal DOM. Reader behavior is covered in browser tests.
  if(typeof document.createElement!=='function')return;
  if(instance)reset();
  const results=document.getElementById('results'),overview=document.getElementById('personal-overview');
  const archive=element('div','reader-archive');archive.hidden=true;
  const shell=element('section','result-reader');shell.setAttribute('aria-label','좌우로 읽는 나의 사주');
  shell.innerHTML='<div class="reader-top"><div class="reader-intro"><span>한 번에 한 주제씩</span><strong id="reader-position">1 / 13</strong></div><div class="reader-topic-list" role="group" aria-label="결과 주제 선택"></div><div class="reader-progress" aria-hidden="true"><span></span></div></div><p class="reader-hint">좌우로 밀거나 주제를 눌러 읽어보세요. 긴 설명은 아래로 스크롤할 수 있어요.</p><div class="reader-track" tabindex="0" aria-label="사주 결과 슬라이드"></div><div class="reader-bottom"><button type="button" data-reader-step="-1" aria-label="이전 결과">← 이전</button><span id="reader-announcement" aria-live="polite"></span><button type="button" data-reader-step="1" aria-label="다음 결과">다음 →</button></div>';
  const nav=shell.querySelector('.reader-topic-list'),track=shell.querySelector('.reader-track');
  const categoryButtons=[...overview.querySelectorAll('[data-category]')];
  const slides=sections.map(([id,label,title],i)=>{
   const slide=element('article','reader-slide');slide.dataset.readerPage=id;slide.id='reader-'+id;slide.setAttribute('aria-label',(i+1)+' / '+sections.length+' · '+label);slide.setAttribute('aria-roledescription','슬라이드');
   const head=element('div','reader-page-heading');head.append(element('span','',String(i+1).padStart(2,'0')+' / '+sections.length),element('h3','',title));slide.append(head);track.append(slide);
   let button=categoryButtons.find(b=>b.dataset.category===id);if(!button)button=element('button','',label);button.type='button';button.dataset.readerTarget=id;button.classList.add('reader-topic');button.setAttribute('aria-controls',slide.id);nav.append(button);
   return slide;
  });
  function move(selector,page){const node=document.querySelector(selector);if(node){node.hidden=false;node.removeAttribute('role');node.removeAttribute('aria-labelledby');slides[page].append(node);}}
  move('.strength-summary',0);move('.feature-tags',0);
  const intro=element('div','reader-summary-actions');intro.innerHTML='<p>이 결과에서 궁금한 부분을 골라보세요.</p><button type="button" data-reader-target="year">올해 흐름부터 보기 ↗</button><button type="button" data-reader-target="love">연애 이야기 보기 ↗</button>';slides[0].append(intro);
  move('.weighted-card',1);
  move('.annual-highlights',2);move('.yun-change',2);
  const cycles=element('details','reader-extra');cycles.append(element('summary','','전체 대운 표와 3년 간지 보기'));slides[2].append(cycles);const flow=document.getElementById('tab-flow');flow.hidden=false;flow.removeAttribute('role');flow.removeAttribute('aria-labelledby');cycles.append(flow);
  move('.month-switch',3);move('#month-detail',3);
  for(let i=4;i<=7;i++){
   const content=element('div','reader-life-content');content.id='reader-content-'+sections[i][0];content.innerHTML=window.OngyeolInsights.category(r,sections[i][0]);slides[i].append(content);
   const scenes=[...content.querySelectorAll('.interpretation-scene')];
   // Put the first chart-specific scene ahead of the general introduction.
   if(scenes.length>1)content.insertBefore(scenes[1],scenes[0]);
   [...content.querySelectorAll('.interpretation-scene')].slice(1).forEach(scene=>{
    const detail=element('details','reader-extra');detail.append(element('summary','',scene.querySelector('h4').textContent));scene.replaceWith(detail);detail.append(scene);
   });
  }
  move('.personal-sinsal',8);move('#tab-sinsal',8);move('.special-overview',8);
  move('#tab-chart',9);move('.personal-connections',9);
  move('.couple-section',10);
  move('.share-result',11);move('.keyword-game',11);
  move('#detailed-report',12);
  [['.story-hub','내 매력·반전 이야기 더 읽기'],['.year-explorer','3년의 글자 더 비교하기'],['.reflection-card','내 일간에 맞춘 질문'],['.surface-overview','일간 상징과 표면 글자 보기']].forEach(([selector,label])=>{
   const node=document.querySelector(selector);if(!node)return;
   const detail=element('details','reader-extra');detail.append(element('summary','',label));detail.append(node);slides[12].append(detail);
  });
  // Keep legacy anchors and calculation containers, without presenting two result UIs.
  const oldCategory=document.querySelector('.category-insights');if(oldCategory)archive.append(oldCategory);
  overview.replaceChildren();archive.append(overview);const tabs=results.querySelector('.tabs');archive.append(tabs);const summary=document.getElementById('summary');archive.append(summary);
  results.querySelector('.result-heading').after(shell);results.append(archive);
  const state={shell,track,slides,index:0,timer:null,target:null,onScroll:null,observer:null};instance=state;
  function measure(){if(instance!==state)return;track.style.height=Math.max(180,Math.ceil(slides[state.index].getBoundingClientRect().height))+'px';if(track.scrollTop!==0)track.scrollTop=0;}
  function update(index){
   index=Math.max(0,Math.min(slides.length-1,index));state.index=index;
   slides.forEach((slide,i)=>{slide.inert=i!==index;slide.setAttribute('aria-current',String(i===index));});
   nav.querySelectorAll('[data-reader-target]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.readerTarget===sections[index][0])));
   shell.querySelector('#reader-position').textContent=(index+1)+' / '+slides.length;
   shell.querySelector('#reader-announcement').textContent=sections[index][1];
   shell.querySelector('.reader-progress>span').style.width=((index+1)/slides.length*100)+'%';
   shell.querySelector('[data-reader-step="-1"]').disabled=index===0;shell.querySelector('[data-reader-step="1"]').disabled=index===slides.length-1;
   measure();
  }
  state.go=(id,options={})=>{
   const index=typeof id==='number'?id:sections.findIndex(v=>v[0]===id);if(index<0||index>=slides.length)return;
   const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const distant=Math.abs(index-state.index)>1;state.target=index;update(index);track.scrollTo({left:index*track.clientWidth,behavior:options.instant||reduce||distant?'instant':'smooth'});
   if(options.focus)slides[index].querySelector('h3').focus({preventScroll:true});
  };
  slides.forEach(s=>s.querySelector('h3').tabIndex=-1);
  shell.addEventListener('click',event=>{
   const target=event.target.closest('[data-reader-target]'),step=event.target.closest('[data-reader-step]');
   if(target)state.go(target.dataset.readerTarget);
   if(step){state.go(state.index+Number(step.dataset.readerStep));shell.scrollIntoView({behavior:'smooth',block:'start'});}
  });
  track.addEventListener('keydown',event=>{
   if(event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
   let next;if(event.key==='ArrowRight')next=state.index+1;else if(event.key==='ArrowLeft')next=state.index-1;else if(event.key==='Home')next=0;else if(event.key==='End')next=slides.length-1;else return;
   event.preventDefault();state.go(next);
  });
  state.onScroll=()=>{
   clearTimeout(state.timer);state.timer=setTimeout(()=>{state.target=null;update(Math.round(track.scrollLeft/Math.max(1,track.clientWidth)));},120);
  };track.addEventListener('scroll',state.onScroll,{passive:true});
  state.observer=new ResizeObserver(()=>{
   const desired=state.index*track.clientWidth;
   if(state.width!==track.clientWidth){state.width=track.clientWidth;track.scrollTo({left:desired,behavior:'instant'});}
   measure();
  });state.observer.observe(shell);slides.forEach(s=>state.observer.observe(s));
  update(0);
 }
 function reveal(target){if(!instance)return;const slide=target.closest('.reader-slide');if(slide)instance.go(slide.dataset.readerPage,{instant:true});let parent=target.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}}
 window.OngyeolReader={mount,reset,reveal,go:id=>instance?.go(id),sections};
})();
