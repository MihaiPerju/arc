import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import RuleSearchBar from "./components/RuleSearchBar.jsx";
import RulesList from "./components/RulesList.jsx";
import RuleContent from "./RuleContent.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/rules/queries/listRules";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import RuleCreate from "./RuleCreate";
import Notifier from "/imports/client/lib/Notifier";
import PagerService from "../../lib/PagerService";
import Pager from "../../lib/Pager";

class RuleListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      rulesSelected: [],
      currentRule: null,
      filter: false,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {}
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
  }

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
    if (queryParams.name && queryParams.name == "") {
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

  showBtnGroup() {
    this.setState({
      btnGroup: !this.state.btnGroup
    });
  }

  showFilterBar() {
    this.setState({
      filter: !this.state.filter
    });
  }

  setRule = _id => {
    this.closeForm();
    const { currentRule } = this.state;

    if (currentRule === _id) {
      this.setState({ currentRule: null });
    } else {
      this.setState({ currentRule: _id, create: false });
    }
  };

  selectRule = _id => {
    const { rulesSelected } = this.state;
    if (rulesSelected.includes(_id)) {
      rulesSelected.splice(rulesSelected.indexOf(_id), 1);
    } else {
      rulesSelected.push(_id);
    }
    this.setState({ rulesSelected });
  };

  createForm = () => {
    this.setState({
      currentRule: false,
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
    const { rulesSelected } = this.state;

    Meteor.call("rules.delete", rulesSelected, err => {
      if (!err) {
        Notifier.success("Rules deleted !");
        this.setState({
          rulesSelected: []
        });
        this.closeRightPanel();
      }
    });
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentRule: null
    });
  };
  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentRule: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  render() {
    const { data, loading, error } = this.props;
    const { rulesSelected, currentRule, create, range, total } = this.state;
    const rule = objectFromArray(data, currentRule);

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
            currentRule || create ? "left__side" : "left__side full__width"
          }
        >
          <RuleSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={rulesSelected.length}
            deleteAction={this.deleteAction}
            hideSort
            hideFilter
          />
          <RulesList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            rulesSelected={rulesSelected}
            selectRule={this.selectRule}
            currentRule={currentRule}
            setRule={this.setRule}
            rules={data}
          />
          <PaginationBar
            module="Rule"
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentRule || create) && (
          <RightSide rule={rule} create={create} close={this.closeForm} />
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
    const { rule, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? <RuleCreate close={close} /> : <RuleContent rule={rule} />}
      </div>
    );
  }
}

export default withQuery(
  () => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, { page, perPage, filter: {} });
  },
  { reactive: true }
)(RuleListContainer);
