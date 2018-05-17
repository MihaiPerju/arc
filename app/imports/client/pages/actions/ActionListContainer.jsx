import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import FilterBar from "/imports/client/lib/FilterBar.jsx";
import ActionSearchBar from "./components/ActionSearchBar.jsx";
import ActionList from "./components/ActionList.jsx";
import ActionContent from "./ActionContent.jsx";
import ActionCreate from "./ActionCreate.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/actions/queries/actionList";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";
import substateQuery from "/imports/api/substates/queries/listSubstates";

class ActionListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      actionsSelected: [],
      currentAction: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      substates: []
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
    substateQuery.clone().fetch((err, substates) => {
      if (!err) {
        this.setState({ substates });
      }
    });
  }

  setAction = _id => {
    const { currentAction } = this.state;

    if (currentAction === _id) {
      this.setState({ currentAction: null });
    } else {
      this.setState({ currentAction: _id, create: false });
    }
  };

  selectAction = _id => {
    const { actionsSelected } = this.state;
    if (actionsSelected.includes(_id)) {
      actionsSelected.splice(actionsSelected.indexOf(_id), 1);
    } else {
      actionsSelected.push(_id);
    }
    this.setState({ actionsSelected });
  };

  createForm = () => {
    this.setState({
      currentAction: false,
      create: true,
      rightSide: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
  };

  deleteAction = () => {
    const { actionsSelected } = this.state;

    Meteor.call("action.deleteMany", actionsSelected, err => {
      if (!err) {
        Notifier.success("Actions deleted !");
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

  render() {
    const { data, loading, error } = this.props;
    const {
      actionsSelected,
      currentAction,
      create,
      total,
      range,
      substates
    } = this.state;
    const action = objectFromArray(data, currentAction);

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
            currentAction || create ? "left__side" : "left__side full__width"
          }
        >
          <ActionSearchBar
            btnGroup={actionsSelected.length}
            deleteAction={this.deleteAction}
          />
          <ActionList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            actionsSelected={actionsSelected}
            selectAction={this.selectAction}
            currentAction={currentAction}
            setAction={this.setAction}
            actions={data}
          />
          <PaginationBar
            module="Action"
            create={this.createForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentAction || create) && (
          <RightSide
            action={action}
            create={create}
            close={this.closeForm}
            substates={substates}
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
    const { action, create, close, substates } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <ActionCreate substates={substates} close={close} />
        ) : (
          <ActionContent substates={substates} action={action} />
        )}
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
)(ActionListContainer);
