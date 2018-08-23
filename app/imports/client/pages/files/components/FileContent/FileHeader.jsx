import React, { Component } from "react";

export default class ReportHeader extends Component {
  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  render() {
    const { file } = this.props;
    return (
      <div className="main-content__header header-block">
        <div className="row__header">
          <div className="text-light-grey">File name</div>
          <div className="title">{file.fileName}</div>
        </div>
        <div className="row__header">
          <div className="btn-group">
            <button onClick={this.onEdit} className="btn--white">
              Edit File
            </button>
          </div>
        </div>
      </div>
    );
  }
}
