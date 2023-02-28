const fs = require('fs');
const path = require('path');
const swig = require('swig-templates');
const YAML = require('yaml');

deleteLinks();

let item = YAML.parse(fs.readFileSync('./index.yaml', 'utf8'));

item =  trans("", item);

const template = fs.readFileSync('_templates/item.htm');

item.parent = false;
item.parents = [];

renderItem(item);


function deleteLinks(){
    try {
        const files =  fs.readdirSync(".", {encoding: 'utf8', withFileTypes: true});
        for (const file of files)
            if (file.isSymbolicLink()){
                fs.unlinkSync(file.name);
            }
      } catch (err) {
        console.error(err);
      }
}

function getTitle(path){
    try {       
        const html = fs.readFileSync(`_materials/${path}/index.html`, 'utf8');

        try {
            return html.match(/<title>(.*)<\/title>/)[1];
        } catch {
            try {
                return html.match(/<h1>(.*)<\/h1>/)[1];                
            } catch {
                return path;
            }
        }
    } catch (err) {
        return path;
    }
}


function trans(lps, item) {   // lps: lastPathSegment
    const transsubitem = {};
    transsubitem.lps = lps;
    transsubitem.short = item.short;
    transsubitem.title = item.title || getTitle(lps);
    transsubitem.tags = item.tags;

    if (item.items) {
        transsubitem.items = [];

        for (const [lps, subitem] of Object.entries(item.items)) {
            transsubitem.items.push(trans(lps, subitem));
        }
    }

    return transsubitem;
}


function renderItem(item){
    // if(!item.items) return;

    item.url = item.lps;
    if (item.parent) {
        let ritem = item;  // recursive item
        while (ritem?.parent?.lps && ritem.parent.lps != "") {
            item.url = ritem.parent.lps + '/' + item.url;
            ritem = ritem.parent;            
        }
    }

    if (item.items) {
        for (const subitem of item.items) {
            subitem.parents = [...item.parents, item];
            subitem.parent = item;
            renderItem(subitem);
        }
    

        item.tags = new Set();
        let i = item.items.length;
        while(i--) {
            subitem = item.items[i];
            item.tags.add(subitem.tag);
        }
    
        item.tags = Array.from(item.tags);
    }
    

    

    
    if (item.hasOwnProperty('items')){
        // es un element de l'index
        const html = swig.render(template.toString(), { locals: item });

        if(item.url === "") {
            fs.writeFileSync(`./index.html`, new Buffer.from(html));
        } else {
            if (!fs.existsSync(item.url)){
                fs.mkdirSync(item.url, { recursive: true });
            }    
            fs.writeFileSync(`${item.url}/index.html`, new Buffer.from(html));
        }    
    } else if(fs.existsSync(`./_materials/${item.lps}`)) {
        // es un material
        const target = `./_materials/${item.lps}`;
        try {
            fs.symlinkSync(target, item.lps);
        } catch (err) {
        }

        if (!fs.existsSync(path.dirname(item.url))){
            fs.mkdirSync(path.dirname(item.url), { recursive: true });
        }    
        const relativePath = path.relative(path.dirname(item.url), target);
        try {
            fs.symlinkSync(relativePath, "./" + item.url);
        } catch(err){
        }
    }
}




function log(object) {
    console.log("===========")
    console.dir(object, { depth: null })
}