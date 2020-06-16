const fs = require('fs');
const glob = require('glob');
const swig = require('swig-templates');

const codelabFiles = glob.sync('*/codelab.json');
let codelabs = {};
for (let i = 0; i < codelabFiles.length; i++) {
    var codelab = JSON.parse(fs.readFileSync(codelabFiles[i]));
    for(const category of codelab.category){
        let [categoryUrl, categoryName] = category.split(":");
        codelabs[categoryUrl] = codelabs[categoryUrl] || {categoryName: categoryName, categoryUrl: categoryUrl, codelabs: [], tags: []};
        codelab.mainTag = codelab.tags[0];
        codelabs[categoryUrl].codelabs.push(codelab);
        codelabs[categoryUrl].tags.push(codelab.tags[0]);
    }
}

for(const category in codelabs){
    codelabs[category].codelabs.sort((a, b) => (a.status > b.status) ? 1 : -1)
}

// const template = fs.readFileSync('tpt/moduls.html');
// const html = swig.render(template.toString(), { locals: {codelabs: codelabs }});
// fs.writeFileSync(`index.html`, new Buffer.from(html)); 

for(const category in codelabs){
    const template = fs.readFileSync('tpt/modul.html');
    const html = swig.render(template.toString(), { locals: codelabs[category] });
    const dir = codelabs[category].categoryUrl;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/index.html`, new Buffer.from(html));    
}
