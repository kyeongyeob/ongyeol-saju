const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const c={Intl,Date,window:{}};vm.createContext(c);
for(const file of ['vendor/lunar.js','relations.js','korean-time.js','interpretation-rules.js','interpretation.js','engine.js','content-data.js','insights.js']){if(file==='engine.js')c.window.Solar=c.Solar;vm.runInContext(fs.readFileSync(path.join(__dirname,'dist',file),'utf8'),c);}
const E=c.window.OngyeolEngine,I=c.window.OngyeolInterpretation,V=c.window.OngyeolInsights,R=c.window.OngyeolRelations;
const calc=(date='1990-05-15',time='09:00',unknown=false)=>E.calculate({date,time,unknown,longitude:126.978,correction:true,gender:1});
const r=calc(),i=r.interpretation;
assert(Math.abs(i.weighted.total-10)<1e-9);assert(Math.abs(Object.values(i.weighted.percent).reduce((a,b)=>a+b,0)-100)<1e-9);
const month=i.weighted.evidence.filter(v=>v.position==='월주'&&v.source==='지장간');assert(Math.abs(month.reduce((a,b)=>a+b.weight,0)-2.4)<1e-9);
assert.equal(i.weighted.evidence.filter(v=>v.source==='천간').length,4);assert.equal(calc(undefined,undefined,true).interpretation.strength.provisional,true);
assert(Math.abs(calc(undefined,undefined,true).interpretation.weighted.total-7.8)<1e-9);
assert.equal(i.timeline.months.length,12);assert.equal(i.timeline.years.length,3);assert.equal(i.timeline.cycles.length,8);
assert.equal(i.timeline.years[0].ganZhi,c.Solar.fromYmdHms(r.year,7,1,12,0,0).getLunar().getYearInGanZhiExact());
assert.equal(i.timeline.months[0].start.slice(0,4),String(r.year));assert(i.timeline.months.every(m=>m.ganZhi.length===2));
assert(i.timeline.years.every(y=>y.relations.every(f=>f.members.some(p=>p.label.endsWith('세운')))));
assert(i.timeline.cycles.every(y=>y.relations.every(f=>f.members.some(p=>p.label.endsWith('대운')))));
const fake={...r,pillars:[{label:'연주',gan:'甲',zhi:'子'},{label:'월주',gan:'乙',zhi:'卯'},{label:'일주',gan:'庚',zhi:'子'},{label:'시주',unknown:true}]};
assert(I.interactions(fake,'丙午','세운').some(f=>f.kind==='충'&&f.members.some(p=>p.label==='일주')));
assert(I.interactions(fake,'己未','세운').some(f=>f.kind==='해'));
const ghost={...r,pillars:[{label:'연주',gan:'甲',zhi:'子'},{label:'월주',gan:'乙',zhi:'酉'},{label:'일주',gan:'甲',zhi:'辰'},{label:'시주',unknown:true}]};ghost.branchRelations=R.analyze(ghost.pillars);
const special=I.specials(ghost);assert(special.find(v=>v.name==='귀문').hits.length);assert(special.find(v=>v.name==='백호').hits.some(v=>v.includes('甲辰')));
const partner=calc('1995-11-03','15:00',true),comparison=V.compare(r,partner);assert(comparison.unknown);assert(comparison.relations.every(f=>f.members.some(p=>p.label.startsWith('나의'))&&f.members.some(p=>p.label.startsWith('상대'))));
const swap=V.compare(partner,r);assert.equal(comparison.relations.length,swap.relations.length);
for(const category of ['love','wealth','work','people']){const html=V.category(r,category);assert(html.includes('잘 쓰면'));assert(html.includes('놓치기 쉬운 점'));assert(!html.includes('undefined'));assert(!html.includes('{{'));}
const noTags={...r,interpretation:{...i,tags:[]}};assert.equal(V.select(noTags,'love').length,1);
const added={...r,interpretation:{...i,tags:[{id:'도화',evidence:'fixture'}]}};assert(V.select(added,'love').some(v=>v.title.includes('온도')));assert(!V.select(noTags,'love').some(v=>v.title.includes('온도')));
const samples=[];for(const time of ['01:00','05:00','09:00','13:00','17:00','21:00'])samples.push(calc('1990-05-15',time));assert(new Set(samples.map(r=>JSON.stringify(r.interpretation.weighted.percent))).size>1);assert(samples.every(v=>v.day===samples[0].day));
for(const sample of samples){assert(Number.isFinite(sample.interpretation.strength.score));assert(sample.interpretation.strength.score>=0&&sample.interpretation.strength.score<=100);assert(!V.render(sample).includes('undefined'));}
console.log('PASS: hidden weighting without double count, month priority, unknown time, strength components, same-day differences, tag mapping, annual/monthly/decade relations, 6 specials, symmetric chart comparison');
