"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.function.name");

var _objectWithoutProperties2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectWithoutProperties")
);

require("core-js/modules/es6.date.to-iso-string");

var _react = _interopRequireDefault(require("react"));

var _connectField = _interopRequireDefault(require("uniforms/connectField"));

var _filterDOMProps = _interopRequireDefault(
  require("uniforms/filterDOMProps")
);

var dateFormat = function dateFormat(value) {
  return value && value.toISOString().slice(0, -8);
};

var dateParse = function dateParse(timestamp, onChange) {
  var date = new Date(timestamp);

  if (date.getFullYear() < 10000) {
    onChange(date);
  } else if (isNaN(timestamp)) {
    onChange(undefined);
  }
};

var Date_ = function Date_(_ref) {
  var disabled = _ref.disabled,
    id = _ref.id,
    inputRef = _ref.inputRef,
    label = !_ref.labelHidden && _ref.label,
    max = _ref.max,
    min = _ref.min,
    name = _ref.name,
    _onChange = _ref.onChange,
    placeholder = _ref.placeholder,
    value = _ref.value,
    props = (0, _objectWithoutProperties2.default)(_ref, [
      "disabled",
      "id",
      "inputRef",
      "label",
      "max",
      "min",
      "name",
      "onChange",
      "placeholder",
      "value"
    ]);
  return _react.default.createElement(
    "div",
    (0, _filterDOMProps.default)(props),
    label &&
      _react.default.createElement(
        "label",
        {
          htmlFor: id
        },
        label
      ),
    _react.default.createElement("input", {
      disabled: disabled,
      id: id,
      max: dateFormat(max),
      min: dateFormat(min),
      name: name,
      onChange: function onChange(event) {
        return dateParse(event.target.valueAsNumber, _onChange);
      },
      placeholder: placeholder,
      ref: inputRef,
      type: "datetime-local",
      value: dateFormat(value)
    })
  );
};

Date_.displayName = "Date";

var _default = (0, _connectField.default)(Date_);

exports.default = _default;
