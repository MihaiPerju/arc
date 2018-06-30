"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.array.map");

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _BaseField = _interopRequireDefault(require("uniforms/BaseField"));

var _react = _interopRequireDefault(require("react"));

var _filterDOMProps = _interopRequireDefault(require("uniforms/filterDOMProps"));

var _nothing = _interopRequireDefault(require("uniforms/nothing"));

var ErrorsField = function ErrorsField(_ref, _ref2) {
  var _ref2$uniforms = _ref2.uniforms,
      error = _ref2$uniforms.error,
      schema = _ref2$uniforms.schema;
  var children = _ref.children,
      props = (0, _objectWithoutProperties2.default)(_ref, ["children"]);
  return !error && !children ? _nothing.default : _react.default.createElement("div", (0, _filterDOMProps.default)(props), children, _react.default.createElement("ul", null, schema.getErrorMessages(error).map(function (message, index) {
    return _react.default.createElement("li", {
      key: index
    }, message);
  })));
};

ErrorsField.contextTypes = _BaseField.default.contextTypes;
var _default = ErrorsField;
exports.default = _default;