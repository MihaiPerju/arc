import React, { Component } from "react";
import { AutoField, ErrorField } from "/imports/ui/forms";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/rules/queries/listRules";

class PriorityGetter extends Component {
  constructor() {
    super();
  }

  componentWillReceiveProps = props => {
    const { data } = props;
    if (data && data.priority) {
      this.props.setPriority(data.priority + 1);
    }
  };

  render() {
    return <div />;
  }
}

export default withQuery(
  props => {
    return query.clone({
      limit: 1,
      options: {
        sort: { priority: -1 }
      }
    });
  },
  { reactive: true, single: true }
)(PriorityGetter);
