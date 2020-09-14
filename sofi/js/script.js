import {Prism} from '../prismjs/prism.js';

document.addEventListener('DOMContentLoaded', (event) => {

  //syntax highlight
  syntaxHighlight();
  navigation();
  //add meta 
  //document.head.insertAdjacentHTML('afterbegin', '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">');
  replaceParams();
  doQuizz();

});

function syntaxHighlight(){
  document.querySelectorAll('code,incode').forEach((block) => {
    if(block.nodeName === 'CODE'){
      var preWrap = document.createElement('pre');
      block.parentNode.insertBefore(preWrap, block);
      preWrap.appendChild(block);
    }

    var attrs = block.getAttributeNames();
    if(attrs[0] != null){
      block.removeAttribute(attrs[0]);
      block.classList.add('language-' + attrs[0]);
    }
    
    Prism.highlightElement(block);
  });

  document.querySelectorAll('shell').forEach((block) => {
    var preWrap = document.createElement('pre');
    block.parentNode.insertBefore(preWrap, block);
    preWrap.appendChild(block);
    
    block.classList.add('language-bash');
    
    Prism.highlightElement(block);
  });
}

function navigation(){
  // add sidenav and nav
  document.querySelectorAll('nav').forEach((nav) => {
    //var nav = document.createElement('nav');
    var hambopen = document.createElement('hamb-open');
    var sidenav = document.createElement('sidenav');
    var hambclose = document.createElement('hamb-close');
  
    nav.appendChild(hambopen);
    sidenav.appendChild(hambclose);
  
    document.body.appendChild(nav);
    document.body.appendChild(sidenav);
  
    // build sidenav menu
    document.querySelectorAll('h2').forEach((h) => {
      var id = 'id' + Math.random().toString(36).substr(2, 9);
  
      h.id = id;
  
      var link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = h.textContent;
      link.onclick = () => {
        sidenav.classList.remove('open');
      }
      sidenav.appendChild(link);
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
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          nav.classList.remove('hide');
        } else {
          nav.classList.add('hide');
        }
        prevScrollpos = currentScrollPos;
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

    if(q.hasAttribute('single')){
      doSingleQuestion(q);
    } else if(q.hasAttribute('multi')){
      doMultiQuestion(q);
    }
  });
}

function doSingleQuestion(q){
  q.querySelectorAll('answer').forEach(a => {
    var iid = 'id' + Math.random().toString(36).substr(2, 9);

    var label = document.createElement('label');
    label.textContent = a.textContent;
    a.textContent = '';
    label.setAttribute('for', iid);
    a.appendChild(label);

    var i = document.createElement('input');
    i.id = iid;
    i.type = 'radio';
    i.name = q.id;
    a.insertBefore(i, a.firstChild);
  });

  q.querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      q.querySelectorAll('answer').forEach((a) => {
        a.querySelectorAll('input').forEach((i) => {
          if(i.checked){
            if(a.hasAttribute('correct')){
              a.classList.add('right');
              a.classList.add('was-correct');
            } else {
              a.classList.add('wrong');
            }
          } else {
            if(a.hasAttribute('correct')){
              a.classList.add('was-correct');
            }
          }
        });
      });
    };
  });
}

function doMultiQuestion(q){
  q.querySelectorAll('answer').forEach(a => {
    var iid = 'id' + Math.random().toString(36).substr(2, 9);

    var label = document.createElement('label');
    label.textContent = a.textContent;
    a.textContent = '';
    label.setAttribute('for', iid);
    a.appendChild(label);

    var i = document.createElement('input');
    i.id = iid;
    i.type = 'checkbox';
    a.insertBefore(i, a.firstChild);
  });

  q.querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      q.querySelectorAll('answer').forEach((a) => {
        a.querySelectorAll('input').forEach((i) => {
          if(i.checked){
            if(a.hasAttribute('correct')){
              a.classList.add('right');
              a.classList.add('was-correct');
            } else {
              a.classList.add('wrong');
            }
          } else {
            if(a.hasAttribute('correct')){
              a.classList.add('wrong');
              a.classList.add('was-correct');
            }
          }
        });
      });
    };
  });
}