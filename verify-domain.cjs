const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const c={Intl,Date,window:{}};vm.createContext(c);
const read=f=>fs.readFileSync(path.join(__dirname,'dist',f),'utf8');
for(const file of ['vendor/lunar.js','relations.js','korean-time.js','interpretation-rules.js','interpretation.js','engine.js','report-details.js','report.js','content-data.js','insights.js','stories.js','experience.js']){
 if(file==='engine.js')c.window.Solar=c.Solar;
 vm.runInContext(read(file),c);
}
const R=c.window.OngyeolRelations;
const pillars=chars=>[...chars].map((zhi,i)=>({label:['연주','월주','일주','시주'][i],zhi,gan:'甲'}));
const expected={申:'巳午未申酉戌亥子丑寅卯辰',寅:'亥子丑寅卯辰巳午未申酉戌',巳:'寅卯辰巳午未申酉戌亥子丑',亥:'申酉戌亥子丑寅卯辰巳午未'};
for(const [base,targets]of Object.entries(expected)) {
 assert.equal(R.twelve(pillars('子午卯酉'),base).map(s=>s.target).join(''),targets);
 for(const member of R.groups.find(g=>g.includes(base)))assert.equal(R.twelve(pillars('子午卯酉'),member).map(s=>s.target).join(''),targets);
}
const kinds=chars=>new Set(R.analyze(pillars(chars)).found.map(f=>f.kind));
for(const [kind,pairs]of Object.entries(R.rules))for(const pair of pairs){assert(kinds(pair).has(kind),kind+' '+pair);assert(kinds([...pair].reverse().join('')).has(kind));}
assert(kinds('巳申').has('육합')&&kinds('巳申').has('파')&&kinds('巳申').has('형(두 지지)'));
assert(kinds('寅巳申').has('삼형 완비'));assert(!kinds('寅巳').has('삼형 완비'));
assert(kinds('子卯').has('자묘형'));assert(kinds('辰辰').has('자형'));assert(!kinds('子子').has('자형'));
assert(kinds('申子辰').has('삼합'));assert(!kinds('申辰').has('반합'));assert(kinds('申子').has('반합'));
assert(kinds('寅卯辰').has('방합'));assert(kinds('寅辰').has('방합 일부'));
const unknown=[...pillars('子午卯'),{label:'시주',unknown:true}];assert.equal(R.analyze(unknown).pairs.length,3);assert(R.twelve(unknown,'子').find(s=>s.target==='亥').status.includes('미확인'));
let minimum=Infinity,maximum=0;const stems=new Set();
for(const gender of [0,1])for(const unknownTime of [false,true])for(let d=1;d<=12;d++){
 const input={date:'1990-05-'+String(d).padStart(2,'0'),time:d%2?'23:30':'09:00',longitude:126.978,gender,unknown:unknownTime,correction:true};
 const result=c.window.OngyeolEngine.calculate(input);stems.add(result.day);
 assert.equal(result.twelveDay.length,12);assert.equal(result.twelveYear.length,12);
 assert.equal(result.branchRelations.pairs.length,unknownTime?3:6);
 const html=c.window.OngyeolReport.build(result,input),chars=html.replace(/<[^>]*>/g,'').length;
 assert.equal((html.match(/class="report-page"/g)||[]).length,20);assert.equal((html.match(/href="#report-page-/g)||[]).length,20);
 assert(chars>=26000,'Insufficient report content: '+chars);assert(!html.includes('undefined'));assert(!html.includes('NaN'));
 for(let n=1;n<=20;n++)assert(html.includes('id="report-page-'+n+'"'));
 assert.equal((html.match(/class="report-chapter"/g)||[]).length,20);
 const personal=c.window.OngyeolExperience.personal(result,input);
 assert(!personal.includes('undefined'));assert(!personal.includes('NaN'));
 assert.equal((personal.match(/data-year-index=/g)||[]).length,3);
 assert.equal((personal.match(/data-story=/g)||[]).length,6);
 assert.equal(c.window.OngyeolStories.keywords(result).length,9);
 for(const [key]of c.window.OngyeolStories.kinds){const story=c.window.OngyeolStories.article(result,key);assert(story.length>700);assert(!story.includes('undefined'));assert(!story.includes('NaN'));}
 const intro=c.window.OngyeolStories.sentence(result,[0,1,2]);assert(!intro.includes('undefined'));
 for(const base of ['day','year']){
  const own=base==='day'?result.twelveDay:result.twelveYear;
  const filtered=c.window.OngyeolExperience.sinsal(result,base,false);
  assert.equal((filtered.match(/class="sinsal-card/g)||[]).length,own.filter(s=>s.hits.length).length);
  assert.equal((c.window.OngyeolExperience.sinsal(result,base,true).match(/class="sinsal-card/g)||[]).length,12);
 }
 minimum=Math.min(minimum,chars);maximum=Math.max(maximum,chars);
}
assert.equal(stems.size,10);
console.log(JSON.stringify({result:'PASS',reports:48,dayStems:stems.size,chapters:20,characters:{minimum,maximum},rules:'12 sinsal / both bases / overlaps / incomplete groups / unknown time'}));
