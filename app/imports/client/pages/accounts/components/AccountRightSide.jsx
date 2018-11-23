import React, { Component } from "react";
import AccountContent from "../AccountContent.jsx";
import Notifier from "/imports/client/lib/Notifier";

export default class AccountRightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      wasAccountActioned: false,
      account: {}
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.pollingMethod = setInterval(() => {
      this.getAccount();
    }, 3000);
  }

  getAccount() {
    const { currentAccount } = this.props;
    Meteor.call("account.getOne", currentAccount, (err, account) => {
      if (!err) {
        this.setState({ account });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  freezeAccount = () => {
    this.setState({ wasAccountActioned: true });
  };

  componentWillUnmount = () => {
    const { currentAccount } = this.props;
    const { wasAccountActioned } = this.state;
    if (wasAccountActioned) {
      Meteor.call("account.freeze", currentAccount, err => {
        if (!err) {
          Notifier.success("Done!");
        } else {
          Notifier.error("");
        }
      });
    }
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  render() {
    const { fade, account } = this.state;
    const {
      openMetaData,
      closeRightPanel,
      accountsSelected,
      removeLock
    } = this.props;
    console.log(account);

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <AccountContent
          freezeAccount={this.freezeAccount}
          account={account}
          openMetaData={openMetaData}
          accountsSelected={accountsSelected}
          closeRightPanel={closeRightPanel}
          removeLock={removeLock}
        />
      </div>
    );
  }
}
