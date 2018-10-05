import React, { Component } from 'react';
import moment from 'moment/moment';
import AccountActioning from './AccountActioning';
import RolesEnum, { roleGroups } from '/imports/api/users/enums/roles';
import EditInfoDialog from './EditInfoDialog';
import commaNumber from 'comma-number';
import Countdown from 'react-countdown-now';
import Dialog from '/imports/client/lib/ui/Dialog';

export default class AccountContentHeader extends Component {

state = {
    showRefreshTimePopup: false,
    lockTime: 60000,
    refreshTime: 40000,
    defaultLockTime: 60000,
    defaultRefreshTime: 40000
  };

  getOptions(users = []) {
    let options = [];
    for (let user of users) {
      let item = {
        label:
          user &&
          user.profile &&
          user.profile.firstName + ' ' +
          user.profile.lastName +
          '(' +
          user.roles[0] +
          ')',
        value: user && user._id,

      };
      options.push(item);
    }
    return options;
  }

  getAssignee() {
    const { account } = this.props;
    if (account && account.assignee) {
      const { profile } = account.assignee;
      const currentUserId = Meteor.userId();
      const isRep = Roles.userIsInRole(account.assigneeId, RolesEnum.REP);
      if (
        (isRep &&
          Roles.userIsInRole(currentUserId, roleGroups.ADMIN_TECH_MANAGER)) ||
        (isRep && currentUserId === account.assigneeId)
      ) {
        return (
          <div className="label label--grey">
            <a href={`/${account.assigneeId}/activity`}>
              {profile.firstName + " " + profile.lastName}
            </a>
          </div>
        );
      } else {
        return (
          <div className="label label--grey">
            {profile.firstName + " " + profile.lastName}
          </div>
        );
      }
    } else if (account && account.tag) {
      return <div className="label label--grey">{account.tag.name}</div>;
    }
    return <div className="label label--red">Unassigned</div>;
  }

  getFirstOption(account, options) {
    if (account && account.assigneeId) {
      for (let option of options) {
        if (option.value === account.assigneeId) {
          return [option];
        }
      }
    }

    return [{ label: 'Unassigned' }];
  }

   getOthersData = data => {
    if (typeof data === 'object') {
      return moment(data).format('MM/DD/YYYY');
    } else {
      return data;
    }
  };

  getValue = value => {
    if (value) {
      FlowRouter.setQueryParams({ medNo: value });
    }
  };


  restartTimer = () => {
    const { account } = this.props;
    Meteor.call('account.restartLockTimer', account._id, err => {
      if (err) {
        Notifier.error(err.reason);
      }
    });
  };

  resetTime = () => {
    this.setState({ lockTime: this.state.defaultLockTime, refreshTime: this.state.defaultRefreshTime });
    this.restartTimer();
  }

  onComplete = () => {
    const { removeLock, closeRightPanel } = this.props;
    if (this.state.showRefreshTimePopup) {
      this.setState({ showRefreshTimePopup: false });
    }

    removeLock();
    closeRightPanel();
  };


  hiddenTimerOnComplete = () => {
    this.setState({ showRefreshTimePopup: true });
  }

  closeDialog = () => {
    this.setState({ showRefreshTimePopup: false });
  }

  continueTimer = () => {
    let defaultLockTime = this.state.defaultLockTime;
    let defaultRefreshTime = this.state.defaultRefreshTime;
    let timeDifference = defaultLockTime - defaultRefreshTime;
    let lockTime = defaultLockTime + timeDifference;
    let refreshTime = defaultRefreshTime + timeDifference;
    this.setState({ showRefreshTimePopup: false, lockTime: lockTime, refreshTime: refreshTime });
    this.restartTimer();
  }

