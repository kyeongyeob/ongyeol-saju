(function(){
 'use strict';
 const config=()=>window.OngyeolInterpretationRules;
 const typeNames={比肩:'비견',劫财:'겁재',食神:'식신',伤官:'상관',偏财:'편재',正财:'정재',七杀:'편관',正官:'정관',偏印:'편인',正印:'정인'};
 function relation(day,other){const a=config().elements.indexOf(day),b=config().elements.indexOf(other);return ['비겁','식상','재성','관성','인성'][(b-a+5)%5];}
 function distribution(r){
  const q=config(),raw=Object.fromEntries(q.elements.map(e=>[e,0])),evidence=[];
  r.pillars.filter(p=>!p.unknown).forEach(p=>{
   raw[r.elements[p.gan]]+=1;evidence.push({position:p.label,gan:p.gan,source:'천간',weight:1,element:r.elements[p.gan]});
   const hidden=p.hiddenStems,ratios=q.hiddenRatios[hidden.length];
   hidden.forEach((s,i)=>{const weight=q.pillarWeights[p.label]*ratios[i];raw[s.element]+=weight;evidence.push({position:p.label,gan:s.gan,source:'지장간',weight,element:s.element});});
  });
  const total=Object.values(raw).reduce((a,b)=>a+b,0),percent=Object.fromEntries(q.elements.map(e=>[e,raw[e]/total*100]));
  const sorted=q.elements.slice().sort((a,b)=>raw[b]-raw[a]);
  return {raw,total,percent,evidence,dominant:sorted.filter(e=>Math.abs(raw[e]-raw[sorted[0]])<1e-9),low:q.elements.filter(e=>percent[e]<10),absent:q.elements.filter(e=>raw[e]===0)};
 }
 function strength(r,weighted){
  const q=config(),day=r.elements[r.day],month=q.seasonElement[r.pillars[1].zhi];
  const season={비겁:1,인성:0.85,식상:0.4,재성:0.25,관성:0.2}[relation(day,month)];
  const roots=r.pillars.filter(p=>!p.unknown&&['일주','시주'].includes(p.label)).map(p=>({position:p.label,zhi:p.zhi,ratio:p.hiddenStems.reduce((sum,s,i)=>sum+(s.element===day?q.hiddenRatios[p.hiddenStems.length][i]:0),0),stems:p.hiddenStems.filter(s=>s.element===day).map(s=>s.gan)}));
  const rootScore=roots.reduce((sum,v)=>sum+v.ratio,0)/roots.length;
  const support=q.elements.filter(e=>['비겁','인성'].includes(relation(day,e))).reduce((sum,e)=>sum+weighted.percent[e],0)/100;
  const score=100*(season*q.strengthWeights.season+rootScore*q.strengthWeights.roots+support*q.strengthWeights.support);
  const label=score<q.thresholds.weak?'신약 경향':score>q.thresholds.strong?'신강 경향':'중간 경향';
  return {score,label,season:season*100,month,seasonRelation:relation(day,month),roots,rootScore:rootScore*100,support:support*100,provisional:r.pillars.some(p=>p.unknown)};
 }
 function structure(r,s,w){
  const q=config(),month=r.pillars[1],main=month.hiddenStems[0],ten=LunarUtil.SHI_SHEN[r.day+main.gan];
  let candidate=(typeNames[ten]||'월령')+'격 후보';
  if(q.lu[r.day]===month.zhi)candidate='건록격 후보';
  else if(q.yangBlade[r.day]===month.zhi)candidate='양인격 후보';
  else if(['比肩','劫财'].includes(ten))candidate='월령 비겁형 · 일반격 유보';
  const visible=r.pillars.filter(p=>!p.unknown&&p.label!=='일주'&&p.gan===main.gan).map(p=>p.label+' '+p.gan);
  const day=r.elements[r.day],wanted=s.label==='신약 경향'?['비겁','인성']:s.label==='신강 경향'?['식상','재성','관성']:[];
  const candidates=q.elements.filter(e=>wanted.includes(relation(day,e))).sort((a,b)=>w.percent[a]-w.percent[b]);
  return {candidate,main:main.gan,ten:typeNames[ten],visible,school:q.version,balanceCandidates:candidates.slice(0,2),balanceMethod:'억부 참고 · 낮은 비중의 후보부터 제시',limits:q.limits};
 }
 function specials(r){
  const q=config(),dayBased=r.twelveDay,available=r.pillars.filter(p=>!p.unknown);
  const simple=[['도화','년살'],['역마','역마'],['화개','화개']].map(([name,part])=>{const s=dayBased.find(v=>v.name.includes(part));return {name,hits:s.positions,basis:'일지 '+s.base+' 삼합 기준 → '+s.target};});
  simple.push({name:'천을귀인',hits:available.filter(p=>q.noble[r.day].includes(p.zhi)).map(p=>p.label+' '+p.zhi),basis:'일간 '+r.day+' → '+q.noble[r.day]});
  const pairs=r.branchRelations.pairs.filter(p=>q.ghostPairs.some(set=>set.includes(p.a.zhi)&&set.includes(p.b.zhi)&&p.a.zhi!==p.b.zhi));
  simple.push({name:'귀문',hits:pairs.map(p=>p.label),basis:'子酉·丑午·寅未·卯申·辰亥·巳戌 짝 존재 규칙'});
  simple.push({name:'백호',hits:available.filter(p=>q.whiteTigerPillars.includes(p.gan+p.zhi)).map(p=>p.label+' '+p.gan+p.zhi),basis:'甲辰·乙未·丙戌·丁丑·戊辰·壬戌·癸丑의 기둥 대조'});
  return simple.map(v=>({...v,status:v.hits.length?'해당':r.pillars.some(p=>p.unknown)?'알려진 세 기둥에 없음 · 시주 미확인':'해당 없음'}));
 }
 function interactions(r,ganZhi,label){
  const incoming={label,gan:ganZhi[0],zhi:ganZhi[1]},origin=r.pillars.filter(p=>!p.unknown);
  const analyzed=window.OngyeolRelations.analyze([...origin,incoming]);
  return analyzed.found.filter(f=>f.members.some(p=>p.label===label));
 }
 function yearly(r,y){return {...y,relations:interactions(r,y.ganZhi,y.year+'년 세운')};}
 function timeline(r){
  const years=r.years.map(y=>yearly(r,y)),months=[];
  const names=['小寒','立春','惊蛰','清明','立夏','芒种','小暑','立秋','白露','寒露','立冬','大雪'];
  const year=r.year,table=Solar.fromYmdHms(year,7,1,12,0,0).getLunar().getJieQiTable();
  names.forEach((name,i)=>{
   const term=table[name],beijing=Date.UTC(term.getYear(),term.getMonth()-1,term.getDay(),term.getHour(),term.getMinute(),term.getSecond());
   const d=new Date(beijing+60000),month=Solar.fromYmdHms(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds()).getLunar().getEightChar().getMonth();
   months.push({month:i+1,term:name,start:window.OngyeolTime.stamp(beijing+3600000),ganZhi:month,relations:interactions(r,month,(i+1)+'월 월운')});
  });
  const nextTerm=Solar.fromYmdHms(year+1,7,1,12,0,0).getLunar().getJieQiTable()['小寒'];
  const nextStart=window.OngyeolTime.stamp(Date.UTC(nextTerm.getYear(),nextTerm.getMonth()-1,nextTerm.getDay(),nextTerm.getHour()+1,nextTerm.getMinute(),nextTerm.getSecond()));
  months.forEach((m,i)=>{m.end=i<11?months[i+1].start:nextStart;});
  const cycles=r.cycles.map(v=>({...v,relations:interactions(r,v.ganZhi,v.start+'년 시작 대운')}));
  // Compare complete start dates, including within-year changes.
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());
  const active=cycles.find(v=>today>=v.startDate&&today<v.endDate),next=cycles.find(v=>v.startDate>today);
  return {years,months,cycles,active,next,today};
 }
 function extract(r,w,s,special,t){
  const tags=[{id:s.label.split(' ')[0],evidence:'득령 '+s.season.toFixed(0)+' · 득지 '+s.rootScore.toFixed(0)+' · 득세 '+s.support.toFixed(0)}];
  w.low.forEach(e=>tags.push({id:e+'_낮음',evidence:'지장간·월지 가중 비중 '+w.percent[e].toFixed(1)+'%'}));
  special.filter(v=>v.hits.length).forEach(v=>tags.push({id:v.name,evidence:v.hits.join(' · ')}));
  const visible=r.pillars.filter(p=>!p.unknown&&p.label!=='일주').map(p=>LunarUtil.SHI_SHEN[r.day+p.gan]);
  if(visible.some(v=>['食神','伤官'].includes(v))&&visible.some(v=>['正财','偏财'].includes(v)))tags.push({id:'식상생재_후보',evidence:'천간 식상·재성 동시 존재 · 흐름 성립 확정 아님'});
  if(visible.some(v=>['正官','七杀'].includes(v))&&visible.some(v=>['正印','偏印'].includes(v)))tags.push({id:'관인상생_후보',evidence:'천간 관성·인성 동시 존재 · 흐름 성립 확정 아님'});
  const clash=t.years[0].relations.find(v=>v.kind==='충'&&v.members.some(p=>p.label==='일주'));
  if(clash)tags.push({id:'올해_일지충',evidence:clash.label});
  if(t.cycles.some(v=>v.startDate.startsWith(String(r.year))))tags.push({id:'올해_대운교체',evidence:t.cycles.find(v=>v.startDate.startsWith(String(r.year))).startDate});
  return tags;
 }
 function enrich(r){
  const weighted=distribution(r),s=strength(r,weighted),str=structure(r,s,weighted),special=specials(r),time=timeline(r);
  r.interpretation={weighted,strength:s,structure:str,special,timeline:time,tags:extract(r,weighted,s,special,time),version:config().version};
  return r;
 }
 window.OngyeolInterpretation={enrich,distribution,strength,structure,specials,interactions,typeNames,relation};
})();
