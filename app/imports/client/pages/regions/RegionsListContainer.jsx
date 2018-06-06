import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import RegionSearchBar from "./components/RegionSearchBar.jsx";
import RegionsList from "./components/RegionsList.jsx";
import RegionContent from "./RegionContent.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/regions/queries/regionList";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import RegionCreate from "./RegionCreate";
import Notifier from "/imports/client/lib/Notifier";
import PagerService from "../../lib/PagerService";
import Pager from "../../lib/Pager";

class RegionListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      regionsSelected: [],
      currentRegion: null,
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

  componentWillReceiveProps(newProps) {
    const {queryParams} = FlowRouter.current();
    if (queryParams.regionName && queryParams.regionName == "") {
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

  setRegion = _id => {
    this.closeForm();
    const { currentRegion } = this.state;

    if (currentRegion === _id) {
      this.setState({ currentRegion: null });
    } else {
      this.setState({ currentRegion: _id, create: false });
    }
  };

  selectRegion = _id => {
    const { regionsSelected } = this.state;
    if (regionsSelected.includes(_id)) {
      regionsSelected.splice(regionsSelected.indexOf(_id), 1);
    } else {
      regionsSelected.push(_id);
    }
    this.setState({ regionsSelected });
  };

  createForm = () => {
    this.setState({
      currentRegion: false,
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
    const { regionsSelected } = this.state;

    Meteor.call("region.deleteMany", regionsSelected, err => {
      if (!err) {
        Notifier.success("Regions deleted !");
        this.setState({
          regionsSelected: []
        });
        this.closeRightPanel();
      }
    });
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentRegion: null
    });
  };
  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentRegion: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  render() {
    const { data, loading, error } = this.props;
    const { regionsSelected, currentRegion, create, range, total } = this.state;
    const region = objectFromArray(data, currentRegion);

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
            currentRegion || create ? "left__side" : "left__side full__width"
          }
        >
          <RegionSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={regionsSelected.length}
            deleteAction={this.deleteAction}
          />
          <RegionsList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            regionsSelected={regionsSelected}
            selectRegion={this.selectRegion}
            currentRegion={currentRegion}
            setRegion={this.setRegion}
            regions={data}
          />
          <PaginationBar
            module="Region"
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentRegion || create) && (
          <RightSide region={region} create={create} close={this.closeForm} />
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
    const { region, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <RegionCreate close={close} />
        ) : (
          <RegionContent region={region} />
        )}
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
)(RegionListContainer);
