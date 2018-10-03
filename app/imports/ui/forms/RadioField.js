"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.name");

var _objectWithoutProperties2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectWithoutProperties")
);

var _react = _interopRequireDefault(require("react"));

var _connectField = _interopRequireDefault(require("uniforms/connectField"));

var _filterDOMProps = _interopRequireDefault(
  require("uniforms/filterDOMProps")
);

var Radio = function Radio(_ref) {
  var allowedValues = _ref.allowedValues,
    disabled = _ref.disabled,
    id = _ref.id,
    label = !_ref.labelHidden && _ref.label,
    name = _ref.name,
    _onChange = _ref.onChange,
    transform = _ref.transform,
    value = _ref.value,
    props = (0, _objectWithoutProperties2.default)(_ref, [
      "allowedValues",
      "checkboxes",
      "disabled",
      "id",
      "label",
      "name",
      "onChange",
      "transform",
      "value"
    ]);
  return _react.default.createElement(
    "div",
    (0, _filterDOMProps.default)(props),
    label && _react.default.createElement("label", null, label),
    allowedValues.map(function(item) {
      return _react.default.createElement(
        "div",
        {
          key: item
        },
        _react.default.createElement("input", {
          checked: item === value,
          disabled: disabled,
          id: "".concat(id, "-").concat(item),
          name: name,
          onChange: function onChange() {
            return _onChange(item);
          },
          type: "radio"
        }),
        _react.default.createElement(
          "label",
          {
            htmlFor: "".concat(id, "-").concat(item)
          },
          transform ? transform(item) : item
        )
      );
    })
  );
};

var _default = (0, _connectField.default)(Radio);

exports.default = _default;
