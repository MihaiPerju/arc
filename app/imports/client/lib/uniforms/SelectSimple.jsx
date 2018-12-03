import React from "react";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";
import Select from "react-select";
import "react-select/dist/react-select.css";

class SelectSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  onChange = newValue => {
    if (newValue && newValue.value) {
      this.props.onChange(newValue.value);
      this.setState({
        value: newValue.value
      });
    }
  };

  render() {
    const { id, label, labelHidden, options, disabled, ...props } = this.props;
    const { value } = this.state;

    return (
      <div {...filterDOMProps(props)}>
        {!labelHidden && <label htmlFor={id}>{label}</label>}
        <Select
          disabled={disabled}
          options={options}
          onChange={this.onChange}
          value={value}
          name={this.props.name}
        />
      </div>
    );
  }
}

export default connectField(SelectSimple, {
  ensureValue: false,
  includeInChain: false
});
