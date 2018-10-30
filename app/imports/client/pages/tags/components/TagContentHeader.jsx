import React, { Component } from "react";

export default class TagContentHeader extends Component {
  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  renderTag(moduleName) {
    return <div className="tag-item-with-bg">{moduleName}</div>;
  }

  render() {
    const { tag } = this.props;

    return (
      <div className="main-content__header header-block">
        <div className="row__header tag-header">
          <div className="title left">{tag.name}</div>
          <div className="btn-group right">
            <button onClick={this.onEdit} className="btn--white">
              Edit tag
            </button>
          </div>
        </div>
        <div className="row__header">
          <div className="text-light-grey">
            <div className="tag-module">Tagged modules </div>
            <div className="tag-inner-div">
              {tag && tag.entities.length > 0 ? (
                tag.entities.map(name => this.renderTag(name))
              ) : (
                <label className="no-tags-found">No tag modules found.</label>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
