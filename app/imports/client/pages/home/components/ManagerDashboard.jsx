import React from "react";
import Loading from "../../../../client/lib/ui/Loading";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";

export default class ManagerDashboard extends React.Component {


  renderAssignedAccounts() {
    const { data } = this.props;
    if (!data.isLoadingAssignedAccounts) {
      return (
        <div className={data.assignedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            data.assignedAccounts.length > 0 ?
              data.assignedAccounts.map(account => {
                return (<div key={`file-${account._id}`} className="dashboard-list-item">
                  <div className="dashboard-list-item-left-content">
                    <div className="dashboard-list-item-title">{account.ptName}</div>
                    <div className="dashboard-list-item-sub-title">{account.ptType}</div>
                  </div>
                  <div className="dashboard-list-item-right-content">
                    <div className="text--right">{account.state}</div>
                    <div className="dashboard-list-item-right-label">Status</div>
                  </div>
                </div>);
              })
              : <div className="dashboard-empty-content">
                No assigned accounts has been found.
            </div>
          }
        </div>
      );
    } else {
      return (
        <div className="dashboard-content-center">
          <Loading />
        </div>
      );
    }
  }

  renderArchivedAccounts() {
    const { data } = this.props;
    if (!data.isLoadingAssignedAccounts) {
      return (
        <div className={data.assignedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            data.assignedAccounts.length > 0 ?
              data.assignedAccounts.map(account => {
                return (<div key={`file-${account._id}`} className="dashboard-list-item">
                  <div className="dashboard-list-item-left-content">
                    <div className="dashboard-list-item-title">{account.ptName}</div>
                    <div className="dashboard-list-item-sub-title">{account.ptType}</div>
                  </div>
                  <div className="dashboard-list-item-right-content">
                    <div className="text--right">{account.state}</div>
                    <div className="dashboard-list-item-right-label">Status</div>
                  </div>
                </div>);
              })
              : <div className="dashboard-empty-content">
                No archived accounts has been found.
            </div>
          }
        </div>
      );
    } else {
      return (
        <div className="dashboard-content-center">
          <Loading />
        </div>
      );
    }
  }

  renderLineGraph() {
    const { data } = this.props;
    const options = {
      chart: {
        type: "line",
        width: 640
      },
      xAxis: {
        title: { text: "Hours" }
      },
      yAxis: {
        title: { text: "Number of Actions" }
      },
      title: {
        text: "Accounts"
      },
      series: [
        {
          name: "Actions per hour",
          data: data.chartData
        }
      ]
    };
    if (!data.isLoadingLineGraph) {
      return (
        // <div className="m-t--20">
        <div>
          <ReactHighcharts highcharts={Highcharts} options={options} />
        </div>
        // </div>
      );
    } else {
      return (
        <div className="dashboard-content-center">
          <Loading />
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="dashboard-row">
          <div className="dashboard-section">
            <div className="dashboard-section-header m-t--5">
              <div className="dashboard-section-title">
                Assigned Accounts List
            </div>
            </div>
            <div className="dashboard-section-content">
              {
                this.renderAssignedAccounts()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-header m-t--5 m-l-5">
              <div className="dashboard-section-title">
                Assigned Accounts Graph
            </div>
            </div>
            <div className="dashboard-section-content m-l-5">
              {
                this.renderLineGraph()
              }
            </div>
          </div>
        </div>
        <div className="dashboard-row">
          <div className="dashboard-section">
            <div className="dashboard-section-header m-t--5">
              <div className="dashboard-section-title">
                Archived Accounts List
            </div>
            </div>
            <div className="dashboard-section-content">
              {
                this.renderArchivedAccounts()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-header m-t--5 m-l-5">
              <div className="dashboard-section-title">
                Archived Accounts Graph
            </div>
            </div>
            <div className="dashboard-section-content m-l-5">
              {
                this.renderLineGraph()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}