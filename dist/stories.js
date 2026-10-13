(function(){
 'use strict';
 const kinds=[['charm','매력','나는 어떤 매력이 있을까?'],['love','연애','좋아할 때 나는 어떻게 달라질까?'],['work','일','내 능력이 빛나는 순간은?'],['twist','반전','남들이 모르는 내 모습은?'],['friction','관계','왜 비슷한 갈등이 반복될까?'],['future','3년','앞으로 무엇에 관심을 두면 좋을까?']];
 const profiles={
  木:{charm:'가능성을 발견해주는 사람',love:'함께 자라는 관계가 편한 쪽',work:'아무것도 없던 곳에 방향을 만드는 순간',twist:'유연해 보여도 방향은 쉽게 놓지 않는 쪽',need:'서로의 다음 목표를 응원하는 것',signal:'상대가 하고 싶던 일을 기억했다가 함께 계획을 세우는 것',hurt:'성장하고 싶은 마음을 조급함으로만 받아들이는 말',scene:'막막한 계획에 첫 순서가 생겼을 때',practice:'완성된 답을 기다리기보다 첫 시도를 공유해보기',words:['시작을 만드는 사람','함께 성장하고 싶어','방향은 쉽게 못 놓아']},
  火:{charm:'마음을 밖으로 꺼내주는 사람',love:'함께 웃고 반응을 나누는 관계가 편한 쪽',work:'혼자 품던 생각에 사람들의 반응이 붙는 순간',twist:'밝게 표현해도 내 반응을 알아주길 바라는 쪽',need:'표현한 마음에 답이 돌아오는 것',signal:'재미있던 일과 좋은 소식을 가장 먼저 나누는 것',hurt:'내 열정을 가볍게 넘기거나 반응 없이 지나가는 태도',scene:'설명이 누군가의 참여로 이어졌을 때',practice:'하고 싶은 말을 다 쏟기 전에 상대의 반응을 확인해보기',words:['분위기를 밝히는 사람','반응이 있어야 신나','마음이 말에 드러나']},
  土:{charm:'오래 곁을 지켜주는 사람',love:'약속이 쌓일수록 마음이 놓이는 쪽',work:'흩어져 있던 일들이 꾸준히 굴러가기 시작하는 순간',twist:'차분해 보여도 떠안은 몫은 많을 수 있는 쪽',need:'서로의 약속을 작게라도 지키는 것',signal:'자주 하는 일을 기억하고 필요한 것을 미리 챙기는 것',hurt:'당연하다는 듯 내 시간과 돌봄을 기대하는 태도',scene:'여러 사람의 요구 사이에 유지할 기준을 세웠을 때',practice:'도와줄 부분과 각자가 맡을 부분을 먼저 나누어보기',words:['꾸준함이 내 무기','챙겨주는 편이야','내 몫이 많아지곤 해']},
  金:{charm:'필요한 순간에 확실해지는 사람',love:'애매한 말보다 분명한 행동이 편한 쪽',work:'복잡한 문제에서 끝낼 기준이 보이는 순간',twist:'단단해 보여도 내 기준에는 더 엄격할 수 있는 쪽',need:'말과 행동이 일치하는 것',signal:'상대가 곤란한 일을 실제로 해결해주거나 약속을 정확히 지키는 것',hurt:'분명하게 이야기한 기준을 계속 가볍게 넘기는 태도',scene:'무엇을 남기고 무엇을 덜어낼지 정했을 때',practice:'결론부터 말하기 전에 상대가 이해할 이유를 한 문장 더 붙여보기',words:['애매한 건 답답해','실제로 도와주는 편','내 기준에도 엄격해']},
  水:{charm:'말 뒤의 맥락을 읽어주는 사람',love:'생각을 편하게 나눌 수 있는 관계가 편한 쪽',work:'서로 따로 있던 정보가 하나의 길로 연결되는 순간',twist:'잘 맞춰주는 것 같아도 속으로는 여러 선택을 비교하는 쪽',need:'생각할 시간과 서로를 이해할 대화',signal:'상대가 지나가듯 한 말을 기억하고 조용히 다시 물어보는 것',hurt:'아직 정리 중인 생각에 바로 결론을 요구하는 말',scene:'새 자료에서 기존 문제를 보는 다른 관점을 찾았을 때',practice:'생각이 다 정리되기 전에도 지금 아는 것과 모르는 것을 나누어 말해보기',words:['맥락이 궁금한 사람','생각할 시간이 필요해','속으로 비교 중이야']}
 };
 const ten={比肩:['비견','내 방식으로 책임지는 역할','혼자 결정할 몫과 함께 결정할 몫을 나누는 일'],劫财:['겁재','사람들과 자원을 나누는 역할','협업의 기여와 역할을 분명히 정하는 일'],食神:['식신','꾸준히 만들어 보여주는 역할','내 리듬으로 결과를 쌓는 일'],伤官:['상관','익숙한 방법에 새 질문을 던지는 역할','문제 지적에 다른 방법을 붙이는 일'],偏财:['편재','사람과 기회를 연결하는 역할','새로운 가능성과 기존 약속의 범위를 맞추는 일'],正财:['정재','작은 결과를 지속적으로 관리하는 역할','한 번의 성과보다 이어지는 과정을 정리하는 일'],七杀:['편관','어려운 과제에 대응하는 역할','책임의 우선순위와 지원을 구분하는 일'],正官:['정관','공동의 기준을 지키는 역할','기준을 설명하고 담당 범위를 맞추는 일'],偏印:['편인','다른 관점에서 깊이 탐구하는 역할','아이디어를 작은 실험으로 확인하는 일'],正印:['정인','배움과 경험을 체계로 만드는 역할','배운 내용을 실제 상황에 적용하는 일']};
 const tones={木:['성장','가능성과 시작에 눈길이 가는 쪽'],火:['표현','이야기와 반응을 밖으로 꺼내는 쪽'],土:['지속','여러 요구를 담아 기반을 유지하는 쪽'],金:['기준','차이를 구분하고 완성도를 챙기는 쪽'],水:['관찰','맥락을 모으고 선택지를 비교하는 쪽']};
 const hit=(r,n)=>r.twelveDay.find(s=>s.name.includes(n)&&s.hits.length);
 const block=(title,text)=>'<div class="story-scene"><span>'+title+'</span><p>'+text+'</p></div>';
 function model(r){
  const e=r.elements[r.day],p=profiles[e],counts=Object.entries(r.counts),max=Math.max(...counts.map(v=>v[1])),top=counts.filter(v=>v[1]===max).map(v=>v[0]);
  const month=r.pillars[1],m=ten[LunarUtil.SHI_SHEN[r.day+month.gan]],branch=r.pillars[2];
  return {e,p,top,m,month,branch};
 }
 function article(r,key){
  const {e,p,top,m,month,branch}=model(r),peach=hit(r,'년살'),flower=hit(r,'화개'),horse=hit(r,'역마'),general=hit(r,'장성');
  let title,lead,scenes,evidence,question;
  if(key==='charm'){
   title=p.charm;lead='아주 화려하게 드러나지 않아도, 누군가에게 기억되는 방식은 사람마다 달라요. '+r.day+' 일간의 '+tones[e][0]+' 상징을 이야기로 읽으면, 당신의 매력은 “'+p.charm+'”에 가까운 장면에서 찾아볼 수 있어요.';
   scenes=block('처음에는 잘 안 보일 수 있어요','처음부터 자신을 설명하려고 애쓰기보다, '+p.scene+' 어떤 태도가 나오는지 떠올려보세요. 그때 함께 있던 사람은 당신의 어떤 행동을 기억하고 있을까요?')+block('가까워질수록 남는 인상',peach?'내 원국에는 년살(도화)이 '+peach.positions.join(' · ')+'에 있어요. 표에 붙은 이 이름을 표현과 시선의 주제로 읽으면, 무엇을 보여주고 누구의 반응을 중요하게 생각하는지가 흥미로운 질문이 됩니다.':flower?'화개살이 '+flower.positions.join(' · ')+'에 보여요. 원국의 이 표시를 몰입의 주제로 읽으면, 오래 관심을 둔 것에 대해 이야기할 때 드러나는 모습에 주목해볼 수 있어요.':general?'장성살이 '+general.positions.join(' · ')+'에 보여요. 주도적인 역할의 상징과 연결해 읽으면, 판단이 필요한 순간에 어떤 기준을 꺼내는지가 인상적인 장면이 될 수 있어요.':'어떤 신살이 붙었는지와 별개로, 당신을 자주 찾는 사람에게 “내가 어떤 순간에 도움이 되니?”라고 물어보세요. 계산된 글자와 실제로 기억되는 매력은 서로 비교해볼 수 있는 다른 정보입니다.')+block('매력을 더 잘 전달하려면',p.practice+'. 강점을 크게 포장하는 일보다 평소의 작은 행동을 다른 사람이 이해할 수 있게 보여주는 경험이 도움이 될 수 있어요.');
   evidence='일간 '+r.day+'('+e+')'+(peach?' · '+peach.positions.join(' · ')+' 년살':flower?' · '+flower.positions.join(' · ')+' 화개살':general?' · '+general.positions.join(' · ')+' 장성살':'');question='친한 사람은 나를 어떤 한 장면으로 기억할까?';
  }else if(key==='love'){
   title=p.love;lead='설레는 방식과 편안해지는 방식이 꼭 같지는 않아요. '+r.day+' 일간의 상징으로 읽는 관계의 질문은 “'+p.need+'이 나에게 얼마나 중요한가?”예요. 다음 장면이 내 경험과 닮았는지 살펴보세요.';
   scenes=block('좋아하는 마음이 행동으로 나온다면',p.signal+'이 나에게 익숙한 표현인지 떠올려보세요. 상대가 같은 행동을 관심의 표현으로 읽는지는 별도로 확인해보면 좋습니다.')+block('서운함이 시작될 수 있는 장면',p.hurt+'가 실제로 내게 불편한지 생각해보세요. 그때 원하는 것이 설명인지, 공감인지, 행동의 변화인지 구분하면 말하고 싶은 마음이 더 정확해집니다.')+block('나와 잘 맞는 관계의 조건','“어떤 띠가 잘 맞을까?”보다 먼저 '+p.need+'을 서로 편하게 이야기할 수 있는지 확인해보세요. 내 일지 '+branch.zhi+'가 연결된 관계는 '+(r.branchRelations.found.filter(f=>f.members.some(v=>v.label==='일주')).map(f=>f.kind).filter((v,i,a)=>a.indexOf(v)===i).join(' · ')||'현재 규칙에서 확인되지 않아요')+'. 이 표시는 관계의 대화 소재로 사용할 수 있고, 상대의 사주 없이 두 사람의 궁합을 계산한 결과는 아닙니다.');
   evidence='일간 '+r.day+' · 일지 '+branch.zhi+' · 일주에 연결된 원국 관계';question='나는 어떤 행동을 사랑받는 신호로 받아들일까?';
  }else if(key==='work'){
   title=p.work;lead='일을 잘한다는 말에도 여러 모습이 있어요. 당신의 일간이 '+p.scene+' 힘을 쓰는 장면을 상징한다면, 월간 '+month.gan+'의 '+m[0]+'은 “'+m[1]+'”을 함께 읽을 단서예요.';
   scenes=block('칭찬받았던 일을 떠올려보세요','최근 잘했다는 말을 들은 과제 하나를 골라보세요. 시작, 조사, 설명, 조율, 마무리 중 내가 맡았던 부분이 어디인지 보면 막연한 재능보다 실제 사용하는 능력을 찾기 쉬워요.')+block('편안하게 일할 조건','월간의 십성 '+m[0]+'을 업무 질문으로 바꾸면 '+m[2]+'이 됩니다. 역할이 분명할 때와 자유도가 높을 때 중 어디에서 내 방식이 잘 드러나는지도 비교해보세요.')+block('능력은 있는데 힘만 드는 때','잘하는 부분을 계속 맡다 보면 같은 책임이 반복될 수 있어요. 내가 해야 하는 일과 할 수 있어서 맡아온 일을 구분하고, '+p.practice+'. 직업 하나를 사주로 지정하기보다 실제 경험과 맞는 작업 조건을 찾아보는 방식입니다.');
   evidence='일간 '+r.day+' · 월간 '+month.gan+' → '+m[0];question='내가 잘하는 일을 지금의 환경에서도 잘 쓸 수 있을까?';
  }else if(key==='twist'){
   const topText=top.map(v=>tones[v][0]).join('·'),different=!top.includes(e);
   title=different?'내 출발점과 많이 보이는 글자가 달라요':p.twist;
   lead=different?'일간은 '+r.day+'('+e+')인데 표면에서는 '+top.join('·')+' 글자가 가장 많아요. 나를 읽는 출발점과 자주 보이는 구성이 다르다는 점이 이 원국의 재미있는 대비입니다. 이를 실제 겉모습과 속마음의 검사 결과로 읽지는 않아요.':'일간 '+r.day+'의 '+tones[e][0]+' 상징과 원국에서 가장 많은 '+topText+' 주제가 같은 방향에 놓여 있어요. 그래서 한 가지 장점이 어떤 조건에서는 부담이 되는지 읽어보는 이야기가 됩니다.';
   scenes=block('친한 사람이 아는 모습',p.twist+'이라는 문장이 경험과 닮았는지 확인해보세요. 밖에서 맡은 역할과 혼자 있을 때 필요한 것은 다를 수 있어요.')+block('이 원국에서 눈에 띄는 대비',different?'일간의 '+tones[e][0]+' 상징은 '+tones[e][1]+'이고, 많이 보이는 '+topText+'는 '+top.map(v=>tones[v][1]).join(' · ')+'으로 풀어 읽습니다. 두 관점이 내 생활에서 어떻게 함께 나타나는지 비교해보세요.':'한 방향의 주제가 반복될 때는 그 방식을 믿고 쓰는 순간과 다른 방식을 빌리는 순간을 나누어볼 수 있어요. 글자 수가 많다고 그 특성이 반드시 더 강하다고 판정한 것은 아닙니다.')+block('나를 설명할 한 문장','“나는 '+p.words[0]+'. 하지만 '+p.words[2]+'.” 이 문장이 마음에 든다면 아래 공감 키워드에서 실제로 닮은 표현을 골라보세요. 맞지 않는 부분은 억지로 나의 성격에 붙이지 않아도 됩니다.');
   evidence='일간 '+r.day+'('+e+') · 표면 최다 '+top.join('·')+' '+Math.max(...Object.values(r.counts))+'개';question='처음 보는 사람과 친한 사람은 나를 다르게 설명할까?';
  }else if(key==='friction'){
   const pair=r.branchRelations.pairs.find(v=>v.kinds.includes('충'))||r.branchRelations.pairs.find(v=>v.kinds.some(k=>['해','파','자형','형(두 지지)','자묘형'].includes(k)))||r.branchRelations.pairs.find(v=>v.kinds.includes('육합'));
   const conflict=pair&&pair.kinds.some(k=>k!=='육합'&&k!=='동지 반복');
   title=pair?(conflict?'두 역할이 원하는 방향이 다를 때':'가까워질수록 확인할 약속'):'내 기준을 전하는 방식부터 살펴보세요';
   lead=pair?'내 원국에는 '+pair.label+'에서 '+pair.kinds.join(' · ')+'이 보여요. 이를 '+(conflict?'서로 다른 필요를 조율하는':'연결된 역할의 기대를 맞추는')+' 관점으로 읽으면, 관계에서 어떤 말이 빠져 있었는지 돌아볼 수 있습니다.':'알려진 글자에서 주요 쌍 관계가 확인되지 않더라도 실제 사람 사이에 의견 차이는 생길 수 있어요. 이 항목에서는 일간 '+r.day+'의 상징을 통해 내가 기준을 전달하는 장면을 살펴봅니다.';
   scenes=block('갈등 직전의 한 장면',p.hurt+'가 내 경험에서 반복되었나요? 그렇다면 상대가 무엇을 했는지와 내가 그 행동을 어떻게 해석했는지를 따로 적어보세요.')+block('미처 말하지 못한 필요','“왜 그렇게 해?”를 말하기 전에 “나는 '+p.need+'이 필요해”라는 표현이 지금 마음과 맞는지 생각해보세요. 자신의 필요를 말하는 일과 상대의 행동을 단정하는 일은 다릅니다.')+block('다음 대화에서 바꿀 한 가지',p.practice+'. 원국 관계가 있다는 이유로 갈등이 정해진 것은 아니며, 한 관계의 여러 이름을 여러 문제로 늘려 읽을 필요도 없습니다. 지금 실제로 반복되는 장면을 기준으로 확인해보세요.');
   evidence=pair?pair.label+' · '+pair.kinds.join(' / '):'일간 '+r.day+' · 알려진 원국 쌍 관계 미해당';question='같은 갈등에서 내가 정말 부탁하고 싶은 것은 무엇일까?';
  }else{
   title='세 해, 서로 다른 질문으로 읽어보세요';lead='같은 원국이라도 해마다 비교하는 글자는 달라져요. 앞으로 3년의 천간을 내 일간 '+r.day+'와 연결해, 어떤 주제에 관심을 둘지 이야기로 풀었습니다.';
   scenes=r.years.map(y=>{const t=ten[LunarUtil.SHI_SHEN[r.day+y.ganZhi[0]]],s=r.twelveDay.find(v=>v.target===y.ganZhi[1]);return block(y.year+'년 '+y.ganZhi+' · '+t[0],t[1]+'의 상징을 따라 '+t[2]+'을 돌아볼 수 있어요. 그 해의 지지 '+y.ganZhi[1]+'는 일지 기준 '+s.name+'에 해당합니다. 아래 연도 비교에서 원국 어느 위치와 연결되는지 확인해보세요.');}).join('');
   evidence='일간 '+r.day+'와 '+r.years.map(y=>y.year+'년 '+y.ganZhi).join(' · ')+' 비교';question='이 세 주제 중 지금 내 생활에 필요한 것은 무엇일까?';
  }
  return '<div class="story-title"><span class="eyebrow">'+kinds.find(v=>v[0]===key)[2]+'</span><h4>'+title+'</h4></div><p class="story-lead">'+lead+'</p>'+scenes+'<div class="story-question"><span>나에게 남기는 질문</span><strong>'+question+'</strong></div><details class="story-evidence"><summary>이 이야기가 나온 내 원국의 근거</summary><p>'+evidence+'</p><p>계산된 글자의 전통 상징을 일상 이야기로 풀어낸 참고 해석입니다. 경험과 닮은 부분을 골라 읽어주세요.</p></details>';
 }
 function keywords(r){const {p,m}=model(r);return [...p.words,m[0]+' · '+m[1],hit(r,'년살')?'표현할 때 살아나는 나':'행동으로 기억되고 싶어',hit(r,'화개')?'혼자 깊이 파는 관심사':'다른 관점을 들어보고 싶어',hit(r,'역마')?'새로운 경험이 궁금해':'내 리듬을 지키고 싶어',r.branchRelations.found.some(f=>f.kind==='충')?'변화와 유지 사이에서 고민해':'나만의 기준을 전하고 싶어',hit(r,'장성')?'주도해서 정리하고 싶어':'역할을 함께 나누고 싶어'];}
 function render(r){return '<section class="story-hub"><div class="personal-section-title"><div><span class="eyebrow">THE STORIES BEHIND YOUR CHART</span><h3>그래서, 나는 어떤 사람일까?</h3><p>내 원국으로 읽는 여섯 가지 이야기. 가장 궁금한 주제를 골라보세요.</p></div></div><div class="story-topics" role="group" aria-label="나의 사주 이야기 주제">'+kinds.map((v,i)=>'<button type="button" data-story="'+v[0]+'" aria-pressed="'+(i===0)+'"><span>'+v[1]+'</span><strong>'+v[2]+'</strong><b aria-hidden="true">↗</b></button>').join('')+'</div><div id="story-content" class="story-content" aria-live="polite">'+article(r,'charm')+'</div></section><section class="keyword-game"><span class="eyebrow">PICK YOUR OWN WORDS</span><h3>내가 고르는 나의 세 단어</h3><p>원국에서 꺼낸 표현 중 나와 닮은 것을 최대 세 개 골라보세요. 공감한 표현으로 내 소개 문장이 만들어져요.</p><div class="keyword-choices">'+keywords(r).map((s,i)=>'<button type="button" data-keyword="'+i+'" aria-pressed="false">'+s+'</button>').join('')+'</div><div id="keyword-result" class="keyword-result" aria-live="polite">마음에 드는 표현을 누르면 나의 한 문장이 여기에 나타나요.</div><p class="experience-note">선택은 공감한 문장을 모으는 놀이이며, 계산 결과나 사주 판정을 바꾸지 않습니다.</p></section>';}
 function sentence(r,selected){const words=keywords(r);return selected.length?'<span>내가 고른 나의 소개</span><strong>“'+selected.map(i=>words[i]).join(' · ')+'”</strong><p>이 세 단어가 나답게 느껴졌던 실제 장면 하나를 떠올려보세요.</p>':'마음에 드는 표현을 누르면 나의 한 문장이 여기에 나타나요.';}
 window.OngyeolStories={render,article,sentence,keywords,kinds};
})();
