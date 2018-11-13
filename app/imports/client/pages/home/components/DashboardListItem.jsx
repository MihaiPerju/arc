import React from "react";

export default class DashboardListItem extends React.Component {


  render() {
    const { file } = this.props;
    return (
      <div key={`file-${file._id}`} className="dashboard-list-item">
        <div className="dashboard-list-item-left-content">
          <div className="dashboard-list-item-title">{file.fileName}</div>
          <div className="dashboard-list-item-sub-title">{file.type}</div>
        </div>
        <div className="dashboard-list-item-right-content">
          <div className="text--right">{file.corruptRows.length}</div>
          <div className="dashboard-list-item-right-label">Corrupted rows</div>
        </div>
      </div>
    );
  }
}