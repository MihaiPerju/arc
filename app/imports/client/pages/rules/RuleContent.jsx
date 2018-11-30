import React, { Component } from "react";
import RuleEdit from "/imports/client/pages/rules/RuleEdit.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class RuleContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      currentRule: this.props.currentRule
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getRule();

    this.pollingMethod = setInterval(() => {
      this.getRule();
    }, 10000);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.currentRule === this.props.currentRule)
      return;

    this.setState({currentRule: nextProps.currentRule, edit: false});
    this.getRule(nextProps.currentRule);
  }

  getRule(newRuleID) {
    const currentRule = newRuleID || this.state.currentRule;
    Meteor.call("rule.getOne", currentRule, (err, rule) => {
      if (!err) {
        this.setState({ rule });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  setEdit = () => {
    this.setState({ edit: !this.state.edit });
  };

  render() {
    const { rule } = this.state;

    if (!rule) {
      return <Loading />;
    }

    return (
      <div>
        {this.state.edit ? (
          <RuleEdit rule={rule} close={this.setEdit} />
        ) : (
          <div className="main-content action-content">
            <div className="main-content__wrapper">
              <div className="intro-block text-center">
                <div className="intro-block__wrapper">
                  {rule.client && rule.client.clientName && (
                    <div>
                      <div className="text-light-grey">Client</div>
                      <div className="action-name">
                        {rule.client.clientName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="info-block">
                <div className="text-block">
                  <div className="text-light-grey text-label half-width">
                    Rule name
                  </div>
                  <div className="status">{rule.name}</div>
                </div>
                <div className="text-block">
                  <div className="text-light-grey text-label half-width">
                    Rule Description
                  </div>
                  <p>{rule.description || "No description"}</p>
                </div>
                <div className="text-block">
                  <div className="text-light-grey text-label half-width">
                    Rule Priority
                  </div>

                  <div className="reason">{rule.priority || "No Priority"}</div>
                </div>

                <div className="text-block">
                  <div className="text-light-grey text-label half-width">
                    This rule will prevent other rules
                    <br />
                    from taking action if it is true{" "}
                  </div>
                  <div className="reason">
                    {rule.isBreakingLoop ? "Will prevent" : "Wouldn't prevent"}
                  </div>
                </div>
              </div>
              <button onClick={this.setEdit} className="btn-edit btn--white">
                Edit Rule
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
