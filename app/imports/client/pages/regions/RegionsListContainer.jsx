import React from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import RegionSearchBar from "./components/RegionSearchBar.jsx";
import RegionsList from "./components/RegionsList.jsx";
import Notifier from "/imports/client/lib/Notifier";
import ParamsService from "../../lib/ParamsService";
import Pager from "../../lib/Pager";
import RightSide from "./RegionRightSide";

export default class RegionListContainer extends Pager {
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
      range: {},
      regions: []
    });
    this.method = "regions.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);

    this.pollingMethod = setInterval(() => {
      this.listRegions();
    }, 3000);
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  listRegions = () => {
    const params = ParamsService.getRegionsParams();
    Meteor.call("regions.get", params, (err, regions) => {
      if (!err) {
        this.setState({ regions });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentRegion: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getRegionsParams();
    this.recount(queryParams);
  };

  render() {
    const {
      regionsSelected,
      currentRegion,
      create,
      range,
      total,
      regions
    } = this.state;

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
            hideSort
            hideFilter
          />
          <RegionsList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            regionsSelected={regionsSelected}
            selectRegion={this.selectRegion}
            currentRegion={currentRegion}
            setRegion={this.setRegion}
            regions={regions}
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
          <RightSide currentRegion={currentRegion} create={create} close={this.closeForm} />
        )}
      </div>
    );
  }
}
