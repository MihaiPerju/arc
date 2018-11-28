import React from "react";
import Notifier from "../../../lib/Notifier";
import AssignedToMe from "./dashboardWidgets/AssignedToMe";
import CompletedAccounts from "./dashboardWidgets/CompletedAccounts";
import pages from "../../../../api/settings/enums/settings";
import Loading from "../../../lib/ui/Loading";

export default class UserDashboard extends React.Component {

  state = { widgetSettings: null, isLoading: true };

  componentWillMount() {
    this.getWidgetSettings()
  }

  getWidgetSettings() {
    this.setState({ isLoading: true });
    Meteor.call("managerSettings.get", pages.WIDGET_SETTINGS, (err, responseData) => {
      if (!err) {
        this.setState({
          widgetSettings: responseData.widgetSetting,
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
    const { widgetSettings } = this.state;
    if (widgetSettings) {
      return (
        <div className="m-b--25">
          {widgetSettings.assignedToMe && <AssignedToMe filters={filters} />}
          {widgetSettings.completed && <CompletedAccounts filters={filters} />}
        </div>
      );
    }
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