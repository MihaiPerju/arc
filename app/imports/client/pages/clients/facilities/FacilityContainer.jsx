import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import FacilitySearchBar from "./components/FacilitySearchBar.jsx";
import FacilityList from "./components/FacilityList.jsx";
import FacilityContent from "./FacilityContent.jsx";
import FacilityCreate from "./FacilityCreate.jsx";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/facilities/queries/facilityList";
import Loading from "/imports/client/lib/ui/Loading";
import Notifier from "/imports/client/lib/Notifier";
import PagerService from "../../../lib/PagerService";
import Pager from "../../../lib/Pager";

class FacilityContainer extends Pager {
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
      filter: false
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
  }

  componentWillReceiveProps(newProps) {
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

  getFacility() {
    const { data } = this.props;
    const { currentFacility } = this.state;
    for (let facility of data) {
      if (facility._id === currentFacility) {
        return facility;
      }
    }
  }

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
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentFacility: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  decreaseList = () => {
    this.setState({
      filter: !this.state.filter
    });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const {
      facilitiesSelected,
      currentFacility,
      create,
      range,
      total
    } = this.state;
    const facility = this.getFacility();

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

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
            facilities={data}
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
            facility={facility}
            create={create}
            close={this.closeForm}
            setFacility={this.setFacility}
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
    const { facility, create, close, setFacility } = this.props;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <FacilityCreate close={close} />
        ) : (
          <FacilityContent setFacility={setFacility} facility={facility} />
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
)(FacilityContainer);
