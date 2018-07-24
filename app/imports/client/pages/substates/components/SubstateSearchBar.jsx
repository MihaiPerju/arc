import React, { Component } from "react";
import { AutoForm, AutoField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";

export default class SubstateSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      dropdown: false,
      selectAll: false,
      model: {}
    };
  }

  componentWillMount() {
    this.getFilterParams();
  }

  onSubmit(params) {
    if (FlowRouter.current().queryParams.page != "1") {
      this.props.setPagerInitial();
    }

    if ("stateName" in params) {
      FlowRouter.setQueryParams({ stateName: params.stateName });
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

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("stateName" in queryParams) {
      model.stateName = queryParams.stateName;
    }

    this.setState({ model });
  };

  render() {
    const {
      dropdown,
      selectAll,
      model
    } = this.state;
    const {
      btnGroup,
      deleteAction,
      dropdownOptions,
      icons,
      getProperAccounts,
      hideSort,
      hideFilter
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
        autosave
        autosaveDelay={500}
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
                  name="stateName"
                  placeholder="Search by State"
                />
              </div>
            </div>

            {!hideFilter && (
              <div className="filter-block">
                <button>
                  <i className="icon-filter" />
                </button>
              </div>
            )}
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
  stateName: {
    type: String,
    optional: true,
    label: "Search by State name"
  }
});
