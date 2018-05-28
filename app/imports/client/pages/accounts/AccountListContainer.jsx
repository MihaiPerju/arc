import React, { Component } from "react";
import AccountList from "./components/AccountList.jsx";
import SearchBar from "/imports/client/lib/SearchBar.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import AccountContent from "./AccountContent.jsx";
import Pager from "/imports/client/lib/Pager.jsx";
import { createQueryContainer } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/accounts/queries/accountList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import Loading from "/imports/client/lib/ui/Loading";
import PagerService from "/imports/client/lib/PagerService";
import AccountAssigning from "/imports/client/pages/accounts/components/AccountContent/AccountAssigning.jsx";
import AccountSearchBar from "./components/AccountSearchBar";
import userTagsQuery from "/imports/api/users/queries/userTags.js";
import Notifier from "/imports/client/lib/Notifier";
import MetaDataSlider from "/imports/client/pages/accounts/components/AccountContent/MetaData";

class AccountListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      dialogIsActive: false,
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
      currentRouteState: null
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
    const { state } = this.props;
    this.setState({ currentRouteState: state });
  }

  componentWillReceiveProps(newProps) {
    const { currentRouteState } = this.state;
    const { state } = newProps;
    if (currentRouteState !== state) {
      this.closeRightPanel();
      this.setState({ currentRouteState: state });
    }
    this.updateFilters();
  }

  uncheckAccountList = () => {
    this.setState({
      accountsSelected: []
    });
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

  decreaseList = () => {
    this.setState({
      filter: !this.state.filter
    });
  };

  getFirstOption(accounts, options) {
    for (let account of accounts) {
      if (!account.assigneeId) {
        return [{ label: "Unassigned" }];
      }
    }
    return [options[0]];
  }

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
    for (account of data) {
      if (account._id == currentAccount) return account;
    }
    return null;
  }

  getAccounts(accountsSelected) {
    const { data } = this.props;
    let accounts = [];
    for (account of data) {
      if (accountsSelected.includes(account._id)) accounts.push(account);
    }
    return accounts;
  }

  getUserOptions(accounts) {
    let userOptions = [];
    for (account of accounts) {
      for (user of account.facility.users) {
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

  render() {
    const { data, loading, error } = this.props;
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
      dropdownOptions
    } = this.state;
    const options = this.getData(data);
    const account = this.getAccount(currentAccount);
    const icons = [
      { icon: "user", method: this.assignToUser },
      { icon: "users", method: this.assignToWorkQueue }
    ];

    if (loading) {
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
            options={options}
            icons={icons}
            getProperAccounts={this.getProperAccounts}
            changeFilters={this.changeFilters}
            decrease={this.decreaseList}
            dropdownOptions={dropdownOptions}
            btnGroup={accountsSelected.length}
            assignFilterArr={assignFilterArr}
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
            classes={filter ? "task-list decreased" : "task-list"}
            accountsSelected={accountsSelected}
            selectAccount={this.selectAccount}
            checkAccount={this.checkAccount}
            currentAccount={currentAccount}
            data={data}
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
            />
          )}
        {showMetaData && (
          <MetaDataSlider
            account={account}
            closeMetaData={this.closeMetaDataSlider}
          />
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
      accountsSelected
    } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <AccountContent
          account={account}
          openMetaData={openMetaData}
          accountsSelected={accountsSelected}
          closeRightPanel={closeRightPanel}
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
