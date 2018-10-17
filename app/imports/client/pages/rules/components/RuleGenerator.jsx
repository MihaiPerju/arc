import React, { Component } from "react";
import TwoWayQuerybuilder from "./rule-generator/TwoWayQuerybuilder";
import connectField from "uniforms/connectField";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

class RuleGenerator extends Component {
  constructor() {
    super();
    this.state = {
      fields: [],
      isLoading: true
    };
  }

  componentDidMount() {
    Meteor.call("rules.getFields", (err, fields) => {
      if (!err) {
        this.setState({ isLoading: false, fields });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onChange = query => {
    this.props.onChange(query);
  };

  render() {
    const query = this.props.value && this.props.value.query;
    const config = { query };
    const { fields, isLoading } = this.state;
    console.log(fields);

    if (isLoading) {
      return <Loading />;
    }
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
