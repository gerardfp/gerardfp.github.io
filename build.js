const fs = require('fs');
const swig = require('swig-templates');
const YAML = require('yaml');


let item = YAML.parse(fs.readFileSync('./index.yaml', 'utf8'));

try {
    // fs.readdirSync("_pages")
    ["android","apps"].forEach(dir => {
        // console.log(dir)
        const html = fs.readFileSync(`_pages/${dir}/index.html`, 'utf8');
        try {
            const meta = YAML.parse(html.match(/<!--meta(.*)-->/)[1]);
            try {
                meta.title = html.match(/<h1>(.*)<\/h1>/)[1];
            } catch {
                try {
                    meta.title = html.match(/<title>(.*)<\/title>/)[1];
                } catch {
                    console.log("no title");
                    return;
                }
            }
            meta.urls.forEach(url => {
                let leaf = item.items;
                url.split("/").forEach(part => {
                    leaf[part].items = leaf[part].items || {};
                    leaf = leaf[part].items;
                });
                leaf[dir] = meta;

            });
        } catch(error) {
            console.log(error);
        }
    });
} catch (err) {
    console.log(err);
}

// const item = {
//     title: "ROOT",
//     items: {
//         m3: {
//             title: "DAMM3",
//             items: {
//                 uf1: { title: "UF1" },
//                 uf2: {
//                     title: "UF2",
//                     items: {
//                         apps: { title: "Apps", },
//                         android: { title: "Android"}
//                     }
//                 }
//             }
//         },
//         m6: {
//             title: "DAMM6",
//             items: {
//                 uf1: { 
//                     title: "UF1", 
//                     items: {
//                         apps: { title: "Apps", },
//                         java: { title: "Java"}
//                     }
//                 }
//             }
//         }
//     }
// }


log(item);
item =  trans("/", item);
log(item);

function trans(url, item) {
    const transsubitem = {}
    transsubitem.url = url;
    transsubitem.title = item.title;
    transsubitem.tags = item.tags;

    if (item.items) {
        transsubitem.items = [];

        for (const [url, subitem] of Object.entries(item.items)) {
            transsubitem.items.push(trans(url, subitem));
        }
    }

    return transsubitem;
}



const template = fs.readFileSync('_templates/item.html');

item.parent = false;
item.parents = [];

renderItem(item);

function renderItem(item){
    if(!item.items) return;

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

    const realUrl = item.url;
    if (item.parent) {
        let ritem = item;  // recursive item
        while (ritem?.parent?.url && ritem.parent.url != "/") {
            item.url = ritem.parent.url + '/' + item.url;
            ritem = ritem.parent;            
        }
    }

    const html = swig.render(template.toString(), { locals: item });

    if(item.url === "/") {
        fs.writeFileSync(`./index.html`, new Buffer.from(html));
    } else {
        if (!fs.existsSync(item.url)){
            fs.mkdirSync(item.url, { recursive: true });
        }    
        fs.writeFileSync(`${item.url}/index.html`, new Buffer.from(html));
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