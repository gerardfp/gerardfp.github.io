const fs = require('fs');
const glob = require('glob');
const swig = require('swig-templates');

const modulsFile = glob.sync('moduls.json');

const moduls = JSON.parse(fs.readFileSync(modulsFile[0]));


for (const modul in moduls) {
    for (const activ of moduls[modul].activs) {
        moduls[modul].tags = moduls[modul].tags || [];
        if(moduls[modul].tags.indexOf(activ.tag) === -1) moduls[modul].tags.push(activ.tag);
    }
}

for(const modul in moduls){
    const template = fs.readFileSync('_templates/modul.html');
    const html = swig.render(template.toString(), { locals: moduls[modul] });

    if (!fs.existsSync(modul)){
        fs.mkdirSync(modul);
    }
    fs.writeFileSync(`${modul}/index.html`, new Buffer.from(html));    
}
