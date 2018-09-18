import React, { Component } from "react";
import AccountContentHeader from "./components/AccountContent/AccountContentHeader";
import InvoiceMembers from "./components/AccountContent/InvoiceMembers";
import PayerBlock from "./components/AccountContent/PayerBlock";
import ActionBlock from "./components/AccountContent/ActionBlock";
import LetterList from "./components/AccountContent/LetterList";
import PdfFiles from "./components/AccountContent/PdfFiles";
import EscalateReason from "./components/AccountContent/EscalateReason";
import CommentsListContainer from "/imports/client/pages/comments/CommentsListContainer.jsx";
import Statistics from "/imports/client/pages/accounts/components/Statistics";
import TickleBlock from "./components/AccountContent/TickleBlock";

export default class AccountContent extends Component {
  constructor() {
    super();
  }

  escalateReason() {
    const { account, closeRightPanel } = this.props;
    const { state } = FlowRouter.current().params;
    if (state === "escalated") {
      return (
        <EscalateReason
          accountId={account._id}
          escalationId={account.escalationId}
          closeRightPanel={closeRightPanel}
        />
      );
    }
  }

  tickleBlock = () => {
    const { account, closeRightPanel } = this.props;
    const { state } = FlowRouter.current().params;
    if (state === "tickles") {
      return (
        <TickleBlock
          accountId={account._id}
          closeRightPanel={closeRightPanel}
        />
      );
    }
  };

  render() {
    const {
      account,
      openMetaData,
      closeRightPanel,
      accountsSelected,
      removeLock,
      freezeAccount
    } = this.props;
    if (accountsSelected.length) {
      return <Statistics accountsSelected={accountsSelected} />;
    }
    return (
      <div className="main-content">
        {account && (
          <div>
            <AccountContentHeader
              account={account}
              openMetaData={openMetaData}
              closeRightPanel={closeRightPanel}
              removeLock={removeLock}
            />
            {this.escalateReason()}
            {this.tickleBlock()}
            <PayerBlock account={account} />
            <InvoiceMembers account={account} />
            <ActionBlock
              freezeAccount={freezeAccount}
              closeRightPanel={closeRightPanel}
              account={account}
            />
            <LetterList account={account} />
            <PdfFiles account={account} />
            <CommentsListContainer
              account={account}
              closeRightPanel={closeRightPanel}
            />
          </div>
        )}
      </div>
    );
  }
}
