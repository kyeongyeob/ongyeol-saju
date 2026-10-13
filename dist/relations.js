(function(){
  'use strict';
  const branches='子丑寅卯辰巳午未申酉戌亥';
  const names=['겁살','재살','천살','지살','년살(도화)','월살','망신살','장성살','반안살','역마살','육해살','화개살'];
  const groups=['申子辰','寅午戌','巳酉丑','亥卯未'];
  const starts=['巳','亥','寅','申'];
  const rules={육합:['子丑','寅亥','卯戌','辰酉','巳申','午未'],충:['子午','丑未','寅申','卯酉','辰戌','巳亥'],파:['子酉','丑辰','寅亥','卯午','巳申','未戌'],해:['子未','丑午','寅巳','卯辰','申亥','酉戌']};
  const combine=[{name:'삼합',sets:['申子辰','寅午戌','巳酉丑','亥卯未'],elements:['水','火','金','木']},{name:'방합',sets:['寅卯辰','巳午未','申酉戌','亥子丑'],elements:['木','火','金','水']}];
  const role={연주:'처음 접한 환경과 사회적인 배경',월주:'사회 활동과 반복되는 일의 방식',일주:'자신의 기준과 가까운 관계',시주:'개인적인 구상과 장기 계획'};
  function twelve(pillars,base){
    const available=pillars.filter(p=>!p.unknown), group=groups.findIndex(g=>g.includes(base));
    if(group<0)throw Error('십이신살 기준 지지를 확인해주세요.');
    return names.map((name,i)=>{const target=branches[(branches.indexOf(starts[group])+i)%12];const hits=available.filter(p=>p.zhi===target);return {name,target,base,group:groups[group],positions:hits.map(p=>p.label+' '+p.zhi),hits,status:hits.length?'해당':pillars.some(p=>p.unknown)?'알려진 세 기둥에는 없음 · 시주 미확인':'해당 없음'};});
  }
  function analyze(pillars){
    const available=pillars.filter(p=>!p.unknown),pairs=[],found=[];
    for(let i=0;i<available.length;i++)for(let j=i+1;j<available.length;j++){
      const a=available[i],b=available[j],key=a.zhi+b.zhi,kinds=[];
      Object.entries(rules).forEach(([kind,sets])=>{if(sets.includes(key)||sets.includes(b.zhi+a.zhi))kinds.push(kind);});
      if('子卯'===key||'卯子'===key)kinds.push('자묘형');
      ['寅巳申','丑戌未'].forEach(g=>{if(a.zhi!==b.zhi&&g.includes(a.zhi)&&g.includes(b.zhi))kinds.push('형(두 지지)');});
      if(a.zhi===b.zhi&&'辰午酉亥'.includes(a.zhi))kinds.push('자형');
      if(a.zhi===b.zhi)kinds.push('동지 반복');
      const item={a,b,kinds,adjacent:j-i===1,label:a.label+' '+a.zhi+' ↔ '+b.label+' '+b.zhi};pairs.push(item);
      kinds.forEach(kind=>found.push({kind,label:item.label,members:[a,b],adjacent:item.adjacent}));
    }
    combine.forEach(rule=>rule.sets.forEach((set,i)=>{
      const present=[...set].filter(z=>available.some(p=>p.zhi===z));
      const full=present.length===3;
      // Only pairs including the central seasonal branch are called a half combination.
      const half=rule.name==='삼합'&&present.length===2&&present.includes(set[1]);
      if(full||half){const members=available.filter(p=>set.includes(p.zhi));found.push({kind:full?rule.name:'반합',set,element:rule.elements[i],members,missing:[...set].filter(z=>!present.includes(z)),label:members.map(p=>p.label+' '+p.zhi).join(' · ')});}
      if(rule.name==='방합'&&present.length===2)found.push({kind:'방합 일부',set,element:rule.elements[i],missing:[...set].filter(z=>!present.includes(z)),members:available.filter(p=>set.includes(p.zhi)),label:available.filter(p=>set.includes(p.zhi)).map(p=>p.label+' '+p.zhi).join(' · ')});
    }));
    ['寅巳申','丑戌未'].forEach(set=>{if([...set].every(z=>available.some(p=>p.zhi===z)))found.push({kind:'삼형 완비',set,members:available.filter(p=>set.includes(p.zhi)),label:available.filter(p=>set.includes(p.zhi)).map(p=>p.label+' '+p.zhi).join(' · ')});});
    return {pairs,found,unknown:pillars.some(p=>p.unknown)};
  }
  function enrich(r){
    r.twelveDay=twelve(r.pillars,r.pillars[2].zhi);r.twelveYear=twelve(r.pillars,r.pillars[0].zhi);
    r.branchRelations=analyze(r.pillars);
    r.pillars.filter(p=>!p.unknown).forEach(p=>{p.hiddenStems=(LunarUtil.ZHI_HIDE_GAN[p.zhi]||[]).map(gan=>({gan,relation:LunarUtil.SHI_SHEN[r.day+gan],element:r.elements[gan]}));});
    return r;
  }
  window.OngyeolRelations={twelve,analyze,enrich,rules,groups,role};
})();
