import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import pages from "../../../../api/settings/enums/settings";
import Loading from "../../../lib/ui/Loading";
import TurnTime from "./dashboardWidgets/TurnTime";
import ClientStatistics from "./dashboardWidgets/ClientStatistics";

export default class ManagerDashboard extends React.Component {

  state = {
    widgetSettings: null,
    isLoading: true
  };

  componentWillMount() {
    this.getManagerWidgetSettings();
  }


  getManagerWidgetSettings() {
    this.setState({ isLoading: true });
    Meteor.call("managerSettings.get", pages.WIDGET_SETTINGS, (err, responseData) => {
      if (!err) {
        this.setState({
          widgetSettings: responseData ? responseData.widgetSetting : undefined,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
        Notifier.error(err.reason);
      }
    });
  }

  renderWidgets() {
    const { filters } = this.props;
    return (
      <div>
        <ClientStatistics filters={filters} />
        <TurnTime filters={filters} />
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        {
          !isLoading ?
            this.renderWidgets() :
            <div className="dashboard-content-center">
              <Loading />
            </div>
        }
      </div>
    );
  }
}