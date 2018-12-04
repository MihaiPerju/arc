import React, { Component } from "react";
import AccountSingle from "./AccountSingle.jsx";
import _ from "underscore";

export default class AccountList extends Component {
  constructor(props) {
    super(props);
  }

  accountIsActive(account) {
    const { accountsSelected, bulkAssign } = this.props;
    if(bulkAssign) {
      return true;
    }
    return _.includes(accountsSelected, account._id);
  }

  render() {
    const {
      data,
      checkAccount,
      selectAccount,
      currentAccount,
      classes,
      tags,
      bulkAssign
    } = this.props;
    return (
      <div className={classes}>
        {data &&
          _.map(data, account => {
            return (
              <AccountSingle
                active={this.accountIsActive(account)}
                currentAccount={currentAccount}
                selectAccount={selectAccount}
                checkAccount={checkAccount}
                update={this.update}
                key={account._id}
                account={account}
                tags={tags}
                bulkAssign={bulkAssign}
              />
            );
          })}
      </div>
    );
  }
}
