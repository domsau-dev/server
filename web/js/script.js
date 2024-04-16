function showDOM() {
    printTags(document.body);
}

function printTags(el, indent = 0) {
    if (el) {
        if (el instanceof Element) {
            console.log(" ".repeat(indent) + el.tagName);
            for (const child of el.childNodes) {
                printTags(child, indent + 4);
            }
        } else {
            console.log(" ".repeat(indent) + "'" + el.nodeValue + "'");
        }
    }
}

function addButton() {
    const b = document.createElement("button");
    b.appendChild(document.createTextNode("Mygtukas"));
    const t = document.getElementById("t");
    document.body.insertBefore(b, t);
}

function addText() {
    const nn = document.createTextNode("Sitas tekstas pridetas dinaimskai");
    document.body.appendChild(nn);
}
