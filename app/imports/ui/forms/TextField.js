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

var _react = _interopRequireDefault(require("react"));

var _connectField = _interopRequireDefault(require("uniforms/connectField"));

var _filterDOMProps = _interopRequireDefault(
  require("uniforms/filterDOMProps")
);

var Text = function Text(_ref) {
  var disabled = _ref.disabled,
    id = _ref.id,
    inputRef = _ref.inputRef,
    label = !_ref.labelhidden && _ref.label,
    name = _ref.name,
    _onChange = _ref.onChange,
    placeholder = _ref.placeholder,
    type = _ref.type,
    value = _ref.value,
    props = (0, _objectWithoutProperties2.default)(_ref, [
      "disabled",
      "id",
      "inputRef",
      "label",
      "name",
      "onChange",
      "placeholder",
      "type",
      "value",
      "labelhidden"
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
      name: name,
      onChange: function onChange(event) {
        return _onChange(event.target.value);
      },
      placeholder: placeholder,
      ref: inputRef,
      type: type,
      value: value
    })
  );
};

Text.defaultProps = {
  type: "text"
};

var _default = (0, _connectField.default)(Text);

exports.default = _default;
