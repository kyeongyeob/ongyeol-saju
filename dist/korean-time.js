(function(){
 'use strict';
 const minute=60000;
 // IANA tzdb asia: Asia/Seoul and Rule ROK. Supported civil dates: 1948 onward.
 const dstPeriods=[
  [1948,6,1,0,9,13,0],[1949,4,3,0,9,11,0],[1950,4,1,0,9,10,0],[1951,5,6,0,9,9,0],
  [1955,5,5,0,9,9,0],[1956,5,20,0,9,30,0],[1957,5,5,0,9,22,0],[1958,5,4,0,9,21,0],
  [1959,5,3,0,9,20,0],[1960,5,1,0,9,18,0],[1987,5,10,2,10,11,3],[1988,5,8,2,10,9,3]
 ];
 const standardChanges=[{at:Date.UTC(1954,2,21)-540*minute,standard:510,offset:510},{at:Date.UTC(1961,7,10)-510*minute,standard:540,offset:540}];
 const transitions=[...standardChanges];
 dstPeriods.forEach(([y,sm,sd,sh,em,ed,eh])=>{
  const standard=y>=1954&&y<=1960?510:540;
  transitions.push({at:Date.UTC(y,sm-1,sd,sh)-standard*minute,standard,offset:standard+60});
  transitions.push({at:Date.UTC(y,em-1,ed,eh)-(standard+60)*minute,standard,offset:standard});
 });
 transitions.sort((a,b)=>a.at-b.at);
 function offsetAt(utc){let state={standard:540,offset:540};for(const change of transitions){if(utc<change.at)break;state=change;}return {standard:state.standard,offset:state.offset,dst:state.offset-state.standard};}
 function resolveCivil(wall,choice='reject'){
  const candidates=[510,540,570,600].map(offset=>({utc:wall-offset*minute,offset})).filter(c=>offsetAt(c.utc).offset===c.offset).sort((a,b)=>a.utc-b.utc);
  if(!candidates.length)throw Error('이 시각은 표준시·서머타임 전환으로 시계에서 건너뛴 시간입니다. 출생 기록의 날짜와 시각을 확인해주세요.');
  if(candidates.length>1&&choice==='reject')throw Error('이 시각은 시계가 뒤로 이동해 두 번 나타납니다. 계산 설정에서 전환 전 또는 전환 후 기록인지 선택해주세요.');
  const c=choice==='later'?candidates[candidates.length-1]:candidates[0];
  return {...c,...offsetAt(c.utc),ambiguous:candidates.length>1};
 }
 function equationOfTime(utc){
  // NOAA fractional-year approximation; minutes to add to local mean solar time.
  const date=new Date(utc),y=date.getUTCFullYear(),start=Date.UTC(y,0,1),days=(Date.UTC(y+1,0,1)-start)/86400000;
  const day=Math.floor((utc-start)/86400000)+1,hour=date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600;
  const gamma=2*Math.PI/days*(day-1+(hour-12)/24);
  return 229.18*(0.000075+0.001868*Math.cos(gamma)-0.032077*Math.sin(gamma)-0.014615*Math.cos(2*gamma)-0.040849*Math.sin(2*gamma));
 }
 function prepare(wall,input){
  const resolved=resolveCivil(wall,input.transitionChoice||'reject'),standard=resolved.utc+resolved.standard*minute;
  const longitudeMinutes=input.correction?(input.longitude-resolved.standard/4)*4:0;
  const eotMinutes=input.correction&&input.equation?equationOfTime(resolved.utc):0;
  return {...resolved,standardClock:standard,calendar:resolved.utc+480*minute,clock:standard+(longitudeMinutes+eotMinutes)*minute,longitudeMinutes,eotMinutes,meridian:resolved.standard/4};
 }
 const stamp=ms=>new Date(ms).toISOString().slice(0,19).replace('T',' ');
 window.OngyeolTime={prepare,resolveCivil,offsetAt,equationOfTime,stamp,transitions};
})();
