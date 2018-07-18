import React, { Component } from "react";
import { AutoForm, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import query from "/imports/api/letters/queries/letterList.js";
import Dialog from "/imports/client/lib/ui/Dialog";
export default class LetterSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      letters: [],
      dialogIsActive: false,
      model: {}
    };
  }

  componentWillMount() {
    query.clone().fetch((err, letters) => {
      if (!err) {
        this.setState({
          letters
        });
      }
    });
    this.getFilterParams();
  }

  onSubmit(params) {
    if (FlowRouter.current().queryParams.page != "1" && "letterIds" in params) {
      this.props.setPagerInitial();
    }

    if ("tagIds" in params) {
      FlowRouter.setQueryParams({ tagIds: params.tagIds });
    }
  }

  getOptions = letters => {
    return _.map(letters, letter => ({
      value: letter._id,
      label: letter.letterTemplate.name
    }));
  };

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("tagIds" in queryParams) {
      model.tagIds = queryParams.tagIds;
    }

    if ("letterIds" in queryParams) {
      model.letterIds = queryParams.letterIds;
    }

    this.setState({ model });
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
    if (field === "letterIds") {
      FlowRouter.setQueryParams({ letterIds: value });
    }
  };

  getTagOptions = tags => {
    return _.map(tags, tag => ({
      value: tag._id,
      label: tag.name
    }));
  };

  render() {
    const { letters, model, dialogIsActive } = this.state;
    const { moduleTags } = this.props;
    const options = this.getOptions(letters);

    const tagOptions = this.getTagOptions(moduleTags);

    return (
      <AutoForm
        ref="filters"
        onSubmit={this.onSubmit.bind(this)}
        schema={schema}
        model={model}
        onChange={this.onChange}
      >
        <div className="search-bar">
          <div className="search-bar__wrapper flex--helper">
            <div style={{ width: "100%" }} className="select-group">
              <div className="form-wrapper">
                <SelectMulti
                  className="form-select__multi"
                  placeholder="Select Letters"
                  labelHidden={true}
                  name="letterIds"
                  options={options}
                />
                <ErrorField name="letterIds" />
              </div>
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
                      <div className="form-group">
                        <SelectMulti
                          className="form-select__multi"
                          placeholder="Select modules"
                          labelHidden={true}
                          name="tagIds"
                          options={tagOptions}
                        />
                      </div>
                      <div className="flex--helper flex-justify--end">
                        <button className="btn--blue" onClick={this.addFilters}>
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
      </AutoForm>
    );
  }
}

const schema = new SimpleSchema({
  letterIds: {
    type: Array,
    optional: true
  },
  "letterIds.$": {
    type: String
  },
  tagIds: {
    type: Array,
    optional: true,
    defaultValue: []
  },
  "tagIds.$": {
    type: String
  }
});
