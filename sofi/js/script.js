document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('code,shell').forEach((block) => {
      block.textContent = block.textContent.replace(/^\n/,'');
      block.textContent = block.textContent.replace(/\s*$/,'');
    });
  });