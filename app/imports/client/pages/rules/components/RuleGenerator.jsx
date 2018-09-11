import React, { Component } from "react";
import TwoWayQuerybuilder from "./rule-generator/TwoWayQuerybuilder";
import connectField from "uniforms/connectField";

const fields = [
  {
    name: "acctNum",
    operators: "all",
    label: "Account Number",
    input: { type: "text" }
  },
  {
    name: "facCode",
    operators: "all",
    label: "Facility Code",
    input: { type: "text" }
  },
  {
    name: "medNo",
    operators: "all",
    label: "Medical Number",
    input: { type: "text" }
  },
  {
    name: "acctBal",
    operators: "all",
    label: "AccountBalance",
    input: { type: "text" }
  }
];

class RuleGenerator extends Component {
  constructor() {
    super();
  }

  onChange = query => {
    this.props.onChange(query);
  };

  render() {
    const query = this.props.value && this.props.value.query;
    const config = { query };

    return (
      <TwoWayQuerybuilder
        config={config}
        fields={fields}
        onChange={this.onChange}
      />
    );
  }
}

export default connectField(RuleGenerator, {});
