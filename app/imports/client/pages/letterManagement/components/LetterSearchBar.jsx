import React, { Component } from "react";
import { AutoForm, AutoField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Tags from "/imports/client/lib/Tags";

export default class LetterSearchBar extends Component {
  constructor() {
    super();
    this.state = {
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
    if ("letterTemplateName" in params) {
      FlowRouter.setQueryParams({
        letterTemplateName: params.letterTemplateName
      });
    }
  }

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("letterTemplateName" in queryParams) {
      model.letterTemplateName = queryParams.letterTemplateName;
    }

    this.setState({model});
  };

  render() {
    const { model } = this.state;
    const { hideFilter, tags } = this.props;

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
          <AutoField
            labelHidden={true}
            name="letterTemplateName"
            placeholder="Search"
          />
          <div className="filter-block">
            {!hideFilter && (
              <button>
                <i className="icon-filter" />
              </button>
            )}
            {tags.length ? <Tags tags={tags} /> : <div />}
          </div>
        </div>
      </AutoForm>
    );
  }
}

const schema = new SimpleSchema({
  letterTemplateName: {
    type: String,
    optional: true,
    label: "Search by letter template name"
  }
});
