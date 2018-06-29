import React, { Component } from "react";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";
import Notifier from "/imports/client/lib/Notifier";
import commaNumber from "comma-number";

export default class PayItem extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false
    };
  }

  updateActiveInsurance() {
    this.setState({
      dialogIsActive: true
    });
  }

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  confirmUpdate(insurance) {
    const { accountId } = this.props;
    const { insCode, insName } = insurance;
    Meteor.call(
      "account.updateActiveInsCode",
      accountId,
      insCode,
      insName,
      err => {
        if (!err) {
          Notifier.success("Active Insurance Updated!");
        } else {
          Notifier.error(err.reason);
        }
      }
    );
    this.setState({
      dialogIsActive: false
    });
  }
  render() {
    const { insurance, index, indexActiveInsCode } = this.props;
    const { dialogIsActive } = this.state;
    const classes = classNames({
      "pay-item": true,
      active: indexActiveInsCode === index
    });
    return (
      <div className={classes}>
        <div
          className="brand-block text-center"
          onClick={this.updateActiveInsurance.bind(this)}
        >
          {insurance.insName}
          {dialogIsActive && (
            <Dialog
              title="Confirm"
              className="account-dialog"
              closePortal={this.closeDialog}
            >
              <div className="form-wrapper">
                Are you sure you want to make selected item as active insurance
                ?
              </div>
              <div className="btn-group">
                <button className="btn-cancel" onClick={this.closeDialog}>
                  Cancel
                </button>
                <button
                  className="btn--light-blue"
                  onClick={this.confirmUpdate.bind(this, insurance)}
                >
                  Confirm & Update
                </button>
              </div>
            </Dialog>
          )}
        </div>
        <div className="pay-item__wrapper">
          <div className="info-row">
            <div className="text-light-grey">Balance</div>
            <div className="text-dark-grey price">
              {insurance.insBal ? commaNumber(insurance.insBal) : 0}
            </div>
          </div>
          <div className="info-row">
            <div className="text-light-grey">Phone number</div>
            <div className="text-dark-grey">{insurance.phone}</div>
          </div>
          <div className="info-row">
            <div className="text-light-grey">Last bill date</div>
            <div className="text-dark-grey">{insurance.billDate}</div>
          </div>
        </div>
      </div>
    );
  }
}
