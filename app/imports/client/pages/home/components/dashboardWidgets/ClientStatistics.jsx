import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "../../../../lib/ui/Loading";

export default class ClientStatistics extends React.Component {

  state = {
    isLoadingClientStatistics: false,
    clientStatistics: []
  };

  componentWillMount() {
    const { filters } = this.props;
    this.getClientStatistics(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getClientStatistics(filters);
  }

  getClientStatistics(filters) {
    this.setState({ isLoadingClientStatistics: true });
    setTimeout(() => {
      this.setState({ isLoadingClientStatistics: false });
      Meteor.call("clients.getStatistics", filters.selectedClientId, (err, responseData) => {
        if (!err) {
          this.setState({ clientStatistics: responseData, isLoadingClientStatistics: false });
        } else {
          this.setState({ isLoadingClientStatistics: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderStatisticsWidget(client) {
    let stats = client.statistics;
    if (stats) {
      return (
        <div className="stats-section">
          <div className="client-name">
            {client.clientName}
          </div>
          <div className="stats-section-item">
            <div className="stats-content">
              <div className="stats-title">
                <span className="stats-icon"><span className="menu__icon"><i className="icon-users" style={{ fontSize: '12px' }}></i></span>
                </span>Total Inventory</div>
              <div className="stats-count">{stats.totalInventory}</div>
            </div>
            <span className="stats-left-border"></span>
          </div>
          <div className="stats-section-item">
            <div className="stats-content">
              <div className="stats-title">
                <span className="stats-icon"><span className="menu__icon"><i className="icon-user"></i></span></span>
                New Accounts
              </div>
              <div className="stats-count">{stats.newAccounts}</div>
            </div>
            <span className="stats-left-border"></span>
          </div>
          <div className="stats-section-item">
            <div className="stats-content">
              <div className="stats-title">
                <span className="stats-icon"><span className="menu__icon"><i className="icon-info"></i></span></span>
                Escalations Resolved
              </div>
              <div className="stats-count">{stats.escalations.resolved}</div>
            </div>
            <span className="stats-left-border"></span>
          </div>
          <div className="stats-section-item">
            <div className="stats-content">
              <div className="stats-title">
                <span className="stats-icon"><span className="menu__icon"><i className="icon-user"></i></span></span>
                Assigned Accounts
              </div>
              <div className="stats-count">{stats.assignedAccounts}</div>
            </div>
            <span className="stats-left-border"></span>
          </div>
          <div className="stats-section-item">
            <div className="stats-content">
              <div className="stats-title">
                <span className="stats-icon"><span className="menu__icon"><i className="icon-thumb-tack"></i></span></span>
                Resolved Accounts
              </div>
              <div className="stats-count">{stats.accountsResolved}</div>
            </div>
          </div>
        </div>

      );
    }
  }

  render() {
    const { clientStatistics } = this.state;
    return (
      <div>
        {
          this.state.isLoadingClientStatistics ?
            <div className="stats-container">
              <div className="stats-section">
                <Loading />
              </div>
            </div> :
            clientStatistics.length > 0 ?
              <div className="stats-container">
                {clientStatistics.map(c => this.renderStatisticsWidget(c))}
              </div> : null
        }
      </div>
    );
  }
}