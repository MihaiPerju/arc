import React from "react";
import AccountList from "./components/AccountList.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import Pager from "/imports/client/lib/Pager.jsx";
import ParamsService from "/imports/client/lib/ParamsService";
import AccountAssigning from "/imports/client/pages/accounts/components/AccountContent/AccountAssigning.jsx";
import AccountSearchBar from "./components/AccountSearchBar";
import userTagsQuery from "/imports/api/users/queries/userTags.js";
import Notifier from "/imports/client/lib/Notifier";
import MetaDataSlider from "/imports/client/pages/accounts/components/AccountContent/MetaData";
import TagsListQuery from "/imports/api/tags/queries/listTags";
import { moduleNames } from "/imports/api/tags/enums/tags";
import Dialog from "/imports/client/lib/ui/Dialog";
import RightSide from "./components/AccountRightSide";

export default class AccountListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      accounts: [],
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
      isLockedDialogActive: false,
      lockOwnerName: null,
      lockedAccountId: null,
      bulkAssign: false,
      facilitiesOption: false,
      sortOption: false,
      assignActions: false
    });
    this.method = "accounts.count";
    this.handleBrowserClose = this.handleBrowserClose.bind(this);
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.pollingMethod = setInterval(() => {
      this.listAccounts();
    }, 3000);

    this.nextPage(0);
    userTagsQuery
      .clone({
        filters: {
          _id: Meteor.userId()
        }
      })
      .fetchOne((err, user) => {
        if (!err) {
          const tags = user.tags || [];
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
          let assignFilterArr = ["assigneeId", "workQueueId"];
          let dropdownOptions = [
            { label: "Personal Accounts", filter: "assigneeId" },
            { label: "Work Queue Accounts", filter: "workQueueId" }
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
    this.getTags();
  }

  listAccounts = () => {
    const params = ParamsService.getAccountParams();
    Meteor.call("accounts.get", params, (err, accounts) => {
      if (!err) {
        this.setState({ accounts });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentDidMount() {
    window.addEventListener("beforeunload", this.handleBrowserClose);
  }

  handleBrowserClose(e) {
    this.removeLock();
    this.closeRightPanel();
    e.returnValue = "Are you sure you want to close?";
  }

  getFacilityByAccount = () => {
    const queryParams = ParamsService.getParams().filters;
    //get facility based on account number
    Meteor.call("account.facility", queryParams, (err, facilitiesOption) => {
      if (!err) {
        this.setState({
          assignUser: true,
          facilitiesOption
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps(newProps) {
    const { currentRouteState } = this.state;
    const { state } = newProps;
    if (currentRouteState !== state) {
      this.closeRightPanel();
      this.setState({
        currentRouteState: state,
        accountsSelected: [],
        sortOption: false
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
    window.removeEventListener("beforeunload", this.handleBrowserClose);
    // remove any locked account
    this.removeLock();

    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  uncheckAccountList = () => {
    this.setState({
      accountsSelected: [],
      bulkAssign: false
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
        this.closeRightPanel();
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

  checkAllAccount = selectAll => {
    this.setState({
      bulkAssign: selectAll,
      accountsSelected: [],
      currentAccount: null,
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
    const queryParams = ParamsService.getAccountParams();
    this.recount(queryParams);
  };

  assignToUser = () => {
    //check bulk assign
    if (this.state.bulkAssign) {
      this.getFacilityByAccount();
    } else {
      //if not bulk assign
      const accounts = this.getAccounts(this.state.accountsSelected);
      const options = this.getUserOptions(accounts);
      let userOptions = this.getFirstOption(accounts, options).concat(options);
      this.setState({
        assignUser: true,
        userOptions
      });
    }
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

  assignAction = () => {
    this.setState({
      assignActions: true
    });
  };

  closeAssignAction = () => {
    this.setState({
      assignActions: false
    });
  };

  closeAssignWQ = () => {
    this.setState({
      assignWQ: false
    });
    this.closeRightPanel();
  };

  getAccounts(accountsSelected) {
    let { accounts } = this.state;
    let result = [];
    for (let account of accounts) {
      if (accountsSelected.includes(account._id)) result.push(account);
    }
    return result;
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
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
    this.setState({ currentAccount: null, showMetaData: false });
  };

  getTags = () => {
    TagsListQuery.clone({
      filters: { entities: { $in: [moduleNames.ACCOUNT] } }
    }).fetch((err, tags) => {
      if (!err) {
        this.setState({ tags });
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
      const lockOwnerName =
        lockOwner &&
        lockOwner.profile &&
        `${lockOwner.profile.firstName} ${lockOwner.profile.lastName}`;
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

  getSort = () => {
    this.setState({ sortOption: !this.state.sortOption });
  };

  render() {
    const {
      accounts,
      accountsSelected,
      currentAccount,
      range,
      total,
      assignUser,
      assignWQ,
      showMetaData,
      assignFilterArr,
      dropdownOptions,
      tags,
      isLockedDialogActive,
      lockOwnerName,
      bulkAssign,
      facilitiesOption,
      sortOption,
      currentRouteState,
      assignActions
    } = this.state;
    const options = this.getData(accounts);
    const icons = [
      { icon: "user", method: this.assignToUser },
      { icon: "users", method: this.assignToWorkQueue },
      { icon: "thumb-tack", method: this.assignAction }
    ];

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
            btnGroup={accountsSelected.length || bulkAssign}
            assignFilterArr={assignFilterArr}
            checkAll={this.checkAllAccount}
            accountsSelected={accountsSelected}
            data={accounts}
            tags={tags}
            bulkAssign={bulkAssign}
            getSort={this.getSort}
            sortOption={sortOption}
            key={currentRouteState}
          />
          {assignUser && (
            <AccountAssigning
              assignToUser={true}
              assignToWorkQueue={false}
              assignAction={false}
              accountIds={accountsSelected}
              closeDialog={this.closeAssignUser}
              title={""}
              options={this.state.userOptions}
              uncheckAccountList={this.uncheckAccountList}
              bulkAssign={bulkAssign}
              facilitiesOption={facilitiesOption}
            />
          )}
          {assignWQ && (
            <AccountAssigning
              assignToUser={false}
              assignToWorkQueue={true}
              assignAction={false}
              accountIds={accountsSelected}
              closeDialog={this.closeAssignWQ}
              title={""}
              uncheckAccountList={this.uncheckAccountList}
              bulkAssign={bulkAssign}
              facilitiesOption={false}
            />
          )}
          {assignActions && (
            <AccountAssigning
              assignToUser={false}
              assignToWorkQueue={false}
              assignAction={true}
              accountIds={accountsSelected}
              closeDialog={this.closeAssignAction}
              title={""}
              uncheckAccountList={this.uncheckAccountList}
              bulkAssign={bulkAssign}
              facilitiesOption={false}
            />
          )}

          <AccountList
            classes={"task-list accounts"}
            accountsSelected={accountsSelected}
            selectAccount={this.selectAccount}
            checkAccount={this.checkAccount}
            currentAccount={currentAccount}
            data={accounts}
            tags={tags}
            bulkAssign={bulkAssign}
          />
          <PaginationBar
            nextPage={this.nextPage}
            range={range}
            total={total}
            buttonHidden={true}
          />
        </div>
        {(currentAccount || accountsSelected.length) && !showMetaData && (
          <RightSide
            openMetaData={this.openMetaDataSlider}
            currentAccount={currentAccount}
            accountsSelected={[...accountsSelected]}
            closeRightPanel={this.closeRightPanel}
            removeLock={this.removeLock}
          />
        )}
        {showMetaData && (
          <MetaDataSlider
            accountId={currentAccount}
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
