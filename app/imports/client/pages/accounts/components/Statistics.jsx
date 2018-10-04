import React, { Component } from "react";

export default class AccountContent extends Component {
  constructor() {
    super();
  }

  render() {
    const {  accountsSelected } = this.props;
    return (
      <div className="main-content">
        <div className="header-block header-account">
          <div className="main-info">
            <div className="left__side">
              <div className="name">
                These are the selected accounts for statistics:
              </div>
              {_.map(accountsSelected, accountId => {
                return <p key={accountId}>{accountId}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
