import PropTypes from "prop-types";
import React from "react";
import TreeHelper from "./helpers/TreeHelper";
import moment from "moment";
import DatePicker from "react-datepicker";
const defaultErrorMsg = "Input value is not correct";
import Select from "react-select";
import "react-select/dist/react-select.css";

const isValueCorrect = (pattern, value) => {
  const newPattern = new RegExp(pattern);
  const match = newPattern.exec(value);
  return match === null;
};

class Rule extends React.Component {
  constructor(props) {
    super(props);
    this.treeHelper = new TreeHelper(this.props.data);
    this.node = this.treeHelper.getNodeByName(this.props.nodeName);
    this.styles = this.props.styles;
    this.state = {
      date: "",
      currField: this.findCreateRuleObject(this.props.fields, this.node),
      validationError: false,
      test: ""
    };
  }

  componentWillMount() {
    const date = moment(new Date(this.node.value));
    if (date.isValid()) {
      this.setState({ date });
    }
  }

  componentWillReceiveProps = nextProps => {
    this.node = this.treeHelper.getNodeByName(nextProps.nodeName);
  };

  findCreateRuleObject = (fields, node) => {
    for (let field of fields) {
      if (field.name === node.field) {
        return this.generateRuleObject(field, node);
      }
    }
  };

  onFieldChanged = event => {
    this.node.field = event.target.value;
    const field = this.getFieldByName(event.target.value);
    const rule = this.generateRuleObject(field, this.node);
    this.setState({ currField: rule });
    this.props.onChange();
  };

  onOperatorChanged = event => {
    this.node.operator = event.target.value;
    const field = this.getFieldByName(this.node.field);
    const rule = this.generateRuleObject(field, this.node);
    this.setState({ currField: rule });
    this.props.onChange();
  };

  clearValue(value) {
    while (value.indexOf("'") > -1) {
      let index = value.indexOf("'");
      value = value.slice(0, index) + value.slice(index + 1, value.length);
    }
    return value;
  }

  onInputChanged = event => {
    let value = this.clearValue(event.target.value);
    const pattern = this.state.currField.input.pattern;
    if (pattern) {
      this.setState({
        validationError: isValueCorrect(pattern, value)
      });
    }
    this.node.value = value;
    const field = this.getFieldByName(this.node.field);
    const rule = this.generateRuleObject(field, this.node);
    this.setState({ currField: rule });
    this.props.onChange();
  };

  onSelectChanged = ({ value }) => {
    const pattern = this.state.currField.input.pattern;
    if (pattern) {
      this.setState({
        validationError: isValueCorrect(pattern, value)
      });
    }
    this.node.value = value;
    const field = this.getFieldByName(this.node.field);

    const rule = this.generateRuleObject(field, this.node);
    this.setState({ currField: rule });
    this.props.onChange();
  };

  onDateChange = date => {
    this.node.value = moment(date).toDate();
    const field = this.getFieldByName(this.node.field);
    const rule = this.generateRuleObject(field, this.node);
    this.setState({ currField: rule, date });
    this.props.onChange();
  };

  getFieldByName = name => {
    return this.props.fields.find(x => x.name === name);
  };

  getInputTag = inputType => {
    const errorText = this.state.currField.input.errorText;
    switch (inputType) {
      case "textarea":
        return (
          <div className={this.styles.txtArea}>
            <textarea
              className="input"
              onChange={this.onInputChanged}
              value={this.node.value ? this.node.value : ""}
            />
            {this.state.validationError ? (
              <p className={this.styles.error}>
                {errorText || defaultErrorMsg}
              </p>
            ) : null}
          </div>
        );
      case "select":
        return (
          <Select
            options={this.state.currField.input.options}
            onChange={this.onSelectChanged}
            value={this.node.value}
          />
        );
      case "date":
        return (
          <div>
            <DatePicker
              calendarClassName="cc-datepicker"
              showMonthDropdown
              showYearDropdown
              yearDropdownItemNumber={4}
              todayButton={"Today"}
              placeholderText="Select New Date"
              fixedHeight
              className="dateSelect"
              selected={this.state.date}
              onChange={this.onDateChange}
            />
          </div>
        );
      default:
        return (
          <div>
            <input
              type={this.state.currField.input.type}
              value={this.node.value}
              onChange={this.onInputChanged}
              className={this.styles.input}
            />
            {this.state.validationError ? (
              <p className={this.styles.error}>
                {errorText || defaultErrorMsg}
              </p>
            ) : null}
          </div>
        );
    }
  };

  generateRuleObject = (field, node) => {
    const rule = {};
    rule.input = field.input;
    node = node ? node : this.treeHelper.getNodeByName(this.props.nodeName);
    if (field.input.type !== "date") {
      rule.input.value = node.value;
    }
    if (!field.operators || typeof field.operators === "string") {
      rule.operators = this.props.operators;
      return rule;
    }
    const ruleOperators = [];
    for (let i = 0, length = field.operators.length; i < length; i += 1) {
      for (
        let opIndex = 0, opLength = this.props.operators.length;
        opIndex < opLength;
        opIndex += 1
      ) {
        if (field.operators[i] === this.props.operators[opIndex].operator) {
          ruleOperators.push(this.props.operators[opIndex]);
        }
      }
    }
    rule.operators = ruleOperators;
    return rule;
  };

  handleDelete = () => {
    this.treeHelper.removeNodeByName(this.props.nodeName);
    this.props.onChange();
  };

  render() {
    const { node } = this;
    return (
      <div className={this.styles.rule}>
        <select
          value={this.node.field}
          className={this.styles.select}
          onChange={this.onFieldChanged}
        >
          {this.props.fields.map((field, index) => (
            <option value={field.name} key={index}>
              {field.label}
            </option>
          ))}
        </select>
        <select
          value={this.node.operator}
          className={this.styles.select}
          onChange={this.onOperatorChanged}
        >
          {this.state.currField.operators.map((operator, index) => (
            <option value={operator.operator} key={index}>
              {operator.label}
            </option>
          ))}
        </select>
        {node.operator !== "!!" &&
          node.operator !== "!" &&
          this.getInputTag(this.state.currField.input.type)}
        <button
          type="button"
          className={this.styles.deleteBtn}
          onClick={this.handleDelete}
        >
          {this.props.buttonsText.delete}
        </button>
      </div>
    );
  }
}

Rule.propTypes = {
  buttonsText: PropTypes.object,
  data: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  nodeName: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  operators: PropTypes.array.isRequired,
  styles: PropTypes.object.isRequired
};

export default Rule;

{
  /* <select className={this.styles.select} onChange={this.onInputChanged}>
{this.state.currField.input.options.map((option, index) => (
  <option value={option.value} key={index}>
    {option.name}
  </option>
))}
</select> */
}
