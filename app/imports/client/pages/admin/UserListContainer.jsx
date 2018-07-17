import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import UserSearchBar from "./components/UserSearchBar.jsx";
import UserList from "./components/UserList.jsx";
import UserContent from "./UserContent.jsx";
import CreateUser from "./CreateUser.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/users/queries/listUsers";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";
import moduleTagsQuery from "/imports/api/moduleTags/queries/listModuleTags";
import { moduleNames } from "/imports/client/pages/moduleTags/enums/moduleList";

class UserListContainer extends Pager {
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
      moduleTags: []
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getModuleTags();
  }

  componentWillReceiveProps(newProps) {
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
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentUser: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  getModuleTags = () => {
    moduleTagsQuery
      .clone({
        filters: { moduleNames: { $in: [moduleNames.USERS] } }
      })
      .fetch((err, moduleTags) => {
        if (!err) {
          this.setState({ moduleTags });
        }
      });
  };

  render() {
    const { data, loading, error } = this.props;
    const {
      usersSelected,
      currentUser,
      create,
      total,
      range,
      moduleTags
    } = this.state;
    const user = objectFromArray(data, currentUser);

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }

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
            moduleTags={moduleTags}
          />
          <UserList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            selectUser={this.selectUser.bind(this)}
            setUser={this.setUser.bind(this)}
            showBtnGroup={this.showBtnGroup}
            usersSelected={usersSelected}
            currentUser={currentUser}
            users={data}
            moduleTags={moduleTags}
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
          <RightSide close={this.closeForm} create={create} user={user} />
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
    const { user, create, close } = this.props;
    const { fade } = this.state;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? <CreateUser close={close} /> : <UserContent user={user} />}
      </div>
    );
  }
}

export default withQuery(
  props => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, { page, perPage, filters: {} });
  },
  { reactive: true }
)(UserListContainer);
