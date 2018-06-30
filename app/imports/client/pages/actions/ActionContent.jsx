import React, { Component } from "react";
import ActionHeader from "./components/ActionContentHeader";
import ActionEdit from "./ActionEdit";

export default class ActionContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
  }

  componentWillMount() {
    const { id } = FlowRouter.current().params;
    if (id) {
      this.setEdit();
    }
  }

  componentWillReceiveProps() {
    // this.setState({ edit: false });
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { action, substates } = this.props;
    const { edit } = this.state;
    return (
      <div className="section-action">
        {edit ? (
          <ActionEdit
            setEdit={this.setEdit}
            substates={substates}
            action={action}
          />
        ) : (
          <ActionHeader
            setEdit={this.setEdit}
            substates={substates}
            action={action}
          />
        )}
      </div>
    );
  }
}
