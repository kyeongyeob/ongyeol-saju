(function(){
 'use strict';
 const personas={
  甲:['곧게 자라는 개척자','큰 나무','목표의 기준을 세우고 꾸준히 나아가는 모습을 떠올려보세요.','방향을 정하는 힘','방법을 바꿀 여유'],
  乙:['틈에서 길을 찾는 조율자','풀과 덩굴','주변을 읽고 상황에 맞는 길을 찾아가는 모습을 떠올려보세요.','작은 차이를 읽는 힘','내 요구를 말할 용기'],
  丙:['분위기를 밝히는 전달자','태양','큰 그림을 나누고 사람들의 참여를 모으는 모습을 떠올려보세요.','생각을 드러내는 힘','마무리를 챙기는 시간'],
  丁:['깊이를 밝히는 탐구자','등불','한 사람과 한 과제에 집중해 빛을 모으는 모습을 떠올려보세요.','정성을 모으는 힘','나를 위한 경계'],
  戊:['중심을 잡는 설계자','산과 대지','여러 요구 속에서도 기준과 기반을 지키는 모습을 떠올려보세요.','중심을 지키는 힘','작게 시작하는 유연함'],
  己:['차근차근 키우는 관리자','밭과 정원','필요한 조건을 살피고 작은 변화를 쌓는 모습을 떠올려보세요.','꾸준히 돌보는 힘','역할을 나누는 여유'],
  庚:['핵심을 가르는 실행가','단단한 금속','문제의 중심을 찾고 결정을 행동으로 옮기는 모습을 떠올려보세요.','결단을 행동으로 옮기는 힘','설명을 건네는 시간'],
  辛:['완성도를 만드는 편집자','다듬은 보석','작은 차이를 알아보고 자신만의 기준으로 다듬는 모습을 떠올려보세요.','정확하게 다듬는 힘','중간 결과를 나눌 용기'],
  壬:['가능성을 잇는 탐험가','강과 바다','다양한 경험을 연결하며 새로운 길을 찾는 모습을 떠올려보세요.','넓게 연결하는 힘','하나를 끝내는 집중'],
  癸:['작은 신호를 읽는 관찰자','비와 이슬','세밀하게 관찰하고 생각을 쌓아 방법을 찾는 모습을 떠올려보세요.','섬세하게 살피는 힘','생각을 실행으로 옮길 기회']
 };
 const elements={木:['목','성장','#607b54'],火:['화','표현','#b96c50'],土:['토','축적','#b19a56'],金:['금','정리','#858893'],水:['수','관찰','#587f91']};
 const short=['경쟁 속 나의 경계','외부 요구에 대응하기','바꿀 것과 기다릴 것','새로운 환경과 경험','표현과 타인의 시선','보이지 않는 축적','말과 공개적인 역할','주도권과 책임','쌓아온 기반 활용','변화의 목적 찾기','작은 부담 점검','몰입과 내적인 관심'];
 const ten={比肩:['비견','나의 기준을 세우는 해'],劫财:['겁재','함께 쓰는 자원을 살피는 해'],食神:['식신','꾸준히 결과를 만드는 해'],伤官:['상관','다른 표현을 시도하는 해'],偏财:['편재','기회와 연결을 살피는 해'],正财:['정재','일상의 기반을 관리하는 해'],七杀:['편관','도전의 우선순위를 정하는 해'],正官:['정관','역할과 책임을 살피는 해'],偏印:['편인','새 관점으로 탐구하는 해'],正印:['정인','배움과 지원을 정리하는 해']};
 const explanations={충:'서로 다른 방향의 요구를 조정하는 관점',육합:'연결된 역할과 협력의 조건을 살피는 관점',파:'익숙한 방식에서 수정할 부분을 찾는 관점',해:'말하지 않은 기대를 확인하는 관점',자묘형:'표현과 기준의 차이를 살피는 관점','형(두 지지)':'반복되는 조정과 역할의 기준을 살피는 관점',자형:'같은 기준을 되풀이하는 방식을 살피는 관점','동지 반복':'여러 위치에 반복된 관심을 살피는 관점',삼합:'세 글자가 연결된 구성을 함께 읽는 관점',반합:'중심 지지를 포함한 두 글자의 연결',방합:'같은 계절의 세 글자가 모인 구성','방합 일부':'계절 그룹의 두 글자만 확인된 구성','삼형 완비':'형 그룹의 세 글자가 모두 확인된 구성'};
 function yearDetail(r,index){
  const y=r.years[index],t=ten[LunarUtil.SHI_SHEN[r.day+y.ganZhi[0]]],incoming={label:y.year+'년',gan:y.ganZhi[0],zhi:y.ganZhi[1]};
  const links=r.pillars.filter(v=>!v.unknown).flatMap(v=>window.OngyeolRelations.analyze([v,incoming]).pairs.filter(pair=>pair.kinds.length));
  const sinsal=r.twelveDay.find(s=>s.target===incoming.zhi);
  return '<span class="eyebrow">'+y.year+' · '+y.ganZhi+'</span><h4>'+t[1]+'</h4><p>내 일간 '+r.day+'와 올해 천간 '+y.ganZhi[0]+'의 관계는 <strong>'+t[0]+'</strong>. 일지 기준 신살은 <strong>'+sinsal.name+'</strong>입니다.</p><div class="year-connections">'+(links.length?links.map(v=>'<p><strong>'+v.a.label+' '+v.a.zhi+' ↔ '+incoming.zhi+'</strong><span>'+v.kinds.join(' · ')+'</span></p>').join(''):'<p>올해 지지와 알려진 원국 사이에 검사한 쌍 관계는 없습니다.</p>')+'</div><p class="experience-note">연도 글자의 비교이며 사건 예측이 아닙니다. 연도 구간은 입춘 기준입니다.</p>';
 }
 function personal(r,input){
  const persona=personas[r.day],hits=r.twelveDay.map((s,i)=>({...s,index:i})).filter(s=>s.hits.length);
  const total=Object.values(r.counts).reduce((a,b)=>a+b,0),largest=Math.max(...Object.values(r.counts));
  const leading=Object.entries(r.counts).filter(([e,n])=>n===largest).map(([e])=>elements[e][0]).join('·');
  const graph=r.pillars.map(v=>'<div class="connection-pillar"><span>'+v.label+'</span><strong>'+(v.unknown?'?':v.gan+v.zhi)+'</strong><small>'+(v.unknown?'시간 미상':window.OngyeolRelations.role[v.label])+'</small></div>').join('');
  const meaningful=r.branchRelations.found.filter(f=>f.kind!=='동지 반복'&&f.kind!=='방합 일부');
  const unique=[...new Map(meaningful.map(f=>[f.kind+'|'+f.label,f])).values()];
  const relationLinks=unique.map(f=>'<a class="connection-row" href="#report-page-'+(['충','육합'].includes(f.kind)?16:['삼합','반합','방합'].includes(f.kind)?18:17)+'"><span class="kind-tag">'+f.kind+'</span><div><strong>'+f.label+'</strong><p>'+explanations[f.kind]+'</p></div><span aria-hidden="true">↗</span></a>').join('');
  return '<div class="personal-heading"><span class="eyebrow">MY SAJU, AT A GLANCE</span><h3>내 사주는 이렇게 생겼어요.</h3><p>나에게 해당하는 글자와 관계부터 먼저 읽어보세요.</p></div>'+
   window.OngyeolInsights.render(r)+
   '<details class="surface-overview"><summary>일간 상징과 표면 글자 수 비교 펼치기</summary><div class="personal-grid"><article class="persona-card"><div class="persona-orbit" aria-hidden="true"><span>'+r.day+'</span></div><span class="eyebrow">나의 사주 캐릭터</span><h3>'+persona[0]+'</h3><p>'+persona[2]+'</p><div class="persona-points"><span>살펴볼 강점<strong>'+persona[3]+'</strong></span><span>함께 챙길 균형<strong>'+persona[4]+'</strong></span></div><div class="persona-caption">일간 '+r.day+' · '+persona[1]+'의 전통 상징으로 만든 캐릭터</div></article>'+
   '<article class="element-snapshot"><span class="eyebrow">내 글자에 보이는 오행</span><h3>'+leading+'이 가장 많이 보여요.</h3><div class="element-strip" aria-label="표면 글자의 오행 구성">'+Object.entries(r.counts).map(([e,n])=>n?'<span style="flex:'+n+';background:'+elements[e][2]+'">'+e+'</span>':'').join('')+'</div><div class="element-legend">'+Object.entries(r.counts).map(([e,n])=>'<div><i style="background:'+elements[e][2]+'"></i><span>'+elements[e][0]+' · '+elements[e][1]+'</span><strong>'+n+' / '+total+'</strong></div>').join('')+'</div><p class="experience-note">표면 글자 수 비교입니다. 실제 기운의 강약이나 능력 점수는 아닙니다.</p><a href="#report-page-2" class="report-link">내 오행 설명 읽기 →</a></article></div>'+
   '</details>'+window.OngyeolStories.render(r)+
   '<section class="personal-sinsal"><div class="personal-section-title"><div><span class="eyebrow">내 원국에 해당하는 신살</span><h3>'+hits.length+'가지 이름이 보여요.</h3></div><span class="basis-pill">일지 '+r.pillars[2].zhi+' 기준</span></div><div class="my-sinsal-chips">'+hits.map(s=>'<a href="#report-page-'+(s.index+4)+'"><strong>'+s.name+'</strong><span>'+short[s.index]+'</span><small>'+s.positions.join(' · ')+'</small><b aria-hidden="true">↗</b></a>').join('')+'</div><p class="experience-note">해당하는 이름만 모았습니다. 개수는 운의 점수가 아닙니다.'+(input.unknown?' 출생 시간 미상으로 시주는 아직 확인하지 않았습니다.':'')+'</p></section>'+
   '<section class="personal-connections"><div class="personal-section-title"><div><span class="eyebrow">내 원국의 연결 지도</span><h3>어느 글자가 서로 연결될까?</h3></div></div><div class="connection-pillars">'+graph+'</div><div class="connection-list">'+(relationLinks||'<div class="empty-connections">알려진 글자에서는 주요 합·충·형·파·해 관계가 확인되지 않았어요. <a href="#report-page-18">전체 위치 대조 읽기 →</a></div>')+'</div><p class="experience-note">관계 이름과 위치를 함께 표시합니다. 같은 쌍에 여러 이름이 있어도 여러 사건을 뜻하지는 않습니다.</p></section>'+
   '<section class="year-explorer"><div class="personal-section-title"><div><span class="eyebrow">3년의 글자, 내 원국과 비교하기</span><h3>해를 바꾸면 연결도 달라져요.</h3></div></div><div class="year-switch" role="group" aria-label="비교할 연도">'+r.years.map((y,i)=>'<button type="button" data-year-index="'+i+'" aria-pressed="'+(i===0)+'"><span>'+y.year+'</span><strong>'+y.ganZhi+'</strong></button>').join('')+'</div><div id="year-explorer-detail" class="year-explorer-detail" aria-live="polite">'+yearDetail(r,0)+'</div></section>'+
   '<section class="reflection-card"><span class="eyebrow">읽고 끝내지 않는 나의 질문</span><h3>이 설명, 나랑 얼마나 닮았을까?</h3><p>“'+persona[3]+'”와 “'+persona[4]+'” 중 요즘 나에게 더 필요한 쪽을 골라보세요.</p><div class="reflection-buttons"><button type="button" data-reflection="strength">강점을 더 써보고 싶어</button><button type="button" data-reflection="balance">균형을 먼저 챙기고 싶어</button></div><p id="reflection-answer" class="reflection-answer" aria-live="polite">선택하면 나의 일간에 맞춘 질문이 열려요.</p></section>';
 }
 function sinsal(r,base='day',all=false){
  const list=base==='year'?r.twelveYear:r.twelveDay,other=base==='year'?r.twelveDay:r.twelveYear,baseName=base==='year'?'년지':'일지';
  const shown=list.map((s,i)=>({...s,index:i})).filter(s=>all||s.hits.length);
  return '<div class="sinsal-overview"><span class="eyebrow">MY SINSAL</span><h3>내게 해당하는 신살부터.</h3><p>기준을 바꾸어 비교하거나 전체 12개 항목을 열어볼 수 있어요.</p><div class="sinsal-controls"><div role="group" aria-label="신살 판정 기준"><button type="button" data-sinsal-base="day" aria-pressed="'+(base==='day')+'">일지 기준</button><button type="button" data-sinsal-base="year" aria-pressed="'+(base==='year')+'">년지 기준</button></div><button type="button" data-sinsal-all="'+(!all)+'" aria-pressed="'+all+'">'+(all?'해당 신살만 보기':'전체 12개 보기')+'</button></div><p class="sinsal-result-count">'+baseName+' '+list[0].base+' 기준 · '+list.filter(s=>s.hits.length).length+'가지 해당'+(r.branchRelations.unknown?' · 시주 미확인':'')+'</p></div>'+shown.map(s=>'<article class="sinsal-card is-mine"><span class="match-badge">'+(s.hits.length?'내 원국에 해당':r.branchRelations.unknown?'세 기둥에서 없음':'해당 없음')+'</span><h3>'+s.name+'</h3><p>'+short[s.index]+'</p><div class="sinsal-locations">'+(s.positions.join(' · ')||'확인된 위치 없음')+'</div><div class="basis">'+baseName+' '+s.base+' → 대상 '+s.target+'<br>다른 기준: '+(other[s.index].positions.join(' · ')||'확인된 위치 없음')+'</div><a class="report-link" href="#report-page-'+(s.index+4)+'">왜 해당하는지 읽기 →</a></article>').join('')+'<div class="sinsal-overview"><p class="experience-note">천을귀인은 별도 항목이에요. '+(r.sinsal[0].positions.length?'내 원국에는 '+r.sinsal[0].positions.join(' · ')+'에서 보여요.':'알려진 원국에서는 확인되지 않았어요.')+' <a href="#report-page-20">귀인 해설 →</a></p></div>';
 }
 const reflections={strength:['어떤 상황에서 이 강점이 도움이 되었나요?','이번 주 작은 과제 하나에서 그 방식을 다시 사용하고 결과를 확인해보세요.'],balance:['최근 이 균형이 필요했던 장면은 무엇인가요?','다음번 같은 상황에서 바꿀 행동 한 가지를 적어보세요.']};
 function reflection(r,choice){const s=personas[r.day],q=reflections[choice];return '<strong>'+s[choice==='strength'?3:4]+'</strong> '+q[0]+' '+q[1];}
 window.OngyeolExperience={personal,sinsal,yearDetail,reflection};
})();
