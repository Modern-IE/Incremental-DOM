(function(global) {
    var currentNode = null, currentParent = null, doc = global.document;
    function patch(node, fn, data) {
        var prevParent = currentParent;
        var prevNode = currentNode;
        currentParent = node;
        currentNode = node.firstChild;
        fn(data);
        var child = currentNode;
        while (child) {
            var next = child.nextSibling;
            currentParent.removeChild(child);
            child = next;
        }
        currentParent = prevParent;
        currentNode = prevNode;
    }
    function elementOpen(tag, key, statics) {
        var el = currentNode;
        if (!el || el.nodeName.toLowerCase() !== tag.toLowerCase()) {
            var newEl = doc.createElement(tag);
            if (el) currentParent.insertBefore(newEl, el);
            else currentParent.appendChild(newEl);
            el = newEl;
        } else {
            currentNode = el.nextSibling;
        }
        currentParent = el;
        currentNode = el.firstChild;
        var args = arguments;
        for (var i = 3; i < args.length; i += 2) {
            if (args[i] === 'class') el.className = args[i+1];
            else el.setAttribute(args[i], args[i+1]);
        }
        return el;
    }
    function elementClose(tag) {
        var child = currentNode;
        while (child) {
            var next = child.nextSibling;
            currentParent.removeChild(child);
            child = next;
        }
        currentNode = currentParent.nextSibling;
        currentParent = currentParent.parentNode;
        return currentNode ? currentNode.previousSibling : currentParent.lastChild;
    }
    function text(value) {
        var el = currentNode;
        if (!el || el.nodeType !== 3) {
            var newEl = doc.createTextNode(value);
            if (el) currentParent.insertBefore(newEl, el);
            else currentParent.appendChild(newEl);
            el = newEl;
        } else {
            if (el.nodeValue !== String(value)) el.nodeValue = value;
            currentNode = el.nextSibling;
        }
        return el;
    }
    function elementVoid(tag, key, statics) {
        elementOpen.apply(null, arguments);
        return elementClose(tag);
    }
    global.patch = patch;
    global.elementOpen = elementOpen;
    global.elementClose = elementClose;
    global.elementVoid = elementVoid;
    global.text = text;
})(window);
