import React, { Component } from "react";

export default class ModuleTagHeader extends Component {
  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  render() {
    const { tag } = this.props;

    return (
      <div className="main-content__header header-block">
        <div className="row__header">
          <div className="text-light-grey">Tag name</div>
          <div className="title">{tag.name}</div>
          <br />
          <div className="text-light-grey">
            <span>Tagged modules: </span>
            <b>{tag.entities.toString()}</b>
          </div>
        </div>
        <div className="row__header">
          <div className="btn-group">
            <button onClick={this.onEdit} className="btn--white">
              Edit tag
            </button>
          </div>
        </div>
      </div>
    );
  }
}
