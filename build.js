const fs = require('fs');
const path = require('path');
const swig = require('swig-templates');
const YAML = require('yaml');


let item = YAML.parse(fs.readFileSync('./index.yaml', 'utf8'));

function getTitle(path){
    try {       
        const html = fs.readFileSync(`_materials/${path}/index.html`, 'utf8');

        try {
            return html.match(/<title>(.*)<\/title>/)[1];
        } catch {
            try {
                return html.match(/<h1>(.*)<\/h1>/)[1];                
            } catch {
                return null;
            }
        }
    } catch (err) {
        return null;
    }
}



// log(item);
item =  trans("", item);
// log(item);

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



const template = fs.readFileSync('_templates/item.htm');

item.parent = false;
item.parents = [];

// log(item);
renderItem(item);
log(item);

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

/*
dam: "Desenolupament"
  m8: "android"
    uf1: "UF1"
    uf2: "UF2"  
  m6:
    uf1: "UF1"
asix: "Asix"
  m8: "webs"
    uf1: "UF1"


    [
        [
            { dam: "Desenolupament"},
            [
                [
                    { m8: "android" },
                    [
                        [
                            { uf1: "UF1" },
                        ],
                        [
                            { uf2: "UF2" },
                        ]

                    ]
                ],
                [
                    { m9: "webs" },
                ]
            ]
        ],
        [
            { asix: "Asix"},
        ]
    ]

*/