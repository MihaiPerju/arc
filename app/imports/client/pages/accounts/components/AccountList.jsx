import React, { Component } from "react";
import AccountSingle from "./AccountSingle.jsx";
import _ from "underscore";
import moment from "moment";

export default class AccountList extends Component {
  constructor(props) {
    super(props);
  }

  accountIsActive(account) {
    const { accountsSelected } = this.props;
    return _.includes(accountsSelected, account._id);
  }

  isExpiredTickle = account => {
    const { tickleDate } = account;
    if (
      tickleDate &&
      (moment(tickleDate).isBefore(moment()) ||
        moment(tickleDate).isSame(moment(), "day"))
    ) {
      return true;
    }
    return false;
  };

  render() {
    const {
      data,
      checkAccount,
      selectAccount,
      currentAccount,
      classes,
      tags
    } = this.props;
    return (
      <div className={classes}>
        {data &&
          _.map(data, account => {
            return (
              <AccountSingle
                active={this.accountIsActive(account)}
                expiredTickle={this.isExpiredTickle(account)}
                currentAccount={currentAccount}
                selectAccount={selectAccount}
                checkAccount={checkAccount}
                update={this.update}
                key={account._id}
                account={account}
                tags={tags}
              />
            );
          })}
      </div>
    );
  }
}
