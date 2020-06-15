const fs = require('fs');
const glob = require('glob');
const swig = require('swig-templates');

const codelabFiles = glob.sync('*/codelab.json');
let codelabs = {};
for (let i = 0; i < codelabFiles.length; i++) {
    var codelab = JSON.parse(fs.readFileSync(codelabFiles[i]));
    console.log(codelab);
    for(const cat of codelab.category){
        let [categoryUrl, categoryName] = cat.split(":");
        console.log(categoryUrl +"  :  " + categoryName);
        codelabs[cat] = codelabs[cat] || {categoryName: categoryName, categoryUrl: categoryUrl, codelabs: []};
        codelab.mainTag = codelab.tags[0];
        codelabs[cat].codelabs.push(codelab);
    }
}

console.log(codelabs);

for(const cat in codelabs){
    const template = fs.readFileSync('template.html');
    const html = swig.render(template.toString(), { locals: codelabs[cat] });
    const dir = codelabs[cat].categoryUrl;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/index.html`, new Buffer.from(html));    
}
