import {Prism} from '../prismjs/prism.js';

document.addEventListener('DOMContentLoaded', (event) => {
  //syntax highlight
  autoAttributes();
  syntaxHighlight();
  navigation();
  pageTitle();
  wrappers();
  replaceParams();
  doQuizz();
  doStepper();
});

function pageTitle(){
  if(document.querySelector('header h1') != null){
    var title = document.createElement("title");
    title.textContent = document.querySelector('header h1').textContent;
    document.head.appendChild(title);
  }
}

function wrappers(){

  // wrap
  var hlElements = ['table', 'img'];
  hlElements.forEach(hlname => {
    document.querySelectorAll(hlname).forEach(t => {
      var tableWrap = document.createElement('div');
      tableWrap.classList.add(hlname);

      t.parentElement.replaceChild(tableWrap, t);
      tableWrap.appendChild(t);
    })  
  });


  //adbefore
  var hlElements = ['work', 'warn', 'info', 'optional', 'tldr', 'observe', 'quizz', 'challenge', 'project'];
  hlElements.forEach(hlname => {
    document.querySelectorAll(hlname).forEach(hl => {
      var hlWrap = document.createElement('div');
      hlWrap.classList.add(hlname);
  
      hl.parentElement.insertBefore(hlWrap, hl);
    });
  });
}

function autoAttributes(){
  var elementNames = ['circle, add, rem, hig, low, lin, blk'];
  elementNames.forEach(name => { 
    document.querySelectorAll(name).forEach(el => {
      var attrs = el.getAttributeNames();
      if(!isNaN(attrs[0]) && attrs[0] != null){
        el.setAttribute("data-value", attrs[0]);
        el.removeAttribute(attrs[0]);
      }
    })
  });
}

function getLinePairsOfElement(str, elm) {
  function lineOf(text, substring, position){
    var line = 0, matchedChars = 0;
  
    var count = 0;
    for (var i = 0; i < text.length; i++) {
      text[i] === substring[matchedChars] ? matchedChars++ : matchedChars = 0;
  
      if (matchedChars === substring.length){
        if (count == position){
          return line;         
        }
        count++;         
      }
      if (text[i] === '\n'){
          line++;
      }
    }
  
    return  -1;
  }

  let condeWithOnlyLin = str.replace(/(<\/?(?:lin)[^>]*>)|<[^>]+>.*\n/igm,'$1');
  condeWithOnlyLin = condeWithOnlyLin.replace(/^.*<lin>.*\n/igm,'<lin>');
  condeWithOnlyLin = condeWithOnlyLin.replace(/\n.*<\/lin>.*/igm,'</lin>');

  let pairs = [];
  let i = 0;
  while (true) {
    let lineBegin = lineOf(condeWithOnlyLin, "<"+elm+">", i);
    if (lineBegin == -1) break;
    let lineEnd = lineOf(condeWithOnlyLin, "</"+elm+">", i);
    if (lineEnd == -1) break;
    i++;
    pairs.push({lineBegin, lineEnd});
  }

  //console.log(pairs);
  return pairs;

}

