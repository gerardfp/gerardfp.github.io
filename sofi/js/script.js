import {Prism} from '../prismjs/prism.js';

document.addEventListener('DOMContentLoaded', (event) => {

  
  // document.querySelectorAll('code,incode,shell').forEach((block) => {
  //   var i = 0;
  //   if(block.childNodes[i] != null && block.childNodes[i].nodeType == Node.TEXT_NODE){
  //     block.childNodes[i].textContent = block.childNodes[i].textContent.replace(/^\n/,'');
  //   }
  //   i = block.childNodes.length-1;
  //   if(block.childNodes[i] != null && block.childNodes[i].nodeType == Node.TEXT_NODE){
  //     block.childNodes[i].textContent = block.childNodes[i].textContent.replace(/\s*$/,'');
  //   }
  // });

  document.querySelectorAll('code,incode').forEach((block) => {
    if(block.nodeName === 'CODE'){
      var preWrap = document.createElement('pre');
      block.parentNode.insertBefore(preWrap, block);
      preWrap.appendChild(block);
    }

    var attrs = block.getAttributeNames();
    if(attrs[0] != null){
      block.classList.add('language-' + attrs[0]);
    }
    
    Prism.highlightElement(block);
  });

  document.querySelectorAll('shell').forEach((block) => {
    if(block.nodeName === 'SHELL'){
      var preWrap = document.createElement('pre');
      block.parentNode.insertBefore(preWrap, block);
      preWrap.appendChild(block);
    }
    block.classList.add('language-bash');

    // var attrs = block.getAttributeNames();
    // if(attrs[0] != null){
    //   block.classList.add('language-' + attrs[0]);
    // }
    
    Prism.highlightElement(block);
  });

  //add meta 
  //document.head.insertAdjacentHTML('afterbegin', '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">');


  // add sidenav and nav
  var nav = document.createElement('nav');
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

  // sidenav open/clsoe
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

