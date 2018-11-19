import React from "react";
import { ManagerWidgets } from '../enums/widgetType';

export default class DashboardListItem extends React.Component {


  render() {
    const { data, type } = this.props;
    switch (type) {
      case ManagerWidgets.ASSIGNED_ACCOUNTS:
        return (
          <div key={`archived-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.ptName}</div>
              <div className="dashboard-list-item-sub-title">{data.ptType}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right">{data.state}</div>
              <div className="dashboard-list-item-right-label">Status</div>
            </div>
          </div>
        );
      case ManagerWidgets.ARCHIVED_ACCOUNTS:
        return (
          <div key={`assigned-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.ptName}</div>
              <div className="dashboard-list-item-sub-title">{data.ptType}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right">{data.state}</div>
              <div className="dashboard-list-item-right-label">Status</div>
            </div>
          </div>
        );
      default:
        return null;
    }

  }
}