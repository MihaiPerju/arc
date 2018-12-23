import React, { Component } from "react";
import { AutoForm, AutoField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import FilterBar from "/imports/client/lib/FilterBar.jsx";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";
import Tags from "/imports/client/lib/Tags";
import _ from "underscore";
import typeOptions, {
  allowedValues
} from "/imports/client/pages/reports/enums/reportType";

export default class ReportSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      dropdown: false,
      selectAll: false,
      model: {},
      filter: false
    };
  }

  componentWillMount() {
    this.getFilterParams();
  }

  onSubmit(params) {
    if (FlowRouter.current().queryParams.page != "1" && "name" in params) {
      this.props.setPagerInitial();
    }
    if ("name" in params) {
      FlowRouter.setQueryParams({ name: params.name });
    }
    if ("type" in params) {
      FlowRouter.setQueryParams({ type: params.type });
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
  closeDialog = () => {
    this.setState(() => ({ dialogIsActive: false }));
  };

  selectAll = () => {
    const { selectAll } = this.state;
    this.setState({
      selectAll: !selectAll
    });
  };

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("name" in queryParams) {
      model.name = queryParams.name;
    }
    this.setState({ model });
  };

  showDialog = () => {
    this.setState(() => ({ dialogIsActive: true }));
  };
  resetFilters = () => {
    let appliedFilters = FlowRouter.current().queryParams;
    appliedFilters = _.omit(appliedFilters, "page", "tagIds");
    appliedFilters = _.mapObject(appliedFilters, () => null);
    FlowRouter.setQueryParams(appliedFilters);
    const { filters } = this.refs;
    filters.reset();
    this.closeDialog();
  };

  addFilters = () => {
    const { filters } = this.refs;
    filters.submit();
    this.closeDialog();
  };
  onChange = (field, value) => {
    if (field === "name") {
      FlowRouter.setQueryParams({ name: value });
    }
  };
  render() {
    const { filter, dropdown, selectAll, model, dialogIsActive } = this.state;
    const {
      options,
      btnGroup,
      deleteAction,
      dropdownOptions,
      icons,
      getProperAccounts,
      hideSort,
      hideFilter,
      tags
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
      full__width: btnGroup && !hideFilter,
      sort__none: hideSort,
      "btns--none": btnGroup && hideFilter
    });

    return (
      <AutoForm
        onChange={this.onChange}
        ref="filters"
        onSubmit={this.onSubmit.bind(this)}
        schema={schema}
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
                  name="name"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="filter-block flex--helper">
              {!hideFilter && (
                <button onClick={this.showDialog}>
                  <i className="icon-filter" />
                  {dialogIsActive && (
                    <Dialog
                      className="account-dialog filter-dialog filter-dialog__account"
                      title="Filter by"
                      closePortal={this.closeDialog}
                    >
                      <button
                        className="close-dialog"
                        onClick={this.closeDialog}
                      >
                        <i className="icon-close" />
                      </button>
                      <div className="filter-bar">
                        <div className="select-wrapper">
                          <div className="form-group flex--helper form-group__pseudo--3">
                            <AutoField
                              labelHidden={true}
                              name="type"
                              options={typeOptions}
                              placeholder="Type"
                            />
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
              )}
              {tags.length ? <Tags tags={tags} /> : null}
            </div>
          </div>
        </div>
        {filter && <FilterBar options={options} />}
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
          icons.map((element, index) => {
            return (
              <button onClick={element.method} key={index}>
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
  name: {
    type: String,
    optional: true,
    label: "Search by report name"
  },
  type: {
    type: String,
    label: "Search by report type",
    allowedValues
  }
});