function syntaxHighlight(){
  //console.log("HIGHLIGHTING");
  document.querySelectorAll('sc').forEach(b => {


    var preWrap = document.createElement('pre');
    var codeWrap = document.createElement('code');

    preWrap.appendChild(codeWrap);
    codeWrap.innerHTML = b.innerHTML;
    b.innerHTML = '';
    b.appendChild(preWrap);


    // b.getAttributeNames().forEach(an => {
    //   preWrap.setAttribute(an, b.getAttribute(an));
    //   codeWrap.setAttribute(an, b.getAttribute(an));
    // });

    var attrs = b.getAttributeNames();
    
    if(b.hasAttribute('diff')){
      codeWrap.classList.add('diff-highlight'); 
      // codeWrap.classList.add('language-diff');

      if(attrs[0] != null){
        codeWrap.classList.add('language-diff-' + attrs[0]);
      } else {
        codeWrap.classList.add('language-diff');
      } 
      b.removeAttribute('diff');
    }

    if(b.hasAttribute('data-line')){
      preWrap.setAttribute('data-line', b.getAttribute('data-line'));
      b.removeAttribute('data-line');
    }

    if(attrs[0] != null){
      codeWrap.classList.add('language-' + attrs[0]);
      b.removeAttribute(attrs[0]);
    }


    let datalines = getLinePairsOfElement(codeWrap.innerHTML, "lin").map(datalines => datalines.lineBegin + "-" + datalines.lineEnd).join(",");
    if (datalines != "") preWrap.setAttribute('data-line', datalines);



    Prism.highlightElement(codeWrap);

    let i=1;
    codeWrap.querySelectorAll('add, rem, hig, lin, low, blk, blkin').forEach(k => {
      k.innerHTML = k.innerHTML.replace(/^(?:\r?\n|\r)/, '');
      if (k.hasAttribute("o")){
        //console.log("hasAttribte oo");
        k.setAttribute("data-value", i++);
      }
    });

    codeWrap.querySelectorAll('add, rem, hig, lin, low, blk').forEach(k => {
      if (k.hasAttribute("data-value") && !preWrap.hasAttribute("data-line")){
        preWrap.setAttribute("data-line","");
      }
    });

  });

  document.querySelectorAll('shell, mem').forEach(b => {
    var preWrap = document.createElement('pre');
    var codeWrap = document.createElement('code');

    preWrap.appendChild(codeWrap);
    codeWrap.innerHTML = b.innerHTML;
    b.innerHTML = '';
    b.appendChild(preWrap);

    preWrap.classList.add('language-none');    

    Prism.highlightElement(codeWrap);
  });
}

var sidenavItemCLicked;

function navigation(){
  // add sidenav and nav

  document.querySelectorAll('nav').forEach((nav) => {


    var hambopen = document.createElement('hamb-open');
    var sidenav = document.createElement('sidenav');
    var hambclose = document.createElement('hamb-close');
  
    nav.appendChild(hambopen);
    sidenav.appendChild(hambclose);
  
    document.body.appendChild(nav);
    document.body.appendChild(sidenav);

    document.body.addEventListener('click', (e) => { 
      if(e.target != hambopen){
        sidenav.classList.remove('open');
        nav.classList.add('hide');
      } 
    });
  
    // build sidenav menu
    document.querySelectorAll('section').forEach((s, i) => {
      s.querySelectorAll('h2').forEach((h,j) => {
        //var id = 'id' + Math.random().toString(36).substr(2, 9);
        var id = 'h2' + i + j;
        h.id = id;
    
        var link = document.createElement('a');
        link.href = '#' + id;
        link.classList.add('sidenav1');
        link.textContent = h.textContent;
        link.onclick = () => {
          sidenav.classList.remove('open');
          nav.classList.add('hide');
          sidenavItemCLicked = true;
        }
        sidenav.appendChild(link);
      });  
      s.querySelectorAll('h3').forEach((h, k) => {
        var id = 'h3' + i+k;
        h.id = id;
    
        var link = document.createElement('a');
        link.href = '#' + id;
        link.classList.add('sidenav2');
        link.textContent = h.textContent;
        link.onclick = () => {
          sidenav.classList.remove('open');
          nav.classList.add('hide');
          sidenavItemCLicked = true;
        }
        sidenav.appendChild(link);
      });
    });
  
    // sidenav open/close
    hambopen.onclick = () => {
        sidenav.classList.add('open');
    };
  
    hambclose.onclick = () => {
      sidenav.classList.remove('open');
    };
  
    // nav show/hide
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
        if(!sidenavItemCLicked){
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          nav.classList.remove('hide');
        } else {
          nav.classList.add('hide');
        }
        prevScrollpos = currentScrollPos;
      }
      sidenavItemCLicked = false;
    }
  });
}

function replaceParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const entries = urlParams.entries();
  for(const entry of entries) {
    if(entry[0].startsWith('replace-')){
      const name = entry[0].slice(8);
      document.querySelectorAll(name).forEach((e) => {
        e.textContent = entry[1];
      });
    }
  }
}







