import React, { Component } from "react";
import { AutoForm, AutoField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";
import { SelectField } from "/imports/ui/forms";
import DatePicker from "react-datepicker";
import facilityQuery from "/imports/api/facilities/queries/facilityList";
import substateQuery from "/imports/api/substates/queries/listSubstates";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";

export default class AccountSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
      filter: false,
      dropdown: false,
      selectAll: false,
      facilityOptions: [],
      clientOptions: [],
      dischrgDate: null,
      fbDate: null,
      substates: []
    };
  }

  componentWillMount() {
    const facilityOptions = [];
    const clientOptions = [];
    const substates = [];

    facilityQuery.fetch((err, res) => {
      if (!err) {
        res.map(facility => {
          facilityOptions.push({ label: facility.name, value: facility._id });
        });
        this.setState({ facilityOptions });
      }
    });
    clientsQuery.fetch((err, res) => {
      if (!err) {
        res.map(client => {
          clientOptions.push({ label: client.clientName, value: client._id });
        });
        this.setState({ clientOptions });
      }
    });
    substateQuery.clone().fetch((err, res) => {
      if (!err) {
        res.map(substate => {
          const label = `${substate.stateName}: ${substate.name}`;
          substates.push({
            label: label,
            value: substate.name.replace(/ /g, "_")
          });
        });
        this.setState({ substates });
      }
    });
  }

  manageFilterBar() {
    const { active, filter } = this.state;
    this.setState({
      active: !active,
      filter: !filter
    });
    this.props.decrease();
  }

  onSubmit(params) {
    if ("acctNum" in params) {
      FlowRouter.setQueryParams({ acctNum: params.acctNum });
    }
    if ("clientId" in params) {
      FlowRouter.setQueryParams({ clientId: params.clientId });
    }
    if ("facilityId" in params) {
      FlowRouter.setQueryParams({ facilityId: params.facilityId });
    }
    if ("facCode" in params) {
      FlowRouter.setQueryParams({ facCode: params.facCode });
    }
    if ("ptType" in params) {
      FlowRouter.setQueryParams({ ptType: params.ptType });
    }
    if ("acctBal" in params) {
      FlowRouter.setQueryParams({ acctBal: params.acctBal });
    }
    if ("finClass" in params) {
      FlowRouter.setQueryParams({ finClass: params.finClass });
    }
    if ("substate" in params) {
      FlowRouter.setQueryParams({ substate: params.substate });
    }
  }

  openDropdown = () => {
    if (!this.state.dropdown) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }
    this.setState({
      dropdown: !this.state.dropdown
    });
  };

  outsideClick = e => {
    if (this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

  nodeRef = node => {
    this.node = node;
  };

  onDateSelect = (selectedDate, field) => {
    const date = selectedDate ? new Date(selectedDate).toString() : "";
    if (field === "dischrgDate") {
      this.setState({ dischrgDate: selectedDate });
      FlowRouter.setQueryParams({ dischrgDate: date });
    } else if (field === "fbDate") {
      this.setState({ fbDate: selectedDate });
      FlowRouter.setQueryParams({ fbDate: date });
    }
  };

  render() {
    const {
      filter,
      active,
      dropdown,
      selectAll,
      facilityOptions,
      clientOptions,
      dischrgDate,
      fbDate,
      substates
    } = this.state;
    const {
      options,
      btnGroup,
      deleteAction,
      dropdownOptions,
      icons,
      getProperAccounts,
      assignFilterArr
    } = this.props;

    const classes = classNames({
      "select-type": true,
      open: dropdown
    });
    const btnSelectClasses = classNames({
      "btn-select": true,
      active: selectAll
    });

    return (
      <AutoForm
        autosave
        autosaveDelay={500}
        ref="filters"
        onSubmit={this.onSubmit.bind(this)}
        schema={schema}
      >
        <div className="search-bar">
          <div className={classes} ref={this.nodeRef}>
            <div className={btnSelectClasses} onClick={this.selectAll} />
            <div className="btn-toggle-dropdown" onClick={this.openDropdown}>
              <i className="icon-angle-down" />
            </div>
            {dropdown && (
              <Dropdown
                toggleDropdown={this.openDropdown}
                getProperAccounts={getProperAccounts}
                options={dropdownOptions}
                assignFilterArr={assignFilterArr}
              />
            )}
          </div>
          <div className="search-bar__wrapper">
            {btnGroup ? (
              <BtnGroup
                getProperAccounts={getProperAccounts}
                icons={icons}
                deleteAction={deleteAction}
              />
            ) : null}
            <div
              className={btnGroup ? "search-input" : "search-input full__width"}
            >
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="acctNum"
                  placeholder="Search by Account Number"
                />
              </div>
            </div>

            <div
              className={active ? "filter-block active" : "filter-block"}
              onClick={this.manageFilterBar.bind(this)}
            >
              <button>
                <i className="icon-filter" />
              </button>
            </div>
          </div>
        </div>
        {filter && (
          <div className="filter-bar">
            <div className="select-wrapper">
              <div className="select-form">
                <SelectField
                  labelHidden={true}
                  name="clientId"
                  options={clientOptions}
                />
              </div>
              <div className="select-form">
                <SelectField
                  labelHidden={true}
                  name="facilityId"
                  options={facilityOptions}
                />
              </div>
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="facCode"
                  placeholder="Search by Facility Code"
                />
              </div>
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="ptType"
                  placeholder="Search by Patient Type"
                />
              </div>
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="acctBal"
                  placeholder="Search by Account Balance"
                />
              </div>
              <div className="form-group">
                <DatePicker
                  placeholderText="Search by Discharge Date"
                  selected={dischrgDate}
                  onChange={date => this.onDateSelect(date, "dischrgDate")}
                />
              </div>
              <div className="form-group">
                <DatePicker
                  placeholderText="Search by Last Bill Date"
                  selected={fbDate}
                  onChange={date => this.onDateSelect(date, "fbDate")}
                />
              </div>
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="finClass"
                  placeholder="Search by Financial Class"
                />
              </div>
              <div className="select-form">
                <SelectField
                  placeholder="Substate"
                  labelHidden={true}
                  options={substates}
                  name="substate"
                />
              </div>
            </div>
          </div>
        )}
      </AutoForm>
    );
  }
}

class BtnGroup extends Component {
  constructor() {
    super();
    this.state = {
      in: false,
      dialogIsActive: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ in: true });
    }, 1);
  }

  deleteAction = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  confirmDelete = () => {
    this.setState({
      dialogIsActive: false
    });
    this.props.deleteAction();
  };

  render() {
    const { deleteAction, icons } = this.props;
    const { dialogIsActive } = this.state;
    return (
      <div className={this.state.in ? "btn-group in" : "btn-group"}>
        {icons ? (
          icons.map(element => {
            return (
              <button onClick={element.method}>
                <i className={"icon-" + element.icon} />
              </button>
            );
          })
        ) : (
          <button>
            <i className="icon-archive" />
          </button>
        )}
        {deleteAction && (
          <button onClick={this.deleteAction}>
            <i className="icon-trash-o" />
          </button>
        )}
        {dialogIsActive && (
          <Dialog className="account-dialog" closePortal={this.closeDialog}>
            <div className="form-wrapper">
              Are you sure you want to delete selected items ?
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button className="btn--light-blue" onClick={this.confirmDelete}>
                Confirm & delete
              </button>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}

const schema = new SimpleSchema({
  facilityId: {
    type: String,
    optional: true,
    label: "Filter by Facility"
  },
  clientId: {
    type: String,
    optional: true,
    label: "Filter by Client"
  },
  acctNum: {
    type: String,
    optional: true,
    label: "Search by Account Number"
  },
  facCode: {
    type: String,
    optional: true,
    label: "Search by Facility Code"
  },
  ptType: {
    type: String,
    optional: true,
    label: "Search by Patient Type"
  },
  acctBal: {
    type: SimpleSchema.Integer,
    optional: true,
    label: "Search by Account Balance"
  },
  finClass: {
    type: String,
    optional: true,
    label: "Search by Financial Class"
  },
  substate: {
    type: String,
    optional: true,
    label: "Search by Substate"
  }
});
