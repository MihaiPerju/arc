import React, { Component } from "react";
import TwoWayQuerybuilder from "react-two-way-querybuilder";
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
  handleChange = query => {
    this.props.onChange(query.data);
  };

  render() {
    return <TwoWayQuerybuilder fields={fields} onChange={this.handleChange} />;
  }
}

export default connectField(RuleGenerator, {});