function doQuizz(){
  document.querySelectorAll('question').forEach(q => {
    var qid = 'id' + Math.random().toString(36).substr(2, 9);
    q.id = qid;
    
    var button = document.createElement('button');
    button.classList.add('check');
    q.appendChild(button);

    if(q.hasAttribute('single')){
      doSingleQuestion(q);
    } else if(q.hasAttribute('multi')){
      doMultiQuestion(q);
    } else if(q.hasAttribute('match')){
      doMatchQuestion(q);
    } else if(q.hasAttribute('text')){
      doTextQuestion(q);
    }
  });
}

function doSingleQuestion(q){
  q.querySelectorAll('o').forEach(o => {
    var iid = 'id' + Math.random().toString(36).substr(2, 9);

    var label = document.createElement('label');
    label.innerHTML = "<div>" + o.innerHTML + "</div>";
    o.innerHTML = '';
    label.setAttribute('for', iid);
    o.appendChild(label);

    var i = document.createElement('input');
    i.id = iid;
    i.type = 'radio';
    i.name = q.id;
    o.insertBefore(i, o.firstChild);
    o.onclick = (e) => {
      i.checked = true;
    }
  });
  
  q.querySelector('button.check').onclick = () => {
    q.querySelectorAll('o').forEach(o => {
      o.classList.remove('right');
      o.classList.remove('wrong');
      o.classList.remove('was-correct');

      o.querySelectorAll('input').forEach(i => {
        if(i.checked){
          if(o.hasAttribute('correct')){
            o.classList.add('right');
            o.classList.add('was-correct');
          } else {
            o.classList.add('wrong');
          }
        } else {
          if(o.hasAttribute('correct')){
            o.classList.add('was-correct');
          }
        }
      });
    });
  };
}

function doMultiQuestion(q){
  q.querySelectorAll('o').forEach(o => {
    var iid = 'id' + Math.random().toString(36).substr(2, 9);

    var label = document.createElement('label');
    label.innerHTML = "<div>" + o.innerHTML + "</div>";
    o.innerHTML = '';
    label.setAttribute('for', iid);
    o.appendChild(label);

    var i = document.createElement('input');
    i.id = iid;
    i.type = 'checkbox';
    o.insertBefore(i, o.firstChild);
    o.onclick = () => {
      i.checked = !i.checked;
    }
  });

  q.querySelector('button.check').onclick = () => {
    q.querySelectorAll('o').forEach(o => {
      o.classList.remove('right');
      o.classList.remove('wrong');
      o.classList.remove('was-correct');

      o.querySelectorAll('input').forEach((i) => {
        if(i.checked){
          if(o.hasAttribute('correct')){
            o.classList.add('right');
            o.classList.add('was-correct');
          } else {
            o.classList.add('wrong');
          }
        } else {
          if(o.hasAttribute('correct')){
            o.classList.add('wrong');
            o.classList.add('was-correct');
          }
        }
      });
    });
  };
}

function doMatchQuestion(q){
  var leftdiv = document.createElement('div');
  leftdiv.classList.add('left');
  var rightdiv = document.createElement('div');
  rightdiv.classList.add('right');
 
  q.insertBefore(rightdiv, q.querySelector('button.check'));
  q.insertBefore(leftdiv, rightdiv);

  // sortable
  q.querySelectorAll('o').forEach((o, i) => {
    var div = leftdiv;
    if(i%2==1){
      o.id = 'o' + (i);
      o.setAttribute('order', Math.floor(i/2));
      div = rightdiv;
    }
    div.appendChild(o);
  });

  // shuffle
  suffleChildren(rightdiv);
  swapable(rightdiv);

  // check
  q.querySelector('button.check').onclick = () => {
      rightdiv.querySelectorAll('o').forEach((o, i) => {
      o.classList.remove('right');
      o.classList.remove('wrong');

      if(o.getAttribute('order') != i){
        o.classList.add('wrong');
      } else {
        o.classList.add('right');
      }
    });
  }
}


