import React from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import RuleSearchBar from "./components/RuleSearchBar.jsx";
import RulesList from "./components/RulesList.jsx";
import Notifier from "/imports/client/lib/Notifier";
import ParamsService from "../../lib/ParamsService";
import Pager from "../../lib/Pager";
import RightSide from "./RuleRightSide";

export default class RuleListContainer extends Pager {
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
      range: {},
      rules: []
    });
    this.method = "rules.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);

    this.pollingMethod = setInterval(() => {
      this.listRules();
    }, 3000);
  }

  listRules = () => {
    const params = ParamsService.getRulesParams();
    Meteor.call("rules.get", params, (err, rules) => {
      if (!err) {
        this.setState({ rules });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentRule: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getRulesParams();
    this.recount(queryParams);
  };

  render() {
    const {
      rulesSelected,
      currentRule,
      create,
      range,
      total,
      rules
    } = this.state;

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
            rules={rules}
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
          <RightSide
            currentRule={currentRule}
            create={create}
            close={this.closeForm}
          />
        )}
      </div>
    );
  }
}
