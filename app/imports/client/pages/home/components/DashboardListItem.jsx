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
          <div key={`archived-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.ptName}</div>
              <div className="dashboard-list-item-sub-title">{data.ptType}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right font-bold">{data.acctNum}</div>
              <div className="dashboard-list-item-right-label">Account #</div>
            </div>
          </div>
        );
      case ManagerWidgets.REPORTS_BUILT:
        return (
          <div key={`reports-b-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.name}</div>
              <div className="dashboard-list-item-sub-title">{data.type}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right">{`${data.user.profile.firstName + ' ' + data.user.profile.lastName}`}</div>
              <div className="dashboard-list-item-right-label">Author</div>
            </div>
          </div>
        );
      case ManagerWidgets.REPORTS_GENERATED:
        return (
          <div key={`reports-g-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.name}</div>
              <div className="dashboard-list-item-sub-title">{data.type}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right">{`${data.user.profile.firstName + ' ' + data.user.profile.lastName}`}</div>
              <div className="dashboard-list-item-right-label">Author (Manager)</div>
            </div>
          </div>
        );
      case ManagerWidgets.REPORTS_SENT:
        return (
          <div key={`reports-s-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.name}</div>
              <div className="dashboard-list-item-sub-title">{data.type}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right">{`${data.user.profile.firstName + ' ' + data.user.profile.lastName}`}</div>
              <div className="dashboard-list-item-right-label">Author</div>
            </div>
          </div>
        );
      case ManagerWidgets.ESCALATION_RESOLVED:
        return (
          <div key={`archived-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.ptName}</div>
              <div className="dashboard-list-item-sub-title">{data.ptType}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right font-bold">{data.acctNum}</div>
              <div className="dashboard-list-item-right-label">Account #</div>
            </div>
          </div>
        );
      case ManagerWidgets.NOTIFICATIONS:
        return (
          <div key={`archived-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-sub-title"><span style={{ color: '#000' }}>{data.type}</span></div>
              <div className="dashboard-notification-message">{data.message}</div>  </div>
          </div>
        );
      case ManagerWidgets.FAILEDUPLOADQUEUES:
        return (
          <div key={`file-${data._id}`} className="dashboard-list-item">
            <div className="dashboard-list-item-left-content">
              <div className="dashboard-list-item-title">{data.fileName}</div>
              <div className="dashboard-list-item-sub-title">{data.type}</div>
            </div>
            <div className="dashboard-list-item-right-content">
              <div className="text--right">{data.corruptRows.length}</div>
              <div className="dashboard-list-item-right-label">Corrupted rows</div>
            </div>
          </div>
        );
      case ManagerWidgets.AGED_ACCOUNTS:
        return (
          <div key={`push-to-call-${data._id}`} className="small-widget-list-item">
            <div className="">
              <div className="small-widget-list-item-title">{data.clientName}</div>
              <div className="small-widget-list-item-sub-title">accounts - <b style={{ fontSize: '14px', color: '#00b700' }}>{data.agedAccountsPercentage}%</b></div>
            </div>
          </div>
        );
      case ManagerWidgets.PUSH_TO_CALL:
        return (
          <div key={`push-to-call-${data._id}`} className="small-widget-list-item">
            <div className="">
              <div className="small-widget-list-item-title">{data.clientName}</div>
              <div className="small-widget-list-item-sub-title">Ratio - <b style={{ fontSize: '14px', color: '#00b700' }}>{data.callActionsPercentage}%</b></div>
            </div>
          </div>
        );
      case ManagerWidgets.TURN_TIME:
        return (
          <div key={`turn-time-${data._id}`} className="small-widget-list-item">
            <div className="">
              <div className="small-widget-list-item-title">{data.clientName}</div>
              <div className="small-widget-list-item-sub-title">TurnTime - <b style={{ fontSize: '14px', color: '#00b700' }}>{data.turnTimeValue}%</b></div>
            </div>
          </div>
        );
      default:
        return null;
    }



  }
}