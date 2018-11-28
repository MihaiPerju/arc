import React from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import FacilitySearchBar from "./components/FacilitySearchBar.jsx";
import FacilityList from "./components/FacilityList.jsx";
import Notifier from "/imports/client/lib/Notifier";
import ParamsService from "../../../lib/ParamsService";
import Pager from "../../../lib/Pager";
import RightSide from "./FacilityRightSide";

export default class FacilityContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      currentFacility: null,
      filter: false,
      facilitiesSelected: [],
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      facilities: []
    });
    this.method = "facilities.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);
    this.pollingMethod = setInterval(() => {
      this.listFacilities();
    }, 3000);
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  listFacilities = () => {
    const params = ParamsService.getFacilitiesParams();
    Meteor.call("facilities.list", params, (err, facilities) => {
      if (!err) {
        this.setState({ facilities });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
    if (queryParams.facilityName && queryParams.facilityName == "") {
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

  setFacility = _id => {
    this.closeForm();
    const { currentFacility } = this.state;

    if (currentFacility === _id) {
      this.setState({ currentFacility: null });
    } else {
      this.setState({ currentFacility: _id, create: false });
    }
  };

  selectFacility = _id => {
    const { facilitiesSelected } = this.state;
    if (facilitiesSelected.includes(_id)) {
      facilitiesSelected.splice(facilitiesSelected.indexOf(_id), 1);
    } else {
      facilitiesSelected.push(_id);
    }
    this.setState({ facilitiesSelected });
  };

  createForm = () => {
    this.setState({
      currentFacility: false,
      create: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    
    this.updatePager();
    this.listFacilities()
  };

  deleteAction = () => {
    const { facilitiesSelected } = this.state;

    Meteor.call("facility.removeMany", facilitiesSelected, err => {
      if (!err) {
        Notifier.success("Facilities deleted !");
        this.setState({
          facilitiesSelected: []
        });
        this.closeRightPanel();
      }
    });
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentFacility: null
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentFacility: null });

    this.listFacilities()
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getFacilitiesParams();
    this.recount(queryParams);
  };

  decreaseList = () => {
    this.setState({
      filter: !this.state.filter
    });
  };

  render() {
    const {
      facilitiesSelected,
      currentFacility,
      create,
      range,
      total,
      facilities
    } = this.state;

    return (
      <div className="cc-container">
        <div
          className={
            currentFacility || create ? "left__side" : "left__side full__width"
          }
        >
          <FacilitySearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={facilitiesSelected.length}
            deleteAction={this.deleteAction}
            decrease={this.decreaseList}
            hideSort
          />
          <FacilityList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            facilitiesSelected={facilitiesSelected}
            setFacility={this.setFacility.bind(this)}
            selectFacility={this.selectFacility}
            currentFacility={currentFacility}
            facilities={facilities}
          />
          <PaginationBar
            module="Facility"
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentFacility || create) && (
          <RightSide
            currentFacility={currentFacility}
            create={create}
            close={this.closeForm}
            setFacility={this.setFacility}
          />
        )}
      </div>
    );
  }
}
