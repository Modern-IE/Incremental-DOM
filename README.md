# Incremental DOM for IE6

A functional port of Google's `incremental-dom` rendering engine for IE6. 

By avoiding creating an in-memory Virtual DOM tree, this approach drastically reduces memory consumption and Garbage Collection pauses in JScript 5.8, making it the most performant way to build UI components on a Pentium III.

## API Compatibility
Strictly mimics `incremental-dom` core APIs: `patch`, `elementOpen`, `elementClose`, `elementVoid`, `text`.

## Usage

```html
<script src="incremental-dom-ie6.js"></script>
<script>
    function render(data) {
        elementOpen('div', null, null, 'id', 'container', 'class', 'wrapper');
            elementOpen('h1');
                text('Hello ' + data.name);
            elementClose('h1');
            elementVoid('input', null, null, 'type', 'text', 'value', data.name);
        elementClose('div');
    }

    var app = document.getElementById('app');
    
    // First render
    patch(app, render, { name: 'World' });
    
    // Diff update (Only the text node and value attribute change, no DOM destruction!)
    setTimeout(function() {
        patch(app, render, { name: 'IE6' });
    }, 2000);
</script>
```
