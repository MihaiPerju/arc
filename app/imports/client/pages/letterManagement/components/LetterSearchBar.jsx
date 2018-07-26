import React, {Component} from "react";
import {AutoForm, ErrorField} from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import query from "/imports/api/letters/queries/letterList.js";
import Tags from "/imports/client/lib/Tags";

export default class LetterSearchBar extends Component {
  constructor() {
    super();
    this.state = {
      letters: [],
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

    if ("letterIds" in params) {
      FlowRouter.setQueryParams({letterIds: params.letterIds});
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

    if ("letterIds" in queryParams) {
      model.letterIds = queryParams.letterIds;
    }

    this.setState({model});
  };

  render() {
    const {letters, model} = this.state;
    const {hideFilter, moduleTags} = this.props;
    const options = this.getOptions(letters);

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
            <div style={{width: "100%"}} className="select-group">
              <div className="form-wrapper">
                <SelectMulti
                  className="form-select__multi"
                  placeholder="Select Letters"
                  labelHidden={true}
                  name="letterIds"
                  options={options}
                />
                <ErrorField name="letterIds"/>
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

const schema = new SimpleSchema({
  letterIds: {
    type: Array,
    optional: true
  },
  "letterIds.$": {
    type: String
  }
});