  render() {
    const { account, openMetaData, closeRightPanel } = this.props;
    const { lockTime, refreshTime, showRefreshTimePopup } = this.state;
    
    const options = this.getOptions(
      account && account.facility && account.facility.users
    );
    
    let userOptions = this.getFirstOption(account, options).concat(options);
    return (
      <div className="header-block header-account">
        {
          account.lockOwnerId === Meteor.userId() &&
          <a href="" onClick={this.resetTime}>
            Restart timer
          </a>
        }
        {
          account.lockTimestamp &&
          <div>

            <Countdown
              date={new Date(account.lockTimestamp).getTime() + lockTime} //1800000
              onComplete={this.onComplete}
            />
          </div>
        }
        {
          !showRefreshTimePopup &&
          <div style={{ display: 'none' }}>
            <Countdown
              date={new Date(account.lockTimestamp).getTime() + refreshTime}
              onComplete={this.hiddenTimerOnComplete}
            />
          </div>
        }
        <div className="main-info">
          <div className="left__side">
            <div className="name">
              <span className="truncate">
                {account && account.ptName}
                <EditInfoDialog
                  accountId={account._id}
                  editValue={account.ptName}
                  editField="ptName"
                />
              </span>
            </div>

            <div className="row__block">
              <div className="pacient-id text-blue">
                {account && account.acctNum}
              </div>
              <div className="financial-class">O/D</div>
              <div className="location">
                {account && account.facility
                  ? account.facility.name
                  : "No facility name"}{" "}
                -{" "}
                {account && account.client
                  ? account.client.clientName
                  : "No client name"}
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
              <div className="price">
                {account && commaNumber(account.collectedAmount)}
              </div>
              <div className="text-light-grey">Collected amount</div>
            </div>
            <div className="price-col account-balance">
              <EditInfoDialog
                accountId={account._id}
                editValue={account.acctBal}
                editField="acctBal"
              />
              <div className="price">
                {account && account.acctBal ? commaNumber(account.acctBal) : 0}
              </div>

              <div className="text-light-grey">Remaining balance</div>
            </div>
          </div>

          <div className="btn-group">
            <AccountActioning
              type={"Assign"}
              title={"Assign account:"}
              model={account}
              accountId={account && account._id}
              options={userOptions}
              closeRightPanel={closeRightPanel}
            />
            {account &&
              Roles.userIsInRole(Meteor.userId(), RolesEnum.REP) &&
              !account.escalationId &&
              <AccountActioning
                escalate
                accountId={account && account._id}
                type="Escalate"
                title="Escalate"
                escalationId={account && account.escalationId}
                closeRightPanel={closeRightPanel}
              />}

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
              accountId={account && account._id}
              title="Confirm"
              closeRightPanel={closeRightPanel}
            />
          </div>
        </div>
        <div className="additional-info account-info">
          <ul>
            <li className="text-center">
              <div className="text-light-grey">Substate</div>
              <div className="text-dark-grey text-uppercase">
                {account && account.substate}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Financial class</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.finClass}
                editField="finClass"
              />

              <div className="text-dark-grey text-uppercase">
                {account && account.finClass ? account.finClass : "None"}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Discharge date</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.dischrgDate}
                editField="dischrgDate"
              />
              <div className="text-dark-grey">
                {account && account.dischrgDate? moment(account.dischrgDate).format('MM/DD/YYYY')
                  : 'None'}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Placement date</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.createdAt}
                editField="createdAt"
              />

              <div className="text-dark-grey">
                {account && account.createdAt? moment(account.createdAt).format('MM/DD/YYYY')
                  : 'None'}
              </div>
            </li>
          </ul>
        </div>
        <div className="additional-info account-info">
          <ul>
            <li className="text-center">
              <div className="text-light-grey">Admit date</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.admitDate}
                editField="admitDate"
              />

              <div className="text-dark-grey">
                {account && account.admitDate? moment(account.admitDate).format('MM/DD/YYYY')
                  : 'None'}
             </div>
            </li>

            <li className="text-center">
              <div className="text-light-grey">Facility Code</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.facCode}
                editField="facCode"
              />

              <div className="text-dark-grey text-uppercase">
                {account && account.facCode}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Patient Type</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.ptType}
                editField="ptType"
              />

              <div className="text-dark-grey text-uppercase">
                {account && account.ptType}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Last Bill Date</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.fbDate}
                editField="fbDate"
              />
              <div className="text-dark-grey">
                {account && account.fbDate? moment(account.fbDate).format('MM/DD/YYYY')
                  : 'None'} </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Medical Number</div>
              <div className="text-dark-grey">
                <a href="" onClick={this.getValue.bind(this, account.medNo)}>
                  {account && account.medNo}
                </a>
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Other 1</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.other1}
                editField="other1"
              />
              <div className="text-dark-grey">
                {account && this.getOthersData(account.other1)}
              </div>
            </li>
            <li className="text-center">
              <div className="text-light-grey">Other 2</div>
              <EditInfoDialog
                accountId={account._id}
                editValue={account.other2}
                editField="other2"
              />
              <div className="text-dark-grey">
                {account && this.getOthersData(account.other2)}
              </div>
            </li>
          </ul>
        </div>
        {
          this.state.showRefreshTimePopup ?
            <Dialog
              title="Confirm"
              className="account-dialog"
              closePortal={this.closeDialog}
            >
              <div className="form-wrapper">
                Do you want to continue this account?
            </div>
              <div className="btn-group">
                <button className="btn-cancel" onClick={this.closeDialog}>
                  Cancel
              </button>
                <button className="btn--light-blue" onClick={this.continueTimer}>
                  Continue
              </button>
              </div>
            </Dialog> : null
        }
      </div>
    );
  }
}
