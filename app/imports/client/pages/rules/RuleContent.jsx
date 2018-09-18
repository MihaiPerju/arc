import React, { Component } from "react";
import RuleEdit from "/imports/client/pages/rules/RuleEdit.jsx";

export default class RuleContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
  }

  componentWillReceiveProps() {
    this.setState({ edit: false });
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { rule } = this.props;
    const { edit } = this.state;
    return (
      <div>
        {edit ? (
          <RuleEdit rule={rule} close={this.setEdit} />
        ) : (
          <div className="main-content flex-content region-content">
            <div className="main-content flex-content region-content">
              <div className="intro-block text-center">
                <i className="icon-globe" />
                {rule.client &&
                  rule.client.clientName && (
                    <div>
                      <div className="text-light-grey">Client</div>
                      <div className="region">{rule.client.clientName}</div>
                    </div>
                  )}
                <div className="text-light-grey">Rule name</div>
                <div className="region">{rule.name}</div>
                <div className="text-light-grey">Rule Description</div>
                <div className="region">{rule.description}</div>
                <div className="text-light-grey">Rule Priority</div>
                <div className="region">{rule.priority}</div>

                <div className="text-light-grey">
                  {rule.isBreakingLoop
                    ? "This rule can stop other rules"
                    : "This rule would not stop other rules"}
                </div>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={this.setEdit}
                  className="btn-edit btn--white"
                >
                  Edit rule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
