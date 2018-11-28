import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar";
import SubstateSearchBar from "./components/SubstateSearchBar";
import SubstatesList from "./components/SubstatesList";
import SubstateEdit from "./SubstateEdit";
import SubstateCreate from "./SubstateCreate";
import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import ParamsService from "/imports/client/lib/ParamsService";
import Pager from "../../lib/Pager";
import TagsListQuery from "/imports/api/tags/queries/listTags";
import { moduleNames } from "/imports/api/tags/enums/tags";

export default class SubstatesListContainer extends Pager {
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
      tags: [],
      substates: []
    });
    this.method = "substates.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getTags();

    this.pollingMethod = setInterval(() => {
      this.listSubstates();
    }, 3000);
  }

  listSubstates = () => {
    const params = ParamsService.getSubstatesParams();
    Meteor.call("substates.get", params, (err, substates) => {
      if (!err) {
        this.setState({ substates });
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentSubstate: null });

    this.listSubstates();
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getSubstatesParams();
    this.recount(queryParams);
  };

  getTags = () => {
    TagsListQuery.clone({
      filters: { entities: { $in: [moduleNames.SUBSTATES] } }
    }).fetch((err, tags) => {
      if (!err) {
        this.setState({ tags });
      }
    });
  };

  render() {
    const {
      substateSelected,
      currentSubstate,
      create,
      filter,
      range,
      total,
      tags,
      substates
    } = this.state;
    const substate = objectFromArray(substates, currentSubstate);

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
            tags={tags}
            hideSort
            hideFilter
          />
          <SubstatesList
            class={filter ? "task-list decreased" : "task-list"}
            substateSelected={substateSelected}
            selectSubstate={this.selectSubstate}
            currentSubstate={currentSubstate}
            setSubstate={this.setSubstate}
            substates={substates}
            tags={tags}
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
