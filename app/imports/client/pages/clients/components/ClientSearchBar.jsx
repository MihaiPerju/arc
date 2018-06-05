import React, { Component } from "react";
import { AutoForm, AutoField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import FilterBar from "/imports/client/lib/FilterBar.jsx";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";
import DatePicker from "react-datepicker";
import Notifier from "/imports/client/lib/Notifier";

export default class ClientSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
      filter: false,
      dropdown: false,
      selectAll: false,
      createdAtMin: null,
      createdAtMax: null
    };
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
    if (FlowRouter.current().queryParams.page != "1" && "clientName" in params) {
      this.props.setPagerInitial();
    }
    if ("clientName" in params) {
      FlowRouter.setQueryParams({ clientName: params.clientName });
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
    this.setState({
      selectAll: !selectAll
    });
  };

  onDateSelect = (selectedDate, field) => {
    const date = selectedDate ? new Date(selectedDate).toString() : "";
    if (field === "createdAtMin") {
      this.setState({ createdAtMin: selectedDate });
      FlowRouter.setQueryParams({ createdAtMin: date });
    } else if (field === "createdAtMax") {
      const { createdAtMin } = this.state;
      if (selectedDate < createdAtMin) {
        Notifier.error(
          "Maximum date should be greater or equal to minimum date"
        );
      } else {
        FlowRouter.setQueryParams({ createdAtMax: date });
      }
      this.setState({ createdAtMax: selectedDate });
    }
  };

  render() {
    const {
      filter,
      active,
      dropdown,
      selectAll,
      createdAtMin,
      createdAtMax
    } = this.state;
    const {
      options,
      btnGroup,
      deleteAction,
      dropdownOptions,
      icons,
      getProperAccounts
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
                  name="clientName"
                  placeholder="Search by client name"
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
              <div className="form-group flex--helper form-group__pseudo">
                <DatePicker
                  placeholderText="From created-at date"
                  selected={createdAtMin}
                  onChange={date => this.onDateSelect(date, "createdAtMin")}
                />
                <DatePicker
                  placeholderText="To created-at date"
                  selected={createdAtMax}
                  onChange={date => this.onDateSelect(date, "createdAtMax")}
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
