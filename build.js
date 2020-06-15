const fs = require('fs');
const glob = require('glob');
const swig = require('swig-templates');

const codelabFiles = glob.sync('*/codelab.json');
let codelabs = {};
for (let i = 0; i < codelabFiles.length; i++) {
    var codelab = JSON.parse(fs.readFileSync(codelabFiles[i]));
    for(const cat of codelab.category){
        let [categoryUrl, categoryName] = cat.split(":");
        codelabs[cat] = codelabs[cat] || {categoryName: categoryName, categoryUrl: categoryUrl, codelabs: []};
        codelab.mainTag = codelab.tags[0];
        codelabs[cat].codelabs.push(codelab);
    }
}

const template = fs.readFileSync('tpt/moduls.html');
const html = swig.render(template.toString(), { locals: {codelabs: codelabs }});
fs.writeFileSync(`index.html`, new Buffer.from(html)); 

for(const cat in codelabs){
    const template = fs.readFileSync('tpt/modul.html');
    const html = swig.render(template.toString(), { locals: codelabs[cat] });
    const dir = codelabs[cat].categoryUrl;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/index.html`, new Buffer.from(html));    
}
