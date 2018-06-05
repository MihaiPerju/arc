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
import Notifier from "/imports/client/lib/Notifier";
import RolesEnum from "/imports/api/users/enums/roles";
import PagerService from "/imports/client/lib/PagerService";

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
      dischrgDateMin: null,
      dischrgDateMax: null,
      fbDateMin: null,
      fbDateMax: null,
      substates: [],
      sort: false,
      page:1,
      perPage:13,
      total:0,
      range:{}
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
    substateQuery
      .clone({
        filters: { status: true }
      })
      .fetch((err, res) => {
        if (!err) {
          res.map(substate => {
            const label = `${substate.stateName}: ${substate.name}`;
            substates.push({
              label: label,
              value: substate.name
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
    if(FlowRouter.current().queryParams.page !='1'){
      this.props.setPagerInitial()
    }
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
    if ("acctBalMin" in params) {
      FlowRouter.setQueryParams({ acctBalMin: params.acctBalMin });
    }
    if ("acctBalMax" in params) {
      if (params.acctBalMax < params.acctBalMin) {
        Notifier.error(
          "Maximum value should be greater or equal to minimum value"
        );
      } else {
        FlowRouter.setQueryParams({ acctBalMax: params.acctBalMax });
      }
    }
    if ("finClass" in params) {
      FlowRouter.setQueryParams({ finClass: params.finClass });
    }
    if ("substate" in params) {
      FlowRouter.setQueryParams({ substate: params.substate });
    }
    if ("activeInsCode" in params) {
      FlowRouter.setQueryParams({ activeInsCode: params.activeInsCode });
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
    if (field === "dischrgDateMin") {
      this.setState({ dischrgDateMin: selectedDate });
      FlowRouter.setQueryParams({ dischrgDateMin: date });
    } else if (field === "dischrgDateMax") {
      const { dischrgDateMin } = this.state;
      if (selectedDate < dischrgDateMin) {
        Notifier.error(
          "Maximum date should be greater or equal to minimum date"
        );
      } else {
        FlowRouter.setQueryParams({ dischrgDateMax: date });
      }
      this.setState({ dischrgDateMax: selectedDate });
    } else if (field === "fbDateMin") {
      this.setState({ fbDateMin: selectedDate });
      FlowRouter.setQueryParams({ fbDateMin: date });
    } else if (field === "fbDateMax") {
      const { fbDateMin } = this.state;
      if (selectedDate < fbDateMin) {
        Notifier.error(
          "Maximum date should be greater or equal to minimum date"
        );
      } else {
        FlowRouter.setQueryParams({ fbDateMax: date });
      }
      this.setState({ fbDateMax: selectedDate });
    }
  };

  manageSortBar = () => {
    const { sort } = this.state;
    this.setState({
      sort: !sort
    });
    this.props.decrease();
  };

  sortAccounts = (key, sortKey) => {
    FlowRouter.setQueryParams({ [key]: sortKey });
  };

  getSortClasses = (key, sortKey) => {
    const test = FlowRouter.getQueryParam(key);
    let classes = {};
    if (sortKey === "ASC") {
      classes = {
        "icon-angle-up": true,
        [`${key}-active-asc`]: test && test === "ASC"
      };
    } else {
      classes = {
        "icon-angle-down": true,
        [`${key}-active-desc`]: test && test === "DESC"
      };
    }
    return classNames(classes);
  };

  render() {
    const {
      filter,
      active,
      dropdown,
      selectAll,
      facilityOptions,
      clientOptions,
      dischrgDateMin,
      dischrgDateMax,
      fbDateMin,
      fbDateMax,
      substates,
      sort
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

    const searchBarClasses = classNames({
      "search-input": true,
      "full__width": (!btnGroup && !Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)),
      "sort__width": Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)
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
              className={searchBarClasses}
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
            {Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER) && (<div
              className={sort ? "filter-block active" : "filter-block"}
              onClick={this.manageSortBar}
            >
              <button>
                <i className="icon-angle-up" />{"  "}
                <i className="icon-angle-down" />
              </button>
            </div>)}
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
              <div className="form-group flex--helper form-group__pseudo">
                  <AutoField
                    labelHidden={true}
                    name="acctBalMin"
                    placeholder="Minimum Account Balance"
                  />
                  <AutoField
                    labelHidden={true}
                    name="acctBalMax"
                    placeholder="Maximum Account Balance"
                  />
              </div>
              <div className="form-group flex--helper form-group__pseudo">
                <DatePicker
                  placeholderText="From Discharge Date"
                  selected={dischrgDateMin}
                  onChange={date => this.onDateSelect(date, "dischrgDateMin")}
                />
                <DatePicker
                  placeholderText="To Discharge Date"
                  selected={dischrgDateMax}
                  onChange={date => this.onDateSelect(date, "dischrgDateMax")}
                />
              </div>
              <div className="form-group flex--helper form-group__pseudo">
                <DatePicker
                  placeholderText="From Last Bill Date"
                  selected={fbDateMin}
                  onChange={date => this.onDateSelect(date, "fbDateMin")}
                />
                <DatePicker
                  placeholderText="To Last Bill Date"
                  selected={fbDateMax}
                  onChange={date => this.onDateSelect(date, "fbDateMax")}
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
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="activeInsCode"
                  placeholder="Search by active Insurance Code"
                />
              </div>
            </div>
          </div>
        )}
        {sort && (
          <div className="sort-bar">
            <div className="test">
              <div>Account Balance</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortAccounts("sortAcctBal", "ASC")}
                  className={this.getSortClasses("sortAcctBal", "ASC")}
                />
                <span
                  onClick={() => this.sortAccounts("sortAcctBal", "DESC")}
                  className={this.getSortClasses("sortAcctBal", "DESC")}
                />
              </div>
            </div>
            <div className="test">
              <div>tickleDate</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortAccounts("sortTickleDate", "ASC")}
                  className={this.getSortClasses("sortTickleDate", "ASC")}
                />
                <span
                  onClick={() => this.sortAccounts("sortTickleDate", "DESC")}
                  className={this.getSortClasses("sortTickleDate", "DESC")}
                />
              </div>
            </div>
            <div className="test">
              <div>createdAt</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortAccounts("sortCreatedAt", "ASC")}
                  className={this.getSortClasses("sortCreatedAt", "ASC")}
                />
                <span
                  onClick={() => this.sortAccounts("sortCreatedAt", "DESC")}
                  className={this.getSortClasses("sortCreatedAt", "DESC")}
                />
              </div>
            </div>
            <div className="test">
              <div>dischrgDate</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortAccounts("sortDischrgDate", "ASC")}
                  className={this.getSortClasses("sortDischrgDate", "ASC")}
                />
                <span
                  onClick={() => this.sortAccounts("sortDischrgDate", "DESC")}
                  className={this.getSortClasses("sortDischrgDate", "DESC")}
                />
              </div>
            </div>
            <div className="test">
              <div>fbDate</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortAccounts("sortFbDate", "ASC")}
                  className={this.getSortClasses("sortFbDate", "ASC")}
                />
                <span
                  onClick={() => this.sortAccounts("sortFbDate", "DESC")}
                  className={this.getSortClasses("sortFbDate", "DESC")}
                />
              </div>
            </div>
            <div className="test">
              <div>admitDate</div>
              <div className="sort-icons">
                <span
                  onClick={() => this.sortAccounts("sortAdmitDate", "ASC")}
                  className={this.getSortClasses("sortAdmitDate", "ASC")}
                />
                <span
                  onClick={() => this.sortAccounts("sortAdmitDate", "DESC")}
                  className={this.getSortClasses("sortAdmitDate", "DESC")}
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
  acctBalMin: {
    type: SimpleSchema.Integer,
    optional: true,
    label: "Search by Account Balance"
  },
  acctBalMax: {
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
  },
  activeInsCode: {
    type: String,
    optional: true,
    label: "Search by active Insurance Code"
  }
});
