import React from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import UserSearchBar from "./components/UserSearchBar.jsx";
import UserList from "./components/UserList.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import ParamsService from "../../lib/ParamsService";
import RightSide from "./components/UserRightSide";

export default class UserListContainer extends Pager {
  constructor() {
    super();

    _.extend(this.state, {
      usersSelected: [],
      currentUser: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      tags: [],
      users: []
    });
    this.method = "users.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);

    this.pollingMethod = setInterval(() => {
      this.listUsers();
    }, 3000);
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  listUsers = () => {
    const params = ParamsService.getUserParams();
    Meteor.call("users.get", params, (err, users) => {
      if (!err) {
        this.setState({ users });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
    if (queryParams.email && queryParams.email == "") {
      this.setPagerInitial();
    }
    this.updatePager();
  }

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

  selectUser(objectId) {
    const { usersSelected } = this.state;
    if (usersSelected.includes(objectId)) {
      usersSelected.splice(usersSelected.indexOf(objectId), 1);
    } else {
      usersSelected.push(objectId);
    }
    this.setState({ usersSelected });
  }

  setUser(id) {
    const { currentUser } = this.state;
    if (currentUser === id) {
      this.setState({ currentUser: null });
    } else {
      this.setState({ currentUser: id });
    }
  }

  createForm = () => {
    this.setState({
      currentUser: false,
      rightSide: true,
      create: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    this.updatePager();
  };

  deleteAction = () => {
    const { usersSelected } = this.state;

    Meteor.call("admin.deleteManyUsers", usersSelected, err => {
      if (!err) {
        Notifier.success("Users deleted!");
        this.setState({
          usersSelected: []
        });
        this.closeRightPanel();
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });

    this.listUsers();
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentUser: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getUserParams();
    this.recount(queryParams);
  };

  render() {
    const {
      usersSelected,
      currentUser,
      create,
      total,
      range,
      users
    } = this.state;

    return (
      <div className="cc-container">
        <div
          className={
            currentUser || create ? "left__side" : "left__side full__width"
          }
        >
          <UserSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={usersSelected.length}
            deleteAction={this.deleteAction}
            hideSort
            hideFilter
          />
          <UserList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            selectUser={this.selectUser.bind(this)}
            setUser={this.setUser.bind(this)}
            showBtnGroup={this.showBtnGroup}
            usersSelected={usersSelected}
            currentUser={currentUser}
            users={users}
          />
          <PaginationBar
            closeForm={this.closeForm}
            create={this.createForm}
            nextPage={this.nextPage}
            module="User"
            range={range}
            total={total}
          />
        </div>
        {(currentUser || create) && (
          <RightSide
            close={this.closeForm}
            create={create}
            currentUser={currentUser}
          />
        )}
      </div>
    );
  }
}
