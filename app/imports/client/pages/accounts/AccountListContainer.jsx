import React, { Component } from "react";
import AccountList from "./components/AccountList.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import AccountContent from "./AccountContent.jsx";
import Pager from "/imports/client/lib/Pager.jsx";
import query from "/imports/api/accounts/queries/accountList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import Loading from "/imports/client/lib/ui/Loading";
import PagerService from "/imports/client/lib/PagerService";
import AccountAssigning from "/imports/client/pages/accounts/components/AccountContent/AccountAssigning.jsx";
import AccountSearchBar from "./components/AccountSearchBar";
import userTagsQuery from "/imports/api/users/queries/userTags.js";
import Notifier from "/imports/client/lib/Notifier";
import MetaDataSlider from "/imports/client/pages/accounts/components/AccountContent/MetaData";
import moduleTagsQuery from "/imports/api/moduleTags/queries/listModuleTags";
import { moduleNames } from "/imports/client/pages/moduleTags/enums/moduleList";
import Dialog from "/imports/client/lib/ui/Dialog";

class AccountListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      accountsSelected: [],
      currentAccount: null,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      assignUser: false,
      assignWQ: false,
      showMetaData: false,
      assignFilterArr: ["assigneeId"],
      tags: [],
      dropdownOptions: [],
      currentRouteState: null,
      moduleTags: [],
      isLockedDialogActive: false,
      lockOwnerName: null,
      lockedAccountId: null
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
    userTagsQuery
      .clone({
        filters: {
          _id: Meteor.userId()
        }
      })
      .fetchOne((err, user) => {
        if (!err) {
          const tags = user.tags;
          let assignFilterArr = ["assigneeId"];
          let dropdownOptions = [
            { label: "Personal Accounts", filter: "assigneeId" }
          ];

          _.each(tags, tag => {
            assignFilterArr.push(tag._id);
            dropdownOptions.push({ label: tag.name, filter: tag._id });
          });
          this.setState({ tags, assignFilterArr, dropdownOptions });
        } else {
          let assignFilterArr = ["assigneeId", "workQueue"];
          let dropdownOptions = [
            { label: "Personal Accounts", filter: "assigneeId" },
            { label: "Work Queue Accounts", filter: "workQueue" }
          ];
          this.setState({ assignFilterArr, dropdownOptions });
        }
      });

    const accountId = FlowRouter.getQueryParam("accountId");
    if (accountId) {
      this.setState({
        currentAccount: accountId
      });
    }

    const { state } = this.props;
    this.setState({ currentRouteState: state });
    this.getModuleTags();
  }

  componentWillReceiveProps(newProps) {
    const { currentRouteState } = this.state;
    const { state } = newProps;
    if (currentRouteState !== state) {
      this.closeRightPanel();
      this.setState({
        currentRouteState: state
      });
      this.setPagerInitial();

      // remove any locked account
      this.removeLock();
    }
    this.updatePager();

    const accountId = FlowRouter.getQueryParam("accountId");
    if (accountId) {
      this.setState({
        currentAccount: accountId
      });
    }
  }

  componentWillUnmount() {
    // remove any locked account
    this.removeLock();
  }

  uncheckAccountList = () => {
    this.setState({
      accountsSelected: []
    });
  };

  setPagerInitial = () => {
    this.setState(
      {
        page: 1,
        perPage: 13,
        total: 0
      },
      () => {
        this.nextPage(0);
      }
    );
  };

  getData(accounts) {
    let facilities = [];
    let assignees = [];
    if (accounts) {
      for (let account of accounts) {
        const { facility } = account;
        if (facility) {
          let users = [];
          if (facility) {
            users = facility.users;
          }
          //get facility options
          let item = {
            key: facility._id,
            value: facility._id,
            label: facility.name
          };
          if (!_.findWhere(facilities, item)) {
            facilities.push(item);
          }

          if (users) {
            for (let user of users) {
              const { profile } = user;

              let item = {
                key: user._id,
                label: profile.firstName + " " + profile.lastName,
                value: user._id
              };
              //get assignee options
              if (!_.findWhere(assignees, item)) {
                assignees.push(item);
              }
            }
          }
        }
      }
    }
    return { facilities, assignees };
  }

  selectAccount = newAccount => {
    const { currentAccount } = this.state;
    this.removeLock();
    // removing accountId from the query when navigating from notification
    FlowRouter.setQueryParams({ accountId: null });
    if (this.checkAccountIsLocked(newAccount)) {
      if (currentAccount === newAccount._id) {
        this.setState({
          currentAccount: null,
          showMetaData: false
        });
      } else {
        this.setState({
          currentAccount: newAccount._id,
          showMetaData: false
        });
        const { state } = FlowRouter.current().params;
        if (state === "active") {
          this.incrementViewCount(newAccount._id);
        }
        this.addLock(newAccount._id);
      }
    }
  };

  incrementViewCount = _id => {
    Meteor.call("accounts.increment_view_count", _id, err => {
      if (err) {
        Notifier.error(err.reason);
      }
    });
  };

  checkAccount = account => {
    const { accountsSelected } = this.state;
    if (accountsSelected.includes(account._id)) {
      accountsSelected.splice(accountsSelected.indexOf(account._id), 1);
    } else {
      accountsSelected.push(account._id);
    }
    this.setState({
      accountsSelected,
      showMetaData: false
    });
  };

  changeFilters(filters) {
    this.updateFilters({ filters });
  }

  getFirstOption(accounts, options) {
    for (let account of accounts) {
      if (!account.assigneeId) {
        return [{ label: "Unassigned" }];
      }
    }
    return [options[0]];
  }
  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  assignToUser = () => {
    const accounts = this.getAccounts(this.state.accountsSelected);
    const options = this.getUserOptions(accounts);
    let userOptions = this.getFirstOption(accounts, options).concat(options);
    this.setState({
      assignUser: true,
      userOptions
    });
  };
  closeAssignUser = () => {
    this.setState({
      assignUser: false
    });
    this.closeRightPanel();
  };

  assignToWorkQueue = () => {
    this.setState({
      assignWQ: true
    });
  };

  closeAssignWQ = () => {
    this.setState({
      assignWQ: false
    });
    this.closeRightPanel();
  };

  getAccount(currentAccount) {
    const { data } = this.props;
    const [account] = data.filter(account => account._id === currentAccount);
    return account || null;
  }

  getAccounts(accountsSelected) {
    const { data } = this.props;
    let accounts = [];
    for (let account of data) {
      if (accountsSelected.includes(account._id)) accounts.push(account);
    }
    return accounts;
  }

  getUserOptions(accounts) {
    let userOptions = [];
    for (let account of accounts) {
      if (account.facility) {
        for (let user of account.facility.users) {
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
          if (!userOptions.includes(item)) {
            userOptions.push(item);
          }
        }
      }
    }
    const uniqueOptions = _.unique(userOptions, false, function(item) {
      return item.value;
    });
    return uniqueOptions;
  }

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentAccount: null });
  };

  getProperAccounts = assign => {
    let { tags, assignFilterArr } = this.state;

    if (_.contains(assignFilterArr, assign)) {
      assignFilterArr.splice(assignFilterArr.indexOf(assign), 1);
    } else {
      assignFilterArr.push(assign);
    }
    this.setState({ assignFilterArr });
    if (tags.length !== 0) {
      if (assignFilterArr.length === tags.length + 1) {
        FlowRouter.setQueryParams({ assign: null });
      } else if (assignFilterArr.length === 0) {
        FlowRouter.setQueryParams({ assign: "none" });
      } else {
        FlowRouter.setQueryParams({ assign: assignFilterArr.toString() });
      }
    } else {
      if (assignFilterArr.length === tags.length + 2) {
        FlowRouter.setQueryParams({ assign: null });
      } else if (assignFilterArr.length === 0) {
        FlowRouter.setQueryParams({ assign: "none" });
      } else {
        FlowRouter.setQueryParams({ assign: assignFilterArr.toString() });
      }
    }
  };

  openMetaDataSlider = () => {
    this.setState({
      showMetaData: true
    });
  };

  closeMetaDataSlider = () => {
    this.setState({
      showMetaData: false
    });
  };

  closeRightPanel = () => {
    this.setState({
      currentAccount: null,
      showMetaData: false
    });
  };

  getModuleTags = () => {
    moduleTagsQuery
      .clone({
        filters: { moduleNames: { $in: [moduleNames.ACCOUNT] } }
      })
      .fetch((err, moduleTags) => {
        if (!err) {
          this.setState({ moduleTags });
        }
      });
  };

  addLock = _id => {
    Meteor.call("account.addLock", _id, err => {
      if (err) {
        Notifier.error(err.reason);
      }
    });
  };

  removeLock = () => {
    Meteor.call("account.removeLock", err => {
      if (err) {
        Notifier.error(err.reason);
      }
    });
  };

  checkAccountIsLocked = account => {
    // account is locked
    const { lockOwnerId, lockOwner, _id, lockBreakUsers } = account;

    if (
      lockOwnerId &&
      Meteor.userId() !== lockOwnerId &&
      lockBreakUsers.indexOf(Meteor.userId()) === -1
    ) {
      const lockOwnerName = `${lockOwner.profile.firstName} ${
        lockOwner.profile.lastName
      }`;
      this.setState({
        isLockedDialogActive: true,
        lockOwnerName,
        lockedAccountId: _id
      });
      return false;
    }
    return true;
  };

  closeDialog = () => {
    this.setState({
      isLockedDialogActive: false,
      lockOwnerName: null,
      lockedAccountId: null
    });
  };

  breakLock = () => {
    const { lockedAccountId } = this.state;
    Meteor.call("account.breakLock", lockedAccountId, err => {
      if (err) {
        Notifier.error(err.reason);
      } else {
        this.setState({ currentAccount: lockedAccountId });
        this.closeDialog();
      }
    });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const {
      accountsSelected,
      currentAccount,
      range,
      total,
      filter,
      assignUser,
      assignWQ,
      showMetaData,
      assignFilterArr,
      dropdownOptions,
      moduleTags,
      isLockedDialogActive,
      lockOwnerName
    } = this.state;
    const options = this.getData(data);
    const account = this.getAccount(currentAccount);
    const icons = [
      { icon: "user", method: this.assignToUser },
      { icon: "users", method: this.assignToWorkQueue }
    ];

    if (isLoading && !FlowRouter.getQueryParam("acctNum")) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    return (
      <div className="cc-container">
        <div
          className={
            currentAccount || accountsSelected.length
              ? "left__side"
              : "left__side full__width"
          }
        >
          <AccountSearchBar
            setPagerInitial={this.setPagerInitial}
            options={options}
            icons={icons}
            getProperAccounts={this.getProperAccounts}
            changeFilters={this.changeFilters}
            dropdownOptions={dropdownOptions}
            btnGroup={accountsSelected.length}
            assignFilterArr={assignFilterArr}
            moduleTags={moduleTags}
          />
          {assignUser && (
            <AccountAssigning
              assignToUser={true}
              accountIds={accountsSelected}
              closeDialog={this.closeAssignUser}
              title={""}
              options={this.state.userOptions}
              uncheckAccountList={this.uncheckAccountList}
            />
          )}
          {assignWQ && (
            <AccountAssigning
              assignToUser={false}
              accountIds={accountsSelected}
              closeDialog={this.closeAssignWQ}
              title={""}
              uncheckAccountList={this.uncheckAccountList}
            />
          )}
          <AccountList
            classes={"task-list accounts"}
            accountsSelected={accountsSelected}
            selectAccount={this.selectAccount}
            checkAccount={this.checkAccount}
            currentAccount={currentAccount}
            data={data}
            moduleTags={moduleTags}
          />
          <PaginationBar
            nextPage={this.nextPage}
            range={range}
            total={total}
            buttonHidden={true}
          />
        </div>
        {(currentAccount || accountsSelected.length) &&
          !showMetaData && (
            <RightSide
              account={account}
              openMetaData={this.openMetaDataSlider}
              accountsSelected={accountsSelected}
              closeRightPanel={this.closeRightPanel}
              removeLock={this.removeLock}
            />
          )}
        {showMetaData && (
          <MetaDataSlider
            account={account}
            closeMetaData={this.closeMetaDataSlider}
          />
        )}
        {isLockedDialogActive && (
          <Dialog
            title="Confirm"
            className="account-dialog"
            closePortal={this.closeDialog}
          >
            <div className="form-wrapper">
              Currently the account is locked by the <b>{lockOwnerName}</b>. Do
              you want to break the lock?
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button className="btn--light-blue" onClick={this.breakLock}>
                Confirm & break
              </button>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}

class RightSide extends Component {
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
      account,
      openMetaData,
      closeRightPanel,
      accountsSelected,
      removeLock
    } = this.props;
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
  props => {
    const params = PagerService.getAccountQueryParams();
    return PagerService.setQuery(query, params);
  },
  { reactive: true }
)(AccountListContainer);
