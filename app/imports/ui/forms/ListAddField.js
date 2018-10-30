"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _connectField = _interopRequireDefault(require("uniforms/connectField"));

var _filterDOMProps = _interopRequireDefault(require("uniforms/filterDOMProps"));

var ListAdd = function ListAdd(_ref) {
  var disabled = _ref.disabled,
      showListField = _ref.showListField,
      parent = _ref.parent,
      value = _ref.value,
      label = _ref.label,
      props = (0, _objectWithoutProperties2.default)(_ref, ["disabled", "parent", "value"]);
  var limitNotReached = !disabled && !(parent.maxCount <= value.length);
  return _react.default.createElement("span", (0, _extends2.default)({}, (0, _filterDOMProps.default)(props), {
    onClick: function onClick() {
      showListField();
      return limitNotReached && parent.onChange(parent.value.concat([(0, _cloneDeep.default)(value)]));
    },
    className: 'insurance-btn insurance-btn__add'
  }), `${label} +`);
};

var _default = (0, _connectField.default)(ListAdd, {
  includeParent: true,
  initialValue: false
});

exports.default = _default;