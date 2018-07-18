import React, { Component } from "react";
import { AutoForm, AutoField, SelectField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";
import DatePicker from "react-datepicker";
import moment from "moment";
import facilityQuery from "/imports/api/facilities/queries/facilityList";
import substateQuery from "/imports/api/substates/queries/listSubstates";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";
import Notifier from "/imports/client/lib/Notifier";
import RolesEnum from "/imports/api/users/enums/roles";
import userListQuery from "/imports/api/users/queries/listUsers.js";
import FilterService from "/imports/client/lib/FilterService";

export default class AccountSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      dropdown: false,
      dialogIsActive: false,
      selectAll: false,
      facilityOptions: [],
      clientOptions: [],
      dischrgDateMin: null,
      dischrgDateMax: null,
      fbDateMin: null,
      fbDateMax: null,
      substates: [],
      sort: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      admitDateMin: null,
      admitDateMax: null,
      tickleUserIdOptions: [],
      model: {}
    };
  }

  componentWillMount() {
    let facilityOptions = [];
    let clientOptions = [];
    let substates = [];
    let tickleUserIdOptions = [];
    let model = {};

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
    userListQuery
      .clone({ filters: { roles: { $in: [RolesEnum.REP] } } })
      .fetch((err, res) => {
        if (!err) {
          res.map(user => {
            tickleUserIdOptions.push({
              label:
                user.profile &&
                user.profile.lastName + " " + user.profile.firstName,
              value: user._id
            });
          });
        }
      });
    this.setState({ tickleUserIdOptions });
    model = FilterService.getFilterParams();

    const {
      dischrgDateMin,
      dischrgDateMax,
      fbDateMin,
      fbDateMax,
      admitDateMin,
      admitDateMax
    } = model;

    this.setState({
      model,
      dischrgDateMin,
      dischrgDateMax,
      fbDateMin,
      fbDateMax,
      admitDateMin,
      admitDateMax
    });
  }

  onSubmit(params) {
    const {
      dischrgDateMin,
      dischrgDateMax,
      fbDateMin,
      fbDateMax,
      admitDateMin,
      admitDateMax
    } = this.state;
    if (FlowRouter.current().queryParams.page != "1") {
      this.props.setPagerInitial();
    }

    if ("tickleUserId" in params) {
      FlowRouter.setQueryParams({ tickleUserId: params.tickleUserId });
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

    FlowRouter.setQueryParams({
      dischrgDateMin: FilterService.formatDate(dischrgDateMin)
    });

    FlowRouter.setQueryParams({
      dischrgDateMax: FilterService.formatDate(dischrgDateMax)
    });

    FlowRouter.setQueryParams({
      fbDateMin: FilterService.formatDate(fbDateMin)
    });

    FlowRouter.setQueryParams({
      fbDateMax: FilterService.formatDate(fbDateMax)
    });

    FlowRouter.setQueryParams({
      admitDateMin: FilterService.formatDate(admitDateMin)
    });

    FlowRouter.setQueryParams({
      admitDateMax: FilterService.formatDate(admitDateMax)
    });
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
    if (field === "dischrgDateMin") {
      this.setState({ dischrgDateMin: selectedDate });
    } else if (field === "dischrgDateMax") {
      const { dischrgDateMin } = this.state;
      if (selectedDate && selectedDate < dischrgDateMin) {
        Notifier.error(
          "Maximum date should be greater or equal to minimum date"
        );
      }
      this.setState({ dischrgDateMax: selectedDate });
    } else if (field === "fbDateMin") {
      this.setState({ fbDateMin: selectedDate });
    } else if (field === "fbDateMax") {
      const { fbDateMin } = this.state;
      if (selectedDate && selectedDate < fbDateMin) {
        Notifier.error(
          "Maximum date should be greater or equal to minimum date"
        );
      }
      this.setState({ fbDateMax: selectedDate });
    } else if (field === "admitDateMin") {
      this.setState({ admitDateMin: selectedDate });
    } else if (field === "admitDateMax") {
      const { admitDateMin } = this.state;
      if (selectedDate && selectedDate < admitDateMin) {
        Notifier.error(
          "Maximum date should be greater or equal to minimum date"
        );
      }
      this.setState({ admitDateMax: selectedDate });
    }
  };

  manageSortBar = () => {
    const { sort } = this.state;
    this.setState({
      sort: !sort
    });
  };

  sortAccounts = (key, sortKey) => {
    if (FlowRouter.getQueryParam(key) === sortKey) {
      FlowRouter.setQueryParams({ [key]: null });
    } else {
      FlowRouter.setQueryParams({ [key]: sortKey });
    }
  };

  getSortClasses = (key, sortKey) => {
    const param = FlowRouter.getQueryParam(key);
    let classes = {};
    if (sortKey === "ASC") {
      classes = {
        "icon-angle-up": true,
        [`${key}-active-asc`]: param && param === "ASC"
      };
    } else {
      classes = {
        "icon-angle-down": true,
        [`${key}-active-desc`]: param && param === "DESC"
      };
    }
    return classNames(classes);
  };

  openDialog = e => {
    e.preventDefault();
    this.setState({
      dialogIsActive: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  addFilters = () => {
    const { filters } = this.refs;
    filters.submit();
    this.closeDialog();
  };

  onChange = (field, value) => {
    if (field === "acctNum") {
      FlowRouter.setQueryParams({ acctNum: value });
    }
  };

  render() {
    const {
      dropdown,
      dialogIsActive,
      selectAll,
      facilityOptions,
      clientOptions,
      dischrgDateMin,
      dischrgDateMax,
      fbDateMin,
      fbDateMax,
      substates,
      sort,
      admitDateMin,
      admitDateMax,
      tickleUserIdOptions,
      model
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
      full__width:
        (btnGroup && Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH)) ||
        (btnGroup && Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)),
      sort__width:
        btnGroup && Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER),
      "account-search": Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)
    });

    const currentStateName = FlowRouter.current().params.state;

    const sortOptionClasses = classNames({
      "sort-options": true,
      tickle__width: currentStateName === "tickles"
    });

    return (
      <AutoForm
        ref="filters"
        onSubmit={this.onSubmit.bind(this)}
        schema={schema}
        onChange={this.onChange}
        model={model}
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
          <div className="search-bar__wrapper flex--helper">
            {btnGroup ? (
              <BtnGroup
                getProperAccounts={getProperAccounts}
                icons={icons}
                deleteAction={deleteAction}
              />
            ) : null}
            <div className={searchBarClasses}>
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="acctNum"
                  placeholder="Search by Account Number"
                />
              </div>
            </div>

            <div className="filter-block">
              <button onClick={this.openDialog.bind(this)}>
                <i className="icon-filter" />
                {dialogIsActive && (
                  <Dialog
                    className="account-dialog filter-dialog"
                    closePortal={this.closeDialog}
                    title="Filter by"
                  >
                    <button className="close-dialog" onClick={this.closeDialog}>
                      <i className="icon-close" />
                    </button>
                    <div className="filter-bar">
                      <div className="select-wrapper">
                        {Roles.userIsInRole(
                          Meteor.userId(),
                          RolesEnum.MANAGER
                        ) && (
                          <div className="select-form">
                            <SelectField
                              label="Tickle:"
                              name="tickleUserId"
                              options={tickleUserIdOptions}
                            />
                          </div>
                        )}

                        <div className="select-form">
                          <SelectField
                            label="Client:"
                            placeholder="Select Client"
                            name="clientId"
                            options={clientOptions}
                          />
                        </div>
                        <div className="select-form">
                          <SelectField
                            label="Facility:"
                            name="facilityId"
                            placeholder="Select Facility"
                            options={facilityOptions}
                          />
                        </div>
                        <div className="form-group">
                          <AutoField
                            label="Facility code:"
                            name="facCode"
                            placeholder="Search by Facility Code"
                          />
                        </div>
                        <div className="form-group">
                          <AutoField
                            label="Patient Type:"
                            name="ptType"
                            placeholder="Search by Patient Type"
                          />
                        </div>
                        <div className="form-group flex--helper form-group__pseudo">
                          <AutoField
                            label="Minimum Account Balance:"
                            name="acctBalMin"
                            placeholder="Minimum Account Balance"
                          />
                          <AutoField
                            label="Maximum Account Balance:"
                            name="acctBalMax"
                            placeholder="Maximum Account Balance"
                          />
                        </div>
                        <div className="form-group flex--helper form-group__pseudo">
                          <div>
                            <label>From Discharge Date:</label>
                            <DatePicker
                              placeholderText="From Discharge Date"
                              selected={dischrgDateMin}
                              onChange={date =>
                                this.onDateSelect(date, "dischrgDateMin")
                              }
                            />
                          </div>
                          <div>
                            <label>From Discharge Date:</label>
                            <DatePicker
                              placeholderText="To Discharge Date"
                              selected={dischrgDateMax}
                              onChange={date =>
                                this.onDateSelect(date, "dischrgDateMax")
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group flex--helper form-group__pseudo">
                          <div>
                            <label>From Last Bill Date:</label>
                            <DatePicker
                              placeholderText="From Last Bill Date"
                              selected={fbDateMin}
                              onChange={date =>
                                this.onDateSelect(date, "fbDateMin")
                              }
                            />
                          </div>
                          <div>
                            <label>To Last Bill Date:</label>
                            <DatePicker
                              placeholderText="To Last Bill Date"
                              selected={fbDateMax}
                              onChange={date =>
                                this.onDateSelect(date, "fbDateMax")
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group flex--helper form-group__pseudo">
                          <div>
                            <label>From Admit Date:</label>
                            <DatePicker
                              placeholderText="From Admit Date"
                              selected={admitDateMin}
                              onChange={date =>
                                this.onDateSelect(date, "admitDateMin")
                              }
                            />
                          </div>
                          <div>
                            <label>To Admit Date:</label>
                            <DatePicker
                              placeholderText="To Admit Date"
                              selected={admitDateMax}
                              onChange={date =>
                                this.onDateSelect(date, "admitDateMax")
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <AutoField
                            label="Financial Class:"
                            name="finClass"
                            placeholder="Search by Financial Class"
                          />
                        </div>
                        <div className="select-form">
                          <SelectField
                            label="Substate:"
                            placeholder="Substate"
                            options={substates}
                            name="substate"
                          />
                        </div>
                        <div className="form-group">
                          <AutoField
                            label="Active Insurance Code:"
                            name="activeInsCode"
                            placeholder="Search by active Insurance Code"
                          />
                        </div>
                        <div className="flex--helper flex-justify--end">
                          <button
                            className="btn--blue"
                            onClick={this.addFilters}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                )}
              </button>
            </div>
            {Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER) && (
              <div
                className={sort ? "filter-block active" : "filter-block"}
                onClick={this.manageSortBar}
              >
                <button>
                  {sort ? (
                    <i className="icon-angle-up" />
                  ) : (
                    <i className="icon-angle-down" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        {sort && (
          <div className="sort-bar">
            <div className={sortOptionClasses}>
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
            {currentStateName === "tickles" && (
              <div className={sortOptionClasses}>
                <div>Tickle Date</div>
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
            )}
            <div className={sortOptionClasses}>
              <div>Created At</div>
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
            <div className={sortOptionClasses}>
              <div>Discharge Date</div>
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
            <div className={sortOptionClasses}>
              <div>Last Bill Date</div>
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
            <div className={sortOptionClasses}>
              <div>Admit Date</div>
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
  tickleUserId: {
    type: String,
    optional: true,
    label: "Filter by Tickle Author"
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
