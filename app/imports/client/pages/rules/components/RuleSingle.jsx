import React, { Component } from "react";
import classNames from "classnames";

export default class RuleSingle extends Component {
  constructor(props) {
    super(props);
  }

  onSetRule() {
    const { rule, setRule } = this.props;
    setRule(rule._id);
  }

  onSelectRule(e) {
    e.stopPropagation();
    const { rule, selectRule } = this.props;
    selectRule(rule._id);
  }

  render() {
    const { rule, rulesSelected, currentRule } = this.props;
    const checked = rulesSelected.includes(rule._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentRule === rule._id
    });
    return (
      <div onClick={this.onSetRule.bind(this)} className={classes}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectRule.bind(this)} />
        </div>
        <div className="row__block align-center">
          <div className="item-name">{rule.name}</div>
        </div>
      </div>
    );
  }
}
