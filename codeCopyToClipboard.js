Array.prototype.forEach.call(document.getElementsByTagName("pre"), function(v, i, ar){
    var div = document.createElement("div");
    div.innerText = "COPY";
    div.style.float = "right";
    div.style.backgroundColor = "gray";
    div.style.padding = "4px";
    div.addEventListener("click", function(){
        var el = document.createElement("textarea");
        el.value = v.innerText.substring(4);
        el.setAttribute("readonly", "");
        el.style = {position: "absolute", left: "-9999px" };
        v.appendChild(el);
        el.select();
        document.execCommand("copy");
        v.removeChild(el);
    });
    v.insertBefore(div, v.firstChild);
});