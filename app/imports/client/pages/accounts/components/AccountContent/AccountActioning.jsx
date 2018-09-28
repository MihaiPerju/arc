import React from 'react';
import Dialog from '/imports/client/lib/ui/Dialog';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import AccountTickle from './AccountTickle';
import AccountEscalation from './AccountEscalation';
import AccountAssign from './AccountAssign';
import classNames from 'classnames';

export default class AccountActioning extends React.Component {
  constructor () {
    super ();
    this.state = {
      dialogIsActive: false,
    };
  }

  openDialog = () => {
    if (!this.props.metaData) {
      this.setState ({
        dialogIsActive: true,
      });
    } else {
      this.props.openMetaData ();
    }
  };

  closeDialog = () => {
    this.setState ({
      dialogIsActive: false,
    });
  };

  showDialog = () => {
    const {
      model,
      accountId,
      options,
      title,
      escalate,
      metaData,
      tickle,
      openMetaData,
      closeRightPanel,
      escalationId,
    } = this.props;

    if (tickle) {
      return (
        <AccountTickle
          accountId={accountId}
          close={this.closeDialog}
          closeRightPanel={closeRightPanel}
        />
      );
    }
    if (metaData) {
      openMetaData ();
    }
    if (escalate) {
      return (
        <AccountEscalation
          close={this.closeDialog}
          title={title}
          escalationId={escalationId}
          accountId={accountId}
          closeRightPanel={closeRightPanel}
        />
      );
    } else {
      return (
        <AccountAssign
          accountId={accountId}
          title={title}
          userOptions={options}
          close={this.closeDialog}
          model={model}
          closeRightPanel={closeRightPanel}
        />
      );
    }
  };

  render () {
    const {dialogIsActive} = this.state;
    const {type, title, tickle} = this.props;
    const dialogClasses = classNames ('account-dialog', {
      'tickle-dialog': tickle,
    });

    return (
      <button className="btn--white" onClick={this.openDialog}>
        <span>{type}</span>
        {dialogIsActive &&
          <Dialog
            className={dialogClasses}
            closePortal={this.closeDialog}
            title={title}
          >
            {this.showDialog ()}
          </Dialog>}
      </button>
    );
  }
}
