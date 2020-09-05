document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('code,incode,shell').forEach((block) => {
    var i = 0;
    if(block.childNodes[i] != null && block.childNodes[i].nodeType == Node.TEXT_NODE){
      block.childNodes[i].textContent = block.childNodes[i].textContent.replace(/^\n/,'');
    }
    i = block.childNodes.length-1;
    if(block.childNodes[i] != null && block.childNodes[i].nodeType == Node.TEXT_NODE){
      block.childNodes[i].textContent = block.childNodes[i].textContent.replace(/\s*$/,'');
    }
  });

  document.querySelectorAll('code').forEach((block) => {
    var attrs = block.getAttributeNames();
    if(attrs[0] != null){
      console.log(attrs[0]);
      block.classList.add(attrs[0]);
    }
    hljs.highlightBlock(block);
  });
  
  document.querySelectorAll('incode').forEach((block) => {
    var attrs = block.getAttributeNames();
    if(attrs[0] != null){
      console.log(attrs[0]);
      block.classList.add(attrs[0]);
    }
    hljs.highlightBlock(block);
  });

});