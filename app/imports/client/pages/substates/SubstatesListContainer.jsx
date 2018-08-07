import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar";
import SubstateSearchBar from "./components/SubstateSearchBar";
import SubstatesList from "./components/SubstatesList";
import SubstateEdit from "./SubstateEdit";
import SubstateCreate from "./SubstateCreate";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/substates/queries/listSubstates";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import PagerService from "/imports/client/lib/PagerService";
import Pager from "../../lib/Pager";
import moduleTagsQuery from "/imports/api/moduleTags/queries/listModuleTags";
import { moduleNames } from "/imports/client/pages/moduleTags/enums/moduleList";

class SubstatesListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      substateSelected: [],
      currentSubstate: null,
      filter: false,
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
    if (
      Object.keys(queryParams).length > 1 &&
      (queryParams.stateName && queryParams.stateName == "")
    ) {
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

  setSubstate = _id => {
    const { currentSubstate } = this.state;

    if (currentSubstate === _id) {
      this.setState({ currentSubstate: null });
    } else {
      this.setState({ currentSubstate: _id });
    }
  };

  selectSubstate = _id => {
    const { substateSelected } = this.state;
    if (substateSelected.includes(_id)) {
      substateSelected.splice(substateSelected.indexOf(_id), 1);
    } else {
      substateSelected.push(_id);
    }
    this.setState({ substateSelected });
  };

  createForm = () => {
    this.setState({
      create: true,
      rightSide: true,
      currentSubstate: false
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    this.updatePager();
  };

  deleteAction = () => {
    const { substateSelected } = this.state;

    Meteor.call("substate.deleteMany", substateSelected, err => {
      if (!err) {
        Notifier.success("Substates deleted !");
        this.setState({
          currentSubstate: null,
          substateSelected: []
        });
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentSubstate: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  getModuleTags = () => {
    moduleTagsQuery
      .clone({
        filters: { moduleNames: { $in: [moduleNames.SUBSTATES] } }
      })
      .fetch((err, moduleTags) => {
        if (!err) {
          this.setState({ moduleTags });
        }
      });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const {
      substateSelected,
      currentSubstate,
      create,
      filter,
      range,
      total,
      moduleTags
    } = this.state;
    const substate = objectFromArray(data, currentSubstate);
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    return (
      <div className="cc-container substates-container">
        <div
          className={
            currentSubstate || create ? "left__side" : "left__side full__width"
          }
        >
          <SubstateSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={substateSelected.length}
            deleteAction={this.deleteAction}
            moduleTags={moduleTags}
            hideSort
            hideFilter
            moduleTags={moduleTags}
          />
          <SubstatesList
            class={filter ? "task-list decreased" : "task-list"}
            substateSelected={substateSelected}
            selectSubstate={this.selectSubstate}
            currentSubstate={currentSubstate}
            setSubstate={this.setSubstate}
            substates={data}
            moduleTags={moduleTags}
          />
          <PaginationBar
            module="Substate"
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentSubstate || create) && (
          <RightSide
            substate={substate}
            create={create}
            close={this.closeForm}
            setSubstate={this.setSubstate}
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
    const { substate, create, close, setSubstate } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <SubstateCreate close={close} />
        ) : (
          <SubstateEdit model={substate} close={setSubstate} />
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
)(SubstatesListContainer);
