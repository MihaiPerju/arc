import React, {Component} from "react";
import {AutoForm, AutoField} from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Dropdown from "/imports/client/lib/Dropdown";
import Tags from "/imports/client/lib/Tags";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";

export default class ActionSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
      dropdown: false,
      selectAll: false,
      model: {},
      dialogIsActive: false
    };
  }

  componentWillMount() {
    this.getFilterParams();
  }

  onSubmit(params) {
    if (FlowRouter.current().queryParams.page != "1" && "title" in params) {
      this.props.setPagerInitial();
    }

    if ("title" in params) {
      FlowRouter.setQueryParams({title: params.title});
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
    const {selectAll} = this.state;
    this.setState({
      selectAll: !selectAll
    });
  };

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("title" in queryParams) {
      model.title = queryParams.title;
    }

    this.setState({model});
  };

  render() {
    const {
      dropdown,
      selectAll,
      model
    } = this.state;
    const {
      options,
      btnGroup,
      deleteAction,
      dropdownOptions,
      icons,
      getProperAccounts,
      hideSort,
      hideFilter,
      moduleTags
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
              <div className={btnSelectClasses} onClick={this.selectAll}/>
              <div className="btn-toggle-dropdown" onClick={this.openDropdown}>
                <i className="icon-angle-down"/>
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
                  name="title"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="filter-block">
              {!hideFilter && (
                <button>
                  <i className="icon-filter"/>
                </button>
              )}
              {
                moduleTags.length > 0 && <Tags moduleTags={moduleTags}/>
              }
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
      this.setState({in: true});
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
    const {deleteAction, icons} = this.props;
    const {dialogIsActive} = this.state;
    const btnClasses = classNames("btn-group flex--helper", {
      in: this.state.in
    });

    return (
      <div className={btnClasses}>
        {icons ? (
          icons.map(element => {
            return (
              <button onClick={element.method}>
                <i className={"icon-" + element.icon}/>
              </button>
            );
          })
        ) : (
          <button>
            <i className="icon-archive"/>
          </button>
        )}
        {deleteAction && (
          <button onClick={this.deleteAction}>
            <i className="icon-trash-o"/>
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
  title: {
    type: String,
    optional: true,
    label: "Search by action title name"
  }
});