function doTextQuestion(q){
  q.querySelectorAll('o').forEach(o => {
    // var iid = 'id' + Math.random().toString(36).substr(2, 9);

    // var label = document.createElement('label');
    // label.innerHTML = o.innerHTML;
    // o.innerHTML = '';
    // label.setAttribute('for', iid);
    // o.appendChild(label);

    var i = document.createElement('input');
    // i.id = iid;
    i.type = 'text';
    // i.name = q.id;
    i.setAttribute('correct', o.textContent);
    o.parentNode.replaceChild(i, o);
  });
  
  q.querySelector('button.check').onclick = () => {
    q.querySelectorAll('input[type=text]').forEach(i => {
      i.classList.remove('right');
      i.classList.remove('wrong');

      if(i.value === i.getAttribute('correct')){
        i.classList.add('right');
      } else {
        i.classList.add('wrong');
      }
    });
  };
}

var overElement;
var srcElement, dstElement;
function swapable(d){
  d.querySelectorAll("o").forEach(e => {
    e.setAttribute("draggable", true);

    e.ondragend = (event) => {
      overElement.classList.remove("highlight");
      overElement.classList.remove("right");
      overElement.classList.remove("wrong");
      event.target.classList.remove("right");
      event.target.classList.remove("wrong");
      swapElements(event.target, overElement);
    };
    e.ondragover = (event) => {
      overElement = event.target;
      overElement.classList.add("highlight");
    };
    e.ondragleave = (event) => {
        overElement.classList.remove("highlight");
    };

    e.onclick = () => {
      if(srcElement == null){
        srcElement = e;
      } else {
        swapElements(srcElement, e);
        srcElement = null;
      }
    }
  });
}


function swapElements(a, b){
  var n = a.nextSibling;
  if(b == n){
    insertBefore(b, a);
  } else {
    insertBefore(a, b);
    insertBefore(b,n);
  }
}

function insertBefore(a, b){
  if(b != null){
    b.parentNode.insertBefore(a, b);
  } else {
    a.parentNode.appendChild(a);
  }
}

function suffleChildren(d){
  var n = d.childElementCount;
  for(var i=0; i<n-1; i++){
    var j = randInt(i+1, n);
    var a = d.children[i];
    var b = d.children[j];

    swapElements(a, b);
  }
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function doStepper(){
  document.querySelectorAll('stepper').forEach(s => {

    var prevnext = document.createElement('div');
    prevnext.classList.add('prevnext');

    var prev = document.createElement('button');
    prev.classList.add('prev');
    // prev.textContent = "prev";

    var next = document.createElement('button');
    next.classList.add('next');
    // next.textContent = "next";

    prevnext.appendChild(prev);
    prevnext.appendChild(next);

    var reset = document.createElement('button');
    reset.classList.add('reset');
    // reset.textContent = "reset";

    var slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', 0);
    
    var wrap = document.createElement('div');
    wrap.classList.add('controls');
    wrap.appendChild(prevnext);
    wrap.appendChild(reset);
    wrap.appendChild(slider);

    s.appendChild(wrap);

    s.querySelectorAll('step').forEach((t,i) => {
      t.style = s.style;
      t.setAttribute('index', i);
      s.setAttribute('len', i);
      slider.setAttribute('max', i);
    });

    s.querySelector('step:first-child').classList.add('current');

    slider.onchange = (e) => {
      s.querySelector('step.current').classList.remove('current');

      s.querySelector('[index="' + (slider.value)+ '"]').classList.add('current');
      
    };

    next.onclick = () => {
      var c = s.querySelector('step.current');
      
      var cid = parseInt(c.getAttribute('index'));

      if(cid < parseInt(s.getAttribute('len'))){
        c.classList.remove('current');
        s.querySelector('[index="' + (cid+1)+ '"]').classList.add('current');
        slider.value = cid+1;
      }
    }

    prev.onclick = () => {
      var c = s.querySelector('step.current');
      
      var cid = parseInt(c.getAttribute('index'));

      if(cid > 0){
        c.classList.remove('current');
        s.querySelector('[index="' + (cid-1)+ '"]').classList.add('current');
        slider.value = cid-1;
      }
    }

    reset.onclick = () => {
      s.querySelector('step.current').classList.remove('current');

      s.querySelector('[index="0"]').classList.add('current');
      slider.value = 0;
    }
  });
}

export {syntaxHighlight};