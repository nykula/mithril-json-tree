(function () {
  'use strict';

  var m = (typeof window === 'undefined') ? require('mithril') : window.m;

  var INITIALLY_OPENED_TYPES = {
    'BOOLEAN': true,
    'FUNCTION': true,
    'NULL': true,
    'NUMBER': true,
    'STRING': true,
    'UNDEFINED': true,
  };

  var MjtNode = {
    controller: function (props) {
      var _this = this;

      _this.isOpen = m.prop(INITIALLY_OPENED_TYPES[props.type] === true);
      _this.toggle = toggle;

      function toggle() {
        _this.isOpen(!_this.isOpen());
      };
    },

    view: function (ctrl, props) {
      var _this = this;
      var isOpen = ctrl.isOpen();
      var nameView = /-/.test(props.name) ? ("'" + props.name + "'") : props.name;

      return m('.mjt-node', [
        m('label.mjt-label', [
          m('input[type="checkbox"].mjt-open', { checked: isOpen, onclick: ctrl.toggle }),
          m('span.mjt-name', nameView + ':'),
        ]),

        isOpen ? m(MjtValue, { value: props.value }) : m(MjtType, { type: props.type, value: props.value }),
      ]);
    }
  };

  var MjtFunction = {
    controller: function (props) {
      var _this = this;

      _this.isResolved = m.prop(false);
      _this.value = m.prop(null);
      _this.resolve = resolve;

      function resolve(ev) {
        ev.preventDefault();
        _this.isResolved(true);
        _this.value(props.fun());
      }
    },

    view: function (ctrl) {
      if (!ctrl.isResolved()) {
        return m('a[href="#"].mjt-resolver', { onclick: ctrl.resolve }, '...');
      }

      return m(MjtValue, { value: ctrl.value() });
    },
  };

  var MjtType = {
    viewInner: function (props) {
      if (props.type === 'FUNCTION') {
        return 'Function/' + props.value.length;
      }

      if (props.type === 'ARRAY') {
        return 'Array[' + props.value.length + ']';
      }

      if (props.type === 'OBJECT') {
        var keys = Object.keys(props.value);

        if (keys.length > 5) {
          return 'Object{' + Object.keys(props.value).slice(0, 5).join(',') + ',...}';
        }

        return 'Object{' + Object.keys(props.value).join(',') + '}';
      }

      return props.type.toLowerCase();
    },

    view: function (_, props) {
      var _this = this;
      return m('.mjt-type', [
        _this.viewInner(props),
      ]);
    },
  };

  var MjtValue = {
    viewInner: function (type, value) {
      switch (type) {
        case 'STRING':
          return '"' + value + '"';

        case 'UNDEFINED':
        case 'NULL':
          return type.toLowerCase();

        case 'ARRAY':
        case 'OBJECT':
          return (
            Object.keys(value).map(function (name) {
              var _value = value[name];
              var _type = getType(_value);
              return m(MjtNode, { name: name, type: _type, value: _value });
            })
          );

        case 'FUNCTION':
          if (value.length !== 0) return 'Function/' + value.length;
          return m(MjtFunction, { fun: value });

        default:
          return value.toString();
      }
    },

    view: function (_, props) {
      var _this = this;
      var value = props.value;
      var type = getType(value);
      return (
        m('.mjt-value.mjt-value--' + type.toLowerCase(), [
          _this.viewInner(type, value),
        ])
      );
    },
  };

  var MjtStyle = {
    view: function () {
      var style = '' +
        '.mjt-label,' +
        '.mjt-open {' +
        'cursor: pointer;' +
        '}' +

        '.mjt-label,' +
        '.mjt-open,' +
        '.mjt-type,' +
        '.mjt-value {' +
        'display: inline-block;' +
        'vertical-align: top;' +
        '}' +

        '.mjt-label {' +
        'margin: 0 0.1rem 0.2rem 0;' +
        '}' +

        '.mjt-open {' +
        'height: 1rem;' +
        'margin: 0 0.3rem 0 0;' +
        'padding: 0;' +
        'width: 1rem;' +
        '}' +

        '.mjt-name {' +
        'color: mediumvioletred;' +
        'margin: 0 0.3rem 0 0;' +
        '}' +

        '.mjt-value--boolean,' +
        '.mjt-value--number {' +
        'color: blue;' +
        '}' +

        '.mjt-value--string {' +
        'color: green;' +
        '}' +

        '.mjt-value--null,' +
        '.mjt-value--undefined {' +
        'color: gray;' +
        '}' +
        '';

      return m('style', style);
    },
  };

  function getType(value) {
    var tv = typeof value;

    if (tv === 'string')
      return 'STRING';

    if (tv === 'number')
      return 'NUMBER';

    if (tv === 'boolean')
      return 'BOOLEAN';

    if (tv === 'function')
      return 'FUNCTION';

    if (tv === 'undefined')
      return 'UNDEFINED';

    if (tv === 'object' && value === null)
      return 'NULL';

    if (tv === 'object' && Array.isArray(value))
      return 'ARRAY';

    if (tv === 'object')
      return 'OBJECT';
  }

  var mithrilJsonTree = {
    INITIALLY_OPENED_TYPES: INITIALLY_OPENED_TYPES,
    MjtFunction: MjtFunction,
    MjtNode: MjtNode,
    MjtStyle: MjtStyle,
    MjtType: MjtType,
    MjtValue: MjtValue,
    getType: getType,
  };

  if (typeof window === 'undefined') {
    module.exports = mithrilJsonTree;
  } else {
    window.mithrilJsonTree = mithrilJsonTree;
  }
})();
