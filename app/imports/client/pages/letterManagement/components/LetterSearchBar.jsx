import React, { Component } from "react";
import { AutoForm, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import query from "/imports/api/letters/queries/letterList.js";

export default class LetterSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      letters: []
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
  }

  onSubmit(params) {
    if (FlowRouter.current().queryParams.page != "1" && "letterIds" in params) {
      this.props.setPagerInitial();
    }
    if ("letterIds" in params) {
      FlowRouter.setQueryParams({
        letterIds: params.letterIds
      });
    }
  }

  getOptions = letters => {
    return _.map(letters, letter => ({
      value: letter._id,
      label: letter.letterTemplate.name
    }));
  };

  render() {
    const { letters } = this.state;
    const options = this.getOptions(letters);
    const model = { letterIds: FlowRouter.getQueryParam("letterIds") } || {
      letterIds: []
    };

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
  }
});
