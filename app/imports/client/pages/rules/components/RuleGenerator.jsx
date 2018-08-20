import React, { Component } from "react";
import connectField from "uniforms/connectField";

class RuleGenerator extends Component {
  constructor() {
    super();
    this.state = {
      rule: []
    };
  }

  onChange = () => {};

  onAddStatement = () => {
    let { rule } = this.state;
    rule.push({ type: "single" });
    this.setState({ rule });
  };

  onAddOrGroup = () => {
    let { rule } = this.state;
    rule.push({ type: "or" });
    this.setState({ rule });
  };

  onAddAndGroup = () => {
    let { rule } = this.state;
    rule.push({ type: "and" });
    this.setState({ rule });
  };

  render() {
    const { rule } = this.state;
    return (
      <div>
        {rule.map((condition, index) => {
          if (condition.type === "and") {
            return (
              <div>
                <input label="Select action to fire" />
              </div>
            );
          } else if (condition.type === "or") {
            return (
              <div>
                <input label="Select action to fire" />
              </div>
            );
          }
          return (
            <div>
              <input label="Select action to fire" />
            </div>
          );
        })}
        <button onClick={this.onAddCondition}>Add Statement</button>
        <button onClick={this.onAddOrGroup}>Add OR Group</button>
        <button onClick={this.onAddAndGroup}>Add AND Group</button>
      </div>
    );
  }
}

export default connectField(RuleGenerator, {
  ensureValue: false,
  includeInChain: false
});
