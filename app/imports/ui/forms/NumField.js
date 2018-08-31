"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectSpread")
);

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.function.bind");

var _classCallCheck2 = _interopRequireDefault(
  require("@babel/runtime/helpers/classCallCheck")
);

var _createClass2 = _interopRequireDefault(
  require("@babel/runtime/helpers/createClass")
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require("@babel/runtime/helpers/possibleConstructorReturn")
);

var _getPrototypeOf2 = _interopRequireDefault(
  require("@babel/runtime/helpers/getPrototypeOf")
);

var _inherits2 = _interopRequireDefault(
  require("@babel/runtime/helpers/inherits")
);

var _assertThisInitialized2 = _interopRequireDefault(
  require("@babel/runtime/helpers/assertThisInitialized")
);

require("core-js/modules/es6.function.name");

var _objectWithoutProperties2 = _interopRequireDefault(
  require("@babel/runtime/helpers/objectWithoutProperties")
);

var _react = _interopRequireWildcard(require("react"));

var _connectField = _interopRequireDefault(require("uniforms/connectField"));

var _filterDOMProps = _interopRequireDefault(
  require("uniforms/filterDOMProps")
);

var noneIfNaN = function noneIfNaN(x) {
  return isNaN(x) ? undefined : x;
};

var Num_ = function Num_(_ref) {
  var decimal = _ref.decimal,
    disabled = _ref.disabled,
    id = _ref.id,
    inputRef = _ref.inputRef,
    label = !_ref.labelhidden && _ref.label,
    max = _ref.max,
    min = _ref.min,
    name = _ref.name,
    onChange = _ref.onChange,
    placeholder = _ref.placeholder,
    step = _ref.step,
    value = _ref.value,
    props = (0, _objectWithoutProperties2.default)(_ref, [
      "decimal",
      "disabled",
      "id",
      "inputRef",
      "label",
      "max",
      "min",
      "name",
      "onChange",
      "placeholder",
      "step",
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
      max: max,
      min: min,
      name: name,
      onChange: onChange,
      placeholder: placeholder,
      ref: inputRef,
      step: step || (decimal ? 0.01 : 1),
      type: "number",
      value: value
    })
  );
}; // NOTE: React < 16 workaround. Make it optional?

var Num =
  /*#__PURE__*/
  (function(_Component) {
    (0, _inherits2.default)(Num, _Component);

    function Num() {
      var _this;

      (0, _classCallCheck2.default)(this, Num);
      _this = (0, _possibleConstructorReturn2.default)(
        this,
        (0, _getPrototypeOf2.default)(Num).apply(this, arguments)
      );
      _this.state = {
        value: "" + _this.props.value
      };
      _this.onChange = _this.onChange.bind(
        (0, _assertThisInitialized2.default)(
          (0, _assertThisInitialized2.default)(_this)
        )
      );
      return _this;
    }

    (0, _createClass2.default)(Num, [
      {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(_ref2) {
          var decimal = _ref2.decimal,
            value = _ref2.value;
          var parse = decimal ? parseFloat : parseInt;

          if (
            noneIfNaN(parse(value)) !==
            noneIfNaN(parse(this.state.value.replace(/[.,]+$/, "")))
          ) {
            this.setState({
              value: value === undefined || value === "" ? "" : "" + value
            });
          }
        }
      },
      {
        key: "onChange",
        value: function onChange(_ref3) {
          var value = _ref3.target.value;
          var change = value.replace(/[^\d.,-]/g, "");
          this.setState({
            value: change
          });
          this.props.onChange(
            noneIfNaN((this.props.decimal ? parseFloat : parseInt)(change))
          );
        }
      },
      {
        key: "render",
        value: function render() {
          return Num_(
            (0, _objectSpread2.default)({}, this.props, {
              onChange: this.onChange,
              value: this.state.value
            })
          );
        }
      }
    ]);
    return Num;
  })(_react.Component);

var _default = (0, _connectField.default)(Num);

exports.default = _default;
