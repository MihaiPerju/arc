import React from "react";
import { REP } from "../enums/widgetType";

export default class DashboardListItem extends React.Component {

  render() {
    const { data, type } = this.props;
    switch (type) {
      case REP.ASSIGNED_ME:
        return (
          <div key={`file-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.ptName}</div>
              <div className="dashboard-list-item-sub-title">{data.ptType}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right">Acct # {data.acctNum}</div>
              <div className="dashboard-list-item-right-label">Status - {data.state}</div>
            </div>
          </div>
        );
        break;
    }

  }
}