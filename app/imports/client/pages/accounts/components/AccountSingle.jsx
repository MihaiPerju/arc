import React, { Component } from "react";
import classNames from "classnames";
import moment from "moment/moment";
import commaNumber from "comma-number";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";

export default class AccountSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontNormal: false,
      checked: false
    };
  }

  onCheck(e) {
    e.stopPropagation();
    const { checkAccount, account } = this.props;
    checkAccount(account);
  }

  onSelectAccount() {
    const { selectAccount, account } = this.props;
    selectAccount(account);
  }

  onSubmitTags = data => {
    const { _id } = this.props.account;
    Object.assign(data, { _id });

    Meteor.call("account.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const {
      account,
      active,
      currentAccount,
      expiredTickle,
      moduleTags
    } = this.props;

    const classes = classNames("list-item task-item", {
      "bg--yellow": active,
      "tickled-item": expiredTickle == 1,
      open: account._id === currentAccount
    });

    return (
      <div className={classes} onClick={this.onSelectAccount.bind(this)}>
        <div className="check-item">
          <input type="checkbox" checked={active} className="hidden" />
          <label onClick={this.onCheck.bind(this)} />
          <TagItem
            title="Tag Account"
            tagIds={account.tagIds}
            moduleTags={moduleTags}
            onSubmitTags={this.onSubmitTags.bind(this)}
          />
        </div>
        <div className="mark-task">
          <input type="checkbox" className="hidden" />
          <label />
        </div>
        <div className="row__item">
          <div className="left__side">
            <div
              className={
                this.state.fontNormal ? "person font-normal" : "person"
              }
            >
              {account.ptName}
            </div>
          </div>
          <div className="right__side">
            <div className="pacient-id text-blue">{account.acctNum}</div>
            <div className="financial-class">O/D</div>
            <div className="time">
              {account && moment(account.createdAt).format(" hh:mm")}
            </div>
          </div>
        </div>
        <div className="row__item">
          <div className="price">{commaNumber(account.acctBal)}</div>
          <div className="location">
            {account.facility && account.facility.name}
          </div>
        </div>
      </div>
    );
  }
}
