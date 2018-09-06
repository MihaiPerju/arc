import React, { Component } from "react";
import TwoWayQuerybuilder from "./rule-generator/TwoWayQuerybuilder";
import connectField from "uniforms/connectField";

const fields = [
  {
    name: "firstName",
    operators: "all",
    label: "First Name",
    input: { type: "text" }
  },
  {
    name: "lastName",
    operators: "all",
    label: "Last Name",
    input: {
      type: "select",
      options: [
        { value: "Smith", name: "Smith" },
        { value: "London", name: "London" }
      ]
    }
  },
  { name: "age", operators: "all", label: "Age", input: { type: "text" } },
  {
    name: "birthDate",
    operators: "all",
    label: "Birth date",
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
