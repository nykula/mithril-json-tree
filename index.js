$(document).ready(function () {
  'use strict';

  window.mithrilJsonTreeState = {
    foo: [
      'bar',
      {
        baz: true,
        qux: 'quux',
        corge: null,
        grault: {
          garply: [
            'waldo',
            'fred',
            function fun(b, c) {},
          ],
          plugh: 'xyzzy',
        },
      },
      'thud',
      987,
    ],

    wibble: function () {
      return [
        'wobble',
        { wubble: 'flob' },
        undefined,
        function (a) {},
      ];
    },
  };

  var Mjt = {
    view: function () {
      return m('div', { style: 'white-space: nowrap;' }, [
        m(window.mithrilJsonTree.MjtValue, { value: window.mithrilJsonTreeState }),
        m(window.mithrilJsonTree.MjtStyle),
      ]);
    },
  };

  m.mount(document.getElementById('app'), Mjt);
});
