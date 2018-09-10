import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/accounts/queries/accountList";
import React, { Component } from "react";
import AccountContent from "../AccountContent.jsx";
import Loading from "/imports/client/lib/ui/Loading";

class AccountRightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const { fade } = this.state;
    const {
      openMetaData,
      closeRightPanel,
      accountsSelected,
      removeLock,
      data,
      isLoading,
      error
    } = this.props;

    const account = data;

    if (isLoading) {
      return <Loading />;
    }

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <AccountContent
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

export default withQuery(
  ({ currentAccount }) => {
    return query.clone({
      filters: { _id: currentAccount }
    });
  },
  { reactive: true, single: true }
)(AccountRightSide);
