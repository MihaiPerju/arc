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
          <div className="main-content action-content">
       
        <div className="main-content__wrapper">
          <div className="intro-block text-center">
            <div className="intro-block__wrapper">
            {rule.client && 
                  rule.client.clientName && (
                    <div>
                  <div className="text-light-grey">Client</div>
                  <div className="action-name">{rule.client.clientName}</div>
                  </div>
                  )}
            </div>
          </div>
          <div className="info-block">
            <div className="text-block">
              <div className="text-light-grey text-label half-width">Rule name</div>
              <div className="status">{rule.name}</div>
            </div>
            <div className="text-block">
              <div className="text-light-grey text-label half-width">Rule Description</div>
              <p>{ rule.description || "No description"}</p>
            </div>
            <div className="text-block">
              <div className="text-light-grey text-label half-width">Rule Priority</div>

              <div className="reason">
                { rule.priority || "No Priority"}
              </div>
            </div>

            <div className="text-block">
              <div className="text-light-grey text-label half-width">This rule will prevent other rules<br/>from taking action if it is true </div>
              <div className="reason">
                {rule.isBreakingLoop ? "Will prevent": "Wouldn't prevent"}
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
