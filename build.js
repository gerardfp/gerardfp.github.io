const fs = require('fs');
const glob = require('glob');
const swig = require('swig-templates');

const itemsFile = glob.sync('index.json');


const template = fs.readFileSync('_templates/item.thtml');
const item = JSON.parse(fs.readFileSync(itemsFile[0]));

item.parents = [];

renderItem(item);

function renderItem(item){
    if(!item.items) return;

    item.tags = new Set();
    for (const subitem of item.items) {
        item.tags.add(subitem.tag);
    }

    item.tags = Array.from(item.tags);

    console.log(item.parents);

    const html = swig.render(template.toString(), { locals: item });
    if (!fs.existsSync(item.url)){
        fs.mkdirSync(item.url);
    }
    if(item.url === "/") {
        fs.writeFileSync(`./index.html`, new Buffer.from(html));
    } else {
        fs.writeFileSync(`${item.url}/index.html`, new Buffer.from(html));
    }

    for (const subitem of item.items) {
        subitem.parents = [...item.parents, item];
        renderItem(subitem);
    }
}


