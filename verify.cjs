const fs = require('fs'), vm = require('vm'), path = require('path');
const read = file => fs.readFileSync(path.join(__dirname, 'dist', file), 'utf8');
const nodes = {};
for (const m of read('index.html').matchAll(/id="([^"]+)"/g)) nodes[m[1]] = {
  value: '', checked: false, hidden: false, handlers: {},
  addEventListener(k,f) { this.handlers[k]=f; }, setAttribute(k,v) {this[k]=v;},
  scrollIntoView() {}, showModal() {this.open=true;}, close() {this.open=false;}, focus() {}
};
const tabs = ['chart','sinsal','flow'].map(name => Object.assign(nodes['nav-'+name],{dataset:{tab:name}}));
const c = {Intl,Date,window:{print(){c.printed=true;}},document:{getElementById:id=>nodes[id],querySelectorAll:()=>tabs}};
vm.createContext(c);
for(const file of ['vendor/lunar.js','relations.js','korean-time.js','interpretation-rules.js','interpretation.js','engine.js','report-details.js','report.js','content-data.js','insights.js','stories.js','experience.js','app.js']) {
  if(file==='engine.js') c.window.Solar=c.Solar;
  if(file==='app.js') c.OngyeolEngine=c.window.OngyeolEngine;
  vm.runInContext(read(file),c);
}
const check = (ok,label) => {if(!ok) throw Error(label);};
nodes.date.value='1990-05-15'; nodes.time.value='09:00'; nodes.city.value='126.978';
nodes.city.selectedOptions=[{textContent:'서울'}]; nodes.gender.value='1'; nodes.correction.checked=true;
nodes['birth-form'].handlers.submit({preventDefault(){}});
check(!nodes.error.textContent&&!nodes.results.hidden&&nodes.pillars.innerHTML.includes('庚'),'submit: '+nodes.error.textContent);
check((nodes['detailed-report'].innerHTML.match(/class="report-page"/g)||[]).length===20,'twenty report chapters');
check(nodes['detailed-report'].innerHTML.replace(/<[^>]*>/g,'').length>26000,'report length');
check((nodes['detailed-report'].innerHTML.match(/href="#report-page-/g)||[]).length===20,'report contents');
tabs[1].handlers.click();check(!nodes['tab-sinsal'].hidden&&nodes['tab-chart'].hidden,'tab');
for(const id of ['privacy','terms','launch-info']) {
  nodes[id].handlers.click();check(nodes.dialog.open&&nodes['dialog-body'].textContent,id);
  nodes['close-dialog'].handlers.click();check(!nodes.dialog.open,'close');
}
nodes.unknown.checked=true;nodes.unknown.handlers.change();check(nodes.time.disabled,'unknown time');
nodes['birth-form'].handlers.submit({preventDefault(){}});check(!nodes.error.textContent&&nodes.pillars.innerHTML.includes('시간 미상'),'unknown submit');
nodes.city.value='custom';nodes.city.handlers.change();check(!nodes['longitude-field'].hidden&&nodes.longitude.required,'custom');
nodes.longitude.value='140';nodes['birth-form'].handlers.submit({preventDefault(){}});check(nodes.error.textContent&&nodes.results.hidden,'invalid longitude');
console.log('PASS: analysis, 20 chapters and contents, unknown time, tabs, notices, custom longitude, validation');
