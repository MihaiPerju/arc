import React, { Component } from "react";
import AccountContent from "../AccountContent.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class AccountRightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      wasAccountActioned: false,
      account: null
    };

    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getAccount()

    this.pollingMethod = setInterval(() => {
      this.getAccount();
    }, 3000);
  }

  // If account changed we need to go fetch it right away
  componentWillReceiveProps(nextProps) {
    if(nextProps.currentAccount === this.props.currentAccount)
      return;

    this.setState({account: null});
    this.getAccount(nextProps.currentAccount);
  }

  getAccount(currentAccount) {
    const accountId = currentAccount || this.props.currentAccount
    Meteor.call("account.getOne", accountId, (err, account) => {
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
    const {
      openMetaData,
      closeRightPanel,
      accountsSelected,
      removeLock
    } = this.props;

    if (!this.state.account) {
      return <Loading />;
    }

    return (
      <div className={this.state.fade ? "right__side in" : "right__side"}>
        <AccountContent
          freezeAccount={this.freezeAccount}
          account={this.state.account}
          openMetaData={openMetaData}
          accountsSelected={accountsSelected}
          closeRightPanel={closeRightPanel}
          removeLock={removeLock}
        />
      </div>
    );
  }
}
