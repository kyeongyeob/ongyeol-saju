const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const c={Intl,Date,window:{}};vm.createContext(c);
for(const file of ['vendor/lunar.js','relations.js','korean-time.js','interpretation-rules.js','interpretation.js','engine.js']){
 if(file==='engine.js')c.window.Solar=c.Solar;
 vm.runInContext(fs.readFileSync(path.join(__dirname,'dist',file),'utf8'),c);
}
const T=c.window.OngyeolTime,E=c.window.OngyeolEngine;
const calculate=(date,time,options={})=>E.calculate({date,time,longitude:126.978,gender:1,correction:false,...options});
const gz=(r,i)=>r.pillars[i].gan+r.pillars[i].zhi;
assert.equal(gz(calculate('2024-02-04','17:00'),0),'癸卯');
assert.equal(gz(calculate('2024-02-04','17:00'),1),'乙丑');
assert.equal(gz(calculate('2024-02-04','17:30'),0),'甲辰');
assert.equal(gz(calculate('2024-02-04','17:30'),1),'丙寅');
assert.equal(gz(calculate('1990-05-15','00:20',{correction:true}),2),'己卯');
assert.equal(gz(calculate('1990-05-15','00:20'),2),'庚辰');
assert.equal(calculate('1990-05-15','00:20',{correction:true}).pillars[3].zhi,'子');
assert.equal(calculate('1990-05-15','00:20').pillars[3].zhi,'子');
assert.notEqual(gz(calculate('1990-05-15','23:40',{daySect:1}),2),gz(calculate('1990-05-15','23:40',{daySect:2}),2));
assert.equal(gz(calculate('1990-05-15','22:40',{daySect:1}),2),gz(calculate('1990-05-15','22:40',{daySect:2}),2));
assert.equal(gz(calculate('1990-05-15','23:20',{correction:true,daySect:1}),2),gz(calculate('1990-05-15','23:20',{correction:true,daySect:2}),2));
assert.notDeepEqual(calculate('1990-05-15','09:00',{yunSect:1}).timing.yunDuration,calculate('1990-05-15','09:00',{yunSect:2}).timing.yunDuration);
const old=calculate('1954-04-01','12:00',{correction:true});assert.equal(old.timing.standard,510);assert.equal(old.timing.offset,510);assert(Math.abs(old.timing.longitudeMinutes+2.088)<1e-8);
assert.equal(calculate('1955-06-01','12:00').timing.offset,570);
assert.equal(calculate('1948-07-01','12:00').timing.offset,600);
assert.equal(calculate('1961-08-10','12:00').timing.offset,540);
assert.equal(calculate('1987-07-01','12:00').timing.offset,600);
assert.equal(calculate('1988-07-01','12:00').timing.offset,600);
assert.equal(calculate('1988-11-01','12:00').timing.offset,540);
assert.throws(()=>calculate('1988-05-08','02:30'),/건너뛴/);
assert.throws(()=>calculate('1961-08-10','00:15'),/건너뛴/);
assert.throws(()=>calculate('1988-10-09','02:30'),/두 번/);
assert.throws(()=>calculate('1954-03-20','23:45'),/두 번/);
const first=calculate('1988-10-09','02:30',{transitionChoice:'earlier'}),last=calculate('1988-10-09','02:30',{transitionChoice:'later'});
assert.equal(last.timing.utc-first.timing.utc,3600000);assert.equal(first.timing.offset,600);assert.equal(last.timing.offset,540);
for(const change of T.transitions){
 const oldOffset=T.offsetAt(change.at-1).offset,newOffset=T.offsetAt(change.at).offset;
 assert.equal(newOffset,change.offset);
 if(newOffset===oldOffset)continue;
 const midpoint=change.at+(oldOffset+newOffset)/2*60000;
 assert.throws(()=>T.resolveCivil(midpoint),newOffset>oldOffset?/건너뛴/:/두 번/);
 if(newOffset<oldOffset)assert.equal(T.resolveCivil(midpoint,'later').utc-T.resolveCivil(midpoint,'earlier').utc,(oldOffset-newOffset)*60000);
}
// Independent minute fixtures: KASI 2024 monthly Jie, published in KST.
const terms=[['小寒',1,6,5,49],['立春',2,4,17,27],['惊蛰',3,5,11,23],['清明',4,4,16,2],['立夏',5,5,9,10],['芒种',6,5,13,10],['小暑',7,6,23,20],['立秋',8,7,9,9],['白露',9,7,12,11],['寒露',10,8,4,0],['立冬',11,7,7,20],['大雪',12,7,0,17]];
const table=c.Solar.fromYmdHms(2024,7,1,12,0,0).getLunar().getJieQiTable();
for(const [name,m,d,h,mi]of terms){
 const solar=table[name];assert(solar,'missing term '+name);
 const kst=Date.UTC(solar.getYear(),solar.getMonth()-1,solar.getDay(),solar.getHour()+1,solar.getMinute(),solar.getSecond());
 assert(Math.abs(kst-Date.UTC(2024,m-1,d,h,mi))<60000,'KASI term discrepancy: '+name);
 const birth=ms=>{const t=new Date(ms);return calculate(t.toISOString().slice(0,10),t.toISOString().slice(11,16));};
 const before=birth(kst-600000),after=birth(kst+600000);
 assert.notEqual(gz(before,1),gz(after,1),'month must change at '+name);
 const corrected=birth(kst-300000);assert.equal(gz(corrected,1),gz(before,1));
}
const winter=T.equationOfTime(Date.UTC(2024,1,11,12)),autumn=T.equationOfTime(Date.UTC(2024,10,3,12));
assert(winter<-13&&winter>-16);assert(autumn>15&&autumn<18);
const mean=calculate('1990-05-15','09:00',{correction:true}),apparent=calculate('1990-05-15','09:00',{correction:true,equation:true});
assert.equal(mean.timing.termClock,apparent.timing.termClock);assert.notEqual(mean.timing.dayClock,apparent.timing.dayClock);
assert.equal(calculate('1990-05-15','09:00',{equation:true}).timing.eotMinutes,0);
for(const invalid of [['2024-02-30','10:00'],['1947-01-01','10:00'],['1990-01-01','25:00']])assert.throws(()=>calculate(...invalid));
console.log('PASS: KASI 12 Jie boundaries, supplied 4 pillar examples, 26 historic transitions, DST gaps/overlaps, midnight/23h conventions, Yun methods, EOT sign and isolation');
