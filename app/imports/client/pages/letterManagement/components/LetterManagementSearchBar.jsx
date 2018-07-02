import React, { Component } from "react";
import { AutoForm, AutoField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import FilterBar from "/imports/client/lib/FilterBar.jsx";
import Dropdown from "/imports/client/lib/Dropdown";
import classNames from "classnames";
import Dialog from "/imports/client/lib/ui/Dialog";

export default class LetterManagementSearchBar extends Component {
  onSubmit(params) {
    if (
      FlowRouter.current().queryParams.page != "1" &&
      "letterName" in params
    ) {
      this.props.setPagerInitial();
    }
    if ("letterName" in params) {
      FlowRouter.setQueryParams({
        letterName: params.letterName
      });
    }
  }
  render() {
    return (
      <AutoForm
        autosave
        autosaveDelay={500}
        ref="filters"
        onSubmit={this.onSubmit.bind(this)}
        schema={schema}
      >
        <div className="search-bar">
          <div className="search-bar__wrapper flex--helper">
            <div className="search-input">
              <div className="form-group">
                <AutoField
                  labelHidden={true}
                  name="letterName"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </div>
      </AutoForm>
    );
  }
}

const schema = new SimpleSchema({
  letterName: {
    type: String,
    optional: true,
    label: "Search by letter template name"
  }
});
