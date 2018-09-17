import React, { Component } from "react";
import TwoWayQuerybuilder from "./rule-generator/TwoWayQuerybuilder";
import connectField from "uniforms/connectField";
import fields from "./rule-generator/helpers/fields";

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
