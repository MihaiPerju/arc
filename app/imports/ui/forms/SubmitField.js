"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _BaseField = _interopRequireDefault(require("uniforms/BaseField"));

var _react = _interopRequireDefault(require("react"));

var _filterDOMProps = _interopRequireDefault(require("uniforms/filterDOMProps"));

var SubmitField = function SubmitField(_ref, _ref2) {
  var _ref2$uniforms = _ref2.uniforms,
      error = _ref2$uniforms.error,
      state = _ref2$uniforms.state;
  var disabled = _ref.disabled,
      inputRef = _ref.inputRef,
      value = _ref.value,
      props = (0, _objectWithoutProperties2.default)(_ref, ["disabled", "inputRef", "value"]);
  return _react.default.createElement("input", (0, _extends2.default)({
    disabled: disabled === undefined ? !!(error || state.disabled) : disabled,
    ref: inputRef,
    type: "submit"
  }, value ? {
    value: value
  } : {}, (0, _filterDOMProps.default)(props)));
};

SubmitField.contextTypes = _BaseField.default.contextTypes;
var _default = SubmitField;
exports.default = _default;