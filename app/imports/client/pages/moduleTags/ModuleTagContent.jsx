import React, { Component } from "react";
import ModuleTagHeader from "./components/ModuleTagContent/ModuleTagHeader";
import ModuleTagEdit from "./ModuleTagEdit";

export default class ModuleTagContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ edit: false });
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { edit } = this.state;
    const { tag } = this.props;

    return (
      <div className="main-content tag-content">
        {edit ? (
          <ModuleTagEdit setEdit={this.setEdit} tag={tag} />
        ) : (
          <ModuleTagHeader setEdit={this.setEdit} tag={tag} />
        )}
      </div>
    );
  }
}
