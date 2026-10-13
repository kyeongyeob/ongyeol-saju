(function () {
  'use strict';
  const elements = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水',子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
  function calculate(input) {
    if (!window.Solar) throw new Error('계산 라이브러리를 불러오지 못했습니다. vendor/lunar.js 파일을 확인해주세요.');
    const parts = input.date.split('-').map(Number);
    const time = (input.unknown ? '12:00' : input.time).split(':').map(Number);
    const [y,m,d] = parts;
    const raw = new Date(Date.UTC(y,m-1,d,time[0],time[1]));
    const today = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||!/^\d{2}:\d{2}$/.test(input.unknown?'12:00':input.time)||!Number.isFinite(raw.getTime())||y < 1948 || input.date > today || raw.getUTCMonth() !== m-1 || raw.getUTCDate() !== d||time[0]>23||time[1]>59) throw new Error('1948년 이후부터 오늘까지의 올바른 생년월일과 시각을 입력해주세요.');
    if (!Number.isFinite(input.longitude) || input.longitude < 124 || input.longitude > 132) throw new Error('출생지 경도는 124~132 사이로 입력해주세요.');
    if(!window.OngyeolTime)throw new Error('한국 시각 보정 파일 korean-time.js를 확인해주세요.');
    const timing=window.OngyeolTime.prepare(raw.getTime(),input),daySect=input.daySect===1?1:2,yunSect=input.yunSect===1?1:2;
    const chart = date => {const e=Solar.fromYmdHms(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate(),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds()).getLunar().getEightChar();e.setSect(daySect);return e;};
    // Solar terms and Yun use UTC+8 wall time; day/time use the selected Korean clock.
    const calendar = chart(new Date(timing.calendar)), clock = chart(new Date(timing.clock));
    const pillars = ['Year','Month','Day','Time'].map((key,i)=>{
      if (i===3 && input.unknown) return {label:'시주',unknown:true};
      const source=i<2?calendar:clock;
      const gan=source['get'+key+'Gan'](),zhi=source['get'+key+'Zhi']();
      return {label:['연주','월주','일주','시주'][i],gan,zhi,element:elements[gan],relation:i===2?'일간 · 나':LunarUtil.SHI_SHEN[clock.getDayGan()+gan]};
    });
    const counts={木:0,火:0,土:0,金:0,水:0};
    pillars.filter(p=>!p.unknown).forEach(p=>{counts[elements[p.gan]]++;counts[elements[p.zhi]]++;});
    const yun=calendar.getYun(input.gender,yunSect);
    // Apply the Yun duration to the Korean standard birth clock, not the UTC+8 date.
    const standard=new Date(timing.standardClock);
    let startSolar=Solar.fromYmdHms(standard.getUTCFullYear(),standard.getUTCMonth()+1,standard.getUTCDate(),standard.getUTCHours(),standard.getUTCMinutes(),standard.getUTCSeconds());
    startSolar=startSolar.nextYear(yun.getStartYear()).nextMonth(yun.getStartMonth()).next(yun.getStartDay()).nextHour(yun.getStartHour());
    const startYear=startSolar.getYear();
    const cycles=yun.getDaYun(9).slice(1).map((c,i)=>({ganZhi:c.getGanZhi(),start:startYear+i*10,end:startYear+i*10+9,age:startYear+i*10-y+1,startDate:startSolar.nextYear(i*10).toYmd(),endDate:startSolar.nextYear((i+1)*10).toYmd()}));
    const year=Number(today.slice(0,4));
    const years=[year,year+1,year+2].map(y=>({year:y,ganZhi:Solar.fromYmdHms(y,7,1,12,0,0).getLunar().getYearInGanZhiExact()}));
    const branches=pillars.filter(p=>!p.unknown);
    const day=clock.getDayGan(),dayBranch=clock.getDayZhi();
    const noble={甲:'丑未',戊:'丑未',庚:'丑未',乙:'子申',己:'子申',丙:'亥酉',丁:'亥酉',壬:'卯巳',癸:'卯巳',辛:'寅午'};
    const group=['申子辰','寅午戌','亥卯未','巳酉丑'].findIndex(g=>g.includes(dayBranch));
    const rules=[{name:'천을귀인',target:noble[day],basis:'일간 기준 귀인 지지',note:'도움을 주고받는 관계를 돌아보는 전통 상징입니다.'},{name:'도화',target:['酉','卯','子','午'][group],basis:'일지 삼합 그룹 기준 도화 지지',note:'표현과 대인관계의 상징으로 읽습니다. 관계의 경계와 소통을 살펴보세요.'},{name:'역마',target:['寅','申','巳','亥'][group],basis:'일지 삼합 그룹 기준 역마 지지',note:'이동과 변화의 상징으로 읽습니다. 일정과 변화에 대한 준비를 돌아보세요.'},{name:'화개',target:['辰','戌','未','丑'][group],basis:'일지 삼합 그룹 기준 화개 지지',note:'몰입과 성찰의 상징입니다. 혼자 집중하는 시간과 교류의 균형을 살펴보세요.'}];
    const sinsal=rules.map(r=>({...r,positions:branches.filter(p=>r.target.includes(p.zhi)).map(p=>p.label+' '+p.zhi)}));
    const relations=[];
    const pairs={'子丑':'육합','寅亥':'육합','卯戌':'육합','辰酉':'육합','巳申':'육합','午未':'육합','子午':'충','丑未':'충','寅申':'충','卯酉':'충','辰戌':'충','巳亥':'충'};
    for(let i=0;i<branches.length;i++) for(let j=i+1;j<branches.length;j++) {const a=branches[i],b=branches[j];const kind=pairs[a.zhi+b.zhi]||pairs[b.zhi+a.zhi];if(kind)relations.push(a.label+' '+a.zhi+' · '+b.label+' '+b.zhi+' : '+kind);}
    const result={pillars,counts,cycles,years,sinsal,relations,day,year,start:startSolar.toYmd(),elements,timing:{...timing,daySect,yunSect,dayClock:window.OngyeolTime.stamp(timing.clock),termClock:window.OngyeolTime.stamp(timing.calendar),forward:yun.isForward(),yunDuration:{years:yun.getStartYear(),months:yun.getStartMonth(),days:yun.getStartDay(),hours:yun.getStartHour()}}};
    if(!window.OngyeolRelations)throw new Error('지지 관계 계산 파일을 불러오지 못했습니다. relations.js를 확인해주세요.');
    if(!window.OngyeolInterpretation)throw new Error('해석 계산 파일 interpretation.js를 확인해주세요.');
    return window.OngyeolInterpretation.enrich(window.OngyeolRelations.enrich(result));
  }
  window.OngyeolEngine={calculate};
})();
