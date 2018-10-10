import React, { Component } from "react";
import { AutoForm, AutoField, SelectField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import moment from "moment";
import Dialog from "/imports/client/lib/ui/Dialog";
import Notifier from "/imports/client/lib/Notifier";
import FilterService from "/imports/client/lib/FilterService";
import facilityQuery from "/imports/api/facilities/queries/facilityList";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";
import statuses from "/imports/api/files/enums/statuses";

export default class FileSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false,
      dropdown: false,
      selectAll: false,
      fileName: null,
      clientOptions: [],
      facilityOptions: [],
      statusOptions: [],
      model: {}
    };
  }

  componentWillMount() {
    let facilityOptions = [];
    let clientOptions = [];
    const statusOptions = [
      { label: "Success", value: statuses.SUCCESS },
      { label: "Dismissed", value: statuses.DISMISS },
      { label: "Failed", value: statuses.FAIL }
    ];

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
    let model = FilterService.getFilterParams();
    this.setState({
      model,
      facilityOptions,
      clientOptions,
      statusOptions
    });
  }

  onSubmit(params) {
    const { close } = this.props;
    close();
    if (FlowRouter.current().queryParams.page != "1") {
      this.props.setPagerInitial();
    }
    if (params.clientId || params.clientId === "") {
      FlowRouter.setQueryParams({ clientId: params.clientId });
    }
    if (params.facilityId || params.facilityId === "") {
      FlowRouter.setQueryParams({ facilityId: params.facilityId });
    }
    if (params.status || params.status === "") {
      FlowRouter.setQueryParams({ status: params.status });
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

  selectAll = () => {
    const { selectAll } = this.state;
    this.setState({ selectAll: !selectAll });
  };

  openDialog = e => {
    e.preventDefault();
    this.setState({ dialogIsActive: true });
  };

  closeDialog = () => {
    this.setState({ dialogIsActive: false });
  };

  addFilters = () => {
    const { filters } = this.refs;
    filters.submit();
    this.closeDialog();
  };

  onChange = (field, value) => {
    if (field === "fileName") {
      FlowRouter.setQueryParams({
        fileName: value
      });
    }
  };

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("fileName" in queryParams) {
      model.fileName = queryParams.fileName;
    }

    this.setState({ model });
  };

  resetFilters = () => {
    FlowRouter.setQueryParams({ fileName: null });
    const { filters } = this.refs;
    filters.reset();
    this.closeDialog();
  };

  render() {
    const {
      dialogIsActive,
      dropdown,
      selectAll,
      model,
      clientOptions,
      facilityOptions,
      statusOptions
    } = this.state;
    const {
      options,
      btnGroup,
      deleteAction,
      dropdownOptions,
      icons,
      hideSort
    } = this.props;

    const classes = classNames({
      "select-type": true,
      open: dropdown
    });
    const btnSelectClasses = classNames({
      "btn-select": true,
      active: selectAll
    });
    const searchClasses = classNames("search-input", {
      full__width: btnGroup,
      sort__none: hideSort
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
          {!hideSort && (
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
                />
              )}
            </div>
          )}
          <div className="search-bar__wrapper flex--helper">
            {btnGroup ? (
              <BtnGroup
                getProperAccounts={getProperAccounts}
                icons={icons}
                deleteAction={deleteAction}
              />
            ) : null}
            <div className={searchClasses}>
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="fileName"
                  placeholder="Search by File Name"
                />
              </div>
            </div>

            <div className="filter-block flex--helper">
              <button onClick={this.openDialog.bind(this)}>
                <i className="icon-filter" />
                {dialogIsActive && (
                  <Dialog
                    className="account-dialog filter-dialog filter-dialog__account"
                    closePortal={this.closeDialog}
                    title="Filter by"
                  >
                    <button className="close-dialog" onClick={this.closeDialog}>
                      <i className="icon-close" />
                    </button>
                    <div className="filter-bar">
                      <div className="select-wrapper">
                        <div className="flex--helper form-group__pseudo--3">
                          <div className="select-form">
                            <SelectField
                              placeholder="Select Client"
                              name="clientId"
                              options={clientOptions}
                            />
                          </div>
                          <div className="select-form">
                            <SelectField
                              name="facilityId"
                              placeholder="Select Facility"
                              options={facilityOptions}
                            />
                          </div>
                          <div className="select-form">
                            <SelectField
                              name="status"
                              placeholder="Select Status"
                              options={statusOptions}
                            />
                          </div>
                        </div>
                        <div className="flex--helper flex-justify--space-between">
                          <button
                            className="btn--red"
                            onClick={this.resetFilters}
                          >
                            Reset
                          </button>
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
          </div>
        </div>
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
    const btnClasses = classNames("btn-group flex--helper", {
      in: this.state.in
    });

    return (
      <div className={btnClasses}>
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
            Meteor.call("reset")
            <i className="icon-trash-o" />
          </button>
        )}
        {dialogIsActive && (
          <Dialog
            title="Confirm"
            className="account-dialog"
            closePortal={this.closeDialog}
          >
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
    optional: true
  },
  clientId: {
    type: String,
    optional: true,
    label: "Filter by assignee"
  },
  fileName: {
    type: String,
    optional: true,
    label: "Search by File Name"
  },
  status: {
    type: String,
    optional: true,
    label: "Search by File Status"
  }
});
