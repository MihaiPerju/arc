import React, { Component } from "react";
import moment from "moment/moment";
import AccountActioning from "./AccountActioning";
import RolesEnum from "/imports/api/users/enums/roles";

export default class AccountContentHeader extends Component {
  constructor() {
    super();
  }

  getOptions(users) {
    let options = [];
    if (users) {
      for (user of users) {
        let item = {
          label:
            user &&
            user.profile &&
            user.profile.firstName +
              " " +
              user.profile.lastName +
              "(" +
              user.roles[0] +
              ")",
          value: user && user._id
        };
        options.push(item);
      }
    }
    return options;
  }

  getAssignee() {
    const { account } = this.props;
    if (account.assignee) {
      const { profile } = account.assignee;
      return (
        <div className="label label--grey">
          <a href={`/${account.assigneeId}/user-profile`}>{profile.firstName + " " + profile.lastName}</a>
          
        </div>
      );
    } else if (account.tag) {
      return <div className="label label--grey">{account.tag.name}</div>;
    }
    return <div className="label label--red">Unassigned</div>;
  }

  getFirstOption(account, options) {
    if (account.assigneeId) {
      for (option of options) {
        if (option.value === account.assigneeId) {
          return [option];
        }
      }
    }
    return [{ label: "Unassigned" }];
  }

  render() {
    const { account, openMetaData, closeRightPanel } = this.props;
    const options = this.getOptions(
      account && account.facility && account.facility.users
    );
    let userOptions = this.getFirstOption(account, options).concat(options);
    return (
      <div className="header-block header-account">
        <div className="main-info">
          <div className="left__side">
            <div className="name">{account.ptName}</div>
            <div className="row__block">
              <div className="pacient-id text-blue">{account.acctNum}</div>
              <div className="financial-class">O/D</div>
              <div className="location">
                {account.facility ? account.facility.name : "No insurance name"}{" "}
                -{" "}
                {account.client ? account.client.clientName : "No client name"}
              </div>
              <div className="label-group">
                <div className="label label--green">158 points(TBM)</div>
                <div className="label label--grey text-uppercase">
                  CARC(TNM)
                </div>
                {this.getAssignee()}
              </div>
            </div>
          </div>
          <div className="right__side">
            <div className="price-col">
              <div className="price">{account.collectedAmount}</div>
              <div className="text-light-grey">Collected amount</div>
            </div>
            <div className="price-col">
              <div className="price">
                {account.acctBal ? account.acctBal : 0}
              </div>
              <div className="text-light-grey">Remaining balance</div>
            </div>
          </div>
          <div className="btn-group">
            <AccountActioning
              type={"Assign"}
              title={"Assign account:"}
              model={account}
              accountId={account._id}
              options={userOptions}
              closeRightPanel={closeRightPanel}
            />
            {Roles.userIsInRole(Meteor.userId(), RolesEnum.REP) &&
              !account.escalationId && (
                <AccountActioning
                  escalate
                  accountId={account._id}
                  type="Escalate"
                  title="Escalate"
                  escalationId={account.escalationId}
                  closeRightPanel={closeRightPanel}
                />
              )}

            <AccountActioning
              metaData={true}
              type="View Meta Data"
              openMetaData={openMetaData}
              closeRightPanel={closeRightPanel}
              title=""
            />
            <AccountActioning
              tickle={true}
              type="Tickle"
              accountId={account._id}
              title="Confirm"
              closeRightPanel={closeRightPanel}
            />
          </div>
        </div>
        <div className="additional-info">
          <ul>
            <li className="text-center">
              <div className="text-light-grey">Substate</div>
              <div className="text-dark-grey text-uppercase">
                {account.substate}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Financial class</div>
              <div className="text-dark-grey text-uppercase">
                {account.finClass ? account.finClass : "None"}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Admit date</div>
              <div className="text-dark-grey">
                {account && moment(account.admitDate).format("MM/DD/YYYY")}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Discharge date</div>
              <div className="text-dark-grey">
                {account && moment(account.dischrgDate).format("MM/DD/YYYY")}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Placement date</div>
              <div className="text-dark-grey">
                {account && moment(account.createdAt).format("MM/DD/YYYY")}
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
