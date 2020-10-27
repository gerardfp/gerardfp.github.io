const letters = {
    a: [
        "M 25,100 75,0" ,
        "M 125,100 75,0",
        "M 100,50 50,50"
    ],
    b: [
        "M 50,100 50,0",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0" , 
        "M 50,50 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0" 
    ],
    c: [
        "M 125,75 C 95,120 25,100 25,50 25,0 95,-20 125,25"
    ],
    d: [
        "M 50,100 50,0",
        "M 50,0 h 30 c 0,0 50,0 50,50 0,50 -50,50 -50,50 l -30,0" 
    ],
    e: [
        "M 50,0 50,100",
        "M 50,0 h 50" , 
        "M 50,50 h 30" , 
        "M 50,100 h 50"
    ],
    f: [
        "M 50,0 50,100",
        "M 50,0 h 50" , 
        "M 50,50 h 30" 
    ],
    g: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    h: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    i: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    j: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    k: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    l: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    m: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    n: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    o: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    p: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    q: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    r: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    s: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    t: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    u: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    v: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    w: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    x: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    y: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
    z: [
        "M 50,0 50,100",
        "M 50,0 h 30 c 0,0 25,0 25,25 0,25 -25,25 -25,25 l -30,0"
    ],
}

function drawPoint(ctx, point, color){
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function dist(a, b){
    return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2));
}

customElements.define('m-letter', class extends HTMLElement {
    constructor() { super (); 
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttributeNS(null, 'viewBox', '-5 -5 160 110');
        for(const d of letters[this.getAttribute('letter')]){
            const path = document.createElementNS('http://www.w3.org/2000/svg','path');
            path.setAttributeNS(null,'d', d);
            svg.appendChild(path);
        }
        this.appendChild(svg);
    }
});

customElements.define('draw-letters', class extends HTMLElement {
    constructor() { super();
        this.style.display = 'block';
        var c1 = document.createElement("canvas");
        var c2 = document.createElement("canvas");
        var c3 = document.createElement("canvas");

        c1.setAttribute('id', "c1");
        c2.setAttribute('id', "c2");
        c3.setAttribute('id', "c3");

        this.appendChild(c1);
        this.appendChild(c2);
        this.appendChild(c3);

        var ctx1 = c1.getContext("2d");
        var ctx2 = c2.getContext("2d");
        var ctx3 = c3.getContext("2d");

        var lettersA = this.getAttribute('letters');

        var letter = lettersA[0];

        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttributeNS(null, 'viewBox', '-5 -5 160 110');
        // for(const d of letters[letter]){
            const mipath = document.createElementNS('http://www.w3.org/2000/svg','path');
            mipath.setAttributeNS(null,'d', letters[letter][0]);
            svg.appendChild(mipath);


            var mipathlength = mipath.getTotalLength();

            var start = {x:mipath.getPointAtLength(mipathlength).x, y:mipath.getPointAtLength(mipathlength).y};

            var points = [];

            for (var i = 0; i<mipathlength; i+=5){
                points.push({x:mipath.getPointAtLength(i).x, y:mipath.getPointAtLength(i).y})
            }

            for(var p of points) {
                drawPoint(ctx1, p, '#aeaeae');
            }

            var next = 0;
            drawPoint(ctx2, start, '#ff0000');


            var pos = { x: 0, y: 0 };

            function setPosition(e) {
                pos.x = e.clientX;
                pos.y = e.clientY;
            }

            var grab = false;

            console.log("clickkklistener");
            this.addEventListener('click', (e) => {
                alert('mek');
                console.log("clickkk");
            });

            c3.onmousedown = (e) => {
                console.log("mousedown");
                setPosition(e);
                console.log(pos);


                if(dist(pos, start) < 20) {
                    grab = true;
                } else {
                    grab = false;
                }
            }

            c3.onmousemove = (e) => {
                if(e.buttons !== 1) return;

                setPosition(e);

                if(grab) {
                    if(dist(pos, points[next]) < 20) {
                        points[next].draw(ctx2);
                        start = points[next];
                    } else {
                        grab = false;
                    }

                    if(dist(pos, points[next+1]) < 15) {
                        next++;
                        ctx3.clearRect(0,0,c3.width,c3.height);
                        drawPoint(ctx3, points[next], '#ffff00');
                    }
                }
            }
        // }
    }
    connectedCallback(){
        console.log("jajaja");
        this.addEventListener('click', e => {
            console.log("mekkk");
        });
    }
});

// customElements.define('layered-canvas', class extends HTMLElement{
//     constructor() { super();
//         var canvas = [];
//         this.layers = this.getAttribute('layers');
//         for(i = 0; i < this.layers; i++){
//             var c = document.createElement('canvas');
//             var ctx = c.getContext("2d");

//             canvas.push({ c: c, ctx: ctx});
//         }
//     }
// });