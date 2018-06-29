"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(
  require("@babel/runtime/helpers/extends")
);

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.name");

var _objectWithoutProperties2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectWithoutProperties")
);

var _react = _interopRequireWildcard(require("react"));

var _connectField = _interopRequireDefault(require("uniforms/connectField"));

var _filterDOMProps = _interopRequireDefault(
  require("uniforms/filterDOMProps")
);

var _joinName = _interopRequireDefault(require("uniforms/joinName"));

var _ListAddField = _interopRequireDefault(require("./ListAddField"));

var _ListItemField = _interopRequireDefault(require("./ListItemField"));

var List = function List(_ref) {
  var children = _ref.children,
    initialCount = _ref.initialCount,
    itemProps = _ref.itemProps,
    label = _ref.label,
    name = _ref.name,
    value = _ref.value,
    props = (0, _objectWithoutProperties2.default)(_ref, [
      "children",
      "initialCount",
      "itemProps",
      "label",
      "name",
      "value"
    ]);
  return _react.default.createElement(
    "ul",
    (0, _filterDOMProps.default)(props),
    label &&
      _react.default.createElement(
        "label",
        null,
        label,
        _react.default.createElement(_ListAddField.default, {
          name: "".concat(name, ".$"),
          initialCount: initialCount
        })
      ),
    children
      ? value.map(function(item, index) {
          return _react.Children.map(children, function(child) {
            return _react.default.cloneElement(child, {
              key: index,
              label: null,
              name: (0, _joinName.default)(
                name,
                child.props.name && child.props.name.replace("$", index)
              )
            });
          });
        })
      : value.map(function(item, index) {
          return _react.default.createElement(
            _ListItemField.default,
            (0, _extends2.default)(
              {
                key: index,
                label: null,
                name: (0, _joinName.default)(name, index)
              },
              itemProps
            )
          );
        })
  );
};

var _default = (0, _connectField.default)(List, {
  ensureValue: true,
  includeInChain: false
});

exports.default = _default;
