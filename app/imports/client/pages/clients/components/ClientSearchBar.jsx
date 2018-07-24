import React, { Component } from "react";
import { AutoForm, AutoField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import moment from "moment";
import Dialog from "/imports/client/lib/ui/Dialog";
import DatePicker from "react-datepicker";
import Notifier from "/imports/client/lib/Notifier";
import FilterService from "/imports/client/lib/FilterService";

export default class ClientSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false,
      dropdown: false,
      selectAll: false,
      createdAtMin: null,
      createdAtMax: null,
      model: {}
    };
  }

  componentWillMount() {
    this.getFilterParams();
  }

  onSubmit(params) {
    const { createdAtMin, createdAtMax } = this.state;
    if (FlowRouter.current().queryParams.page != "1") {
      this.props.setPagerInitial();
    }

    FlowRouter.setQueryParams({
      createdAtMin: FilterService.formatDate(createdAtMin)
    });

    FlowRouter.setQueryParams({
      createdAtMax: FilterService.formatDate(createdAtMax)
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

  selectAll = () => {
    const { selectAll } = this.state;
    this.setState({
      selectAll: !selectAll
    });
  };

  onDateSelect = (selectedDate, field) => {
    if (field === "createdAtMin") {
      this.setState({ createdAtMin: selectedDate });
    } else if (field === "createdAtMax") {
      const { createdAtMin } = this.state;
      if (selectedDate < createdAtMin) {
        Notifier.error(
          "Maximum date should be greater or equal to minimum date"
        );
      }
      this.setState({ createdAtMax: selectedDate });
    }
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
    if (field === "clientName") {
      FlowRouter.setQueryParams({ clientName: value });
    }
  };

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("clientName" in queryParams) {
      model.clientName = queryParams.clientName;
    }

    if ("createdAtMin" in queryParams) {
      this.setState({
        createdAtMin: moment(new Date(queryParams.createdAtMin))
      });
    }

    if ("createdAtMax" in queryParams) {
      this.setState({
        createdAtMax: moment(new Date(queryParams.createdAtMax))
      });
    }

    if ("tagIds" in queryParams) {
      model.tagIds = queryParams.tagIds;
    }

    this.setState({ model });
  };

  render() {
    const {
      dialogIsActive,
      dropdown,
      selectAll,
      createdAtMin,
      createdAtMax,
      model
    } = this.state;
    const {
      options,
      btnGroup,
      deleteAction,
      dropdownOptions,
      icons,
      getProperAccounts,
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
                  name="clientName"
                  placeholder="Search by client name"
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
                    title="Filter by:"
                  >
                    <button className="close-dialog" onClick={this.closeDialog}>
                      <i className="icon-close" />
                    </button>
                    <div className="filter-bar">
                      <div className="select-wrapper">
                        <div className="form-group flex--helper form-group__pseudo">
                          <DatePicker
                            placeholderText="From created-at date"
                            selected={createdAtMin}
                            onChange={date =>
                              this.onDateSelect(date, "createdAtMin")
                            }
                          />
                          <DatePicker
                            placeholderText="To created-at date"
                            selected={createdAtMax}
                            onChange={date =>
                              this.onDateSelect(date, "createdAtMax")
                            }
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
  assigneeId: {
    type: String,
    optional: true,
    label: "Filter by assignee"
  },
  clientName: {
    type: String,
    optional: true,
    label: "Search by client name"
  }
});
