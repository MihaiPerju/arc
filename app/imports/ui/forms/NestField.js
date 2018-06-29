"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.name");

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _connectField = _interopRequireDefault(require("uniforms/connectField"));

var _filterDOMProps = _interopRequireDefault(require("uniforms/filterDOMProps"));

var _injectName = _interopRequireDefault(require("uniforms/injectName"));

var _joinName = _interopRequireDefault(require("uniforms/joinName"));

var _AutoField = _interopRequireDefault(require("./AutoField"));

var Nest = function Nest(_ref) {
  var children = _ref.children,
      fields = _ref.fields,
      itemProps = _ref.itemProps,
      label = _ref.label,
      name = _ref.name,
      props = (0, _objectWithoutProperties2.default)(_ref, ["children", "fields", "itemProps", "label", "name"]);
  return _react.default.createElement("div", (0, _filterDOMProps.default)(props), label && _react.default.createElement("label", null, label), children ? (0, _injectName.default)(name, children) : fields.map(function (key) {
    return _react.default.createElement(_AutoField.default, (0, _extends2.default)({
      key: key,
      name: (0, _joinName.default)(name, key)
    }, itemProps));
  }));
};

var _default = (0, _connectField.default)(Nest, {
  ensureValue: false,
  includeInChain: false
});

exports.default = _default;