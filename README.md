# mithril-json-tree

Mithril object viewer component.

```javascript
var m = require('mithril');
var mjt = require('mithril-json-tree');

var data = {
  foo: 'bar',
};

m.mount(document.getElementById('app'), {
  view: function (ctrl) {
    return (
      m('div[style="white-space:nowrap"]', [
        m(mjt.MjtValue, { value: data }),
        m(mjt.MjtStyle),
      ])
    );
  },
});
```

See [index.html](index.html) and [index.js](index.js) for another example.
