import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import AssignedAccounts from "./dashboardWidgets/AssignedAccounts";
import ArchivedAccounts from "./dashboardWidgets/ArchivedAccounts";
import BuiltReports from "./dashboardWidgets/BuiltReports";
import GeneratedReports from "./dashboardWidgets/GeneratedReports";
import SentReports from "./dashboardWidgets/SentReports";
import EscalationResolved from "./dashboardWidgets/EscalationResolved";
import NotificationWidget from "./dashboardWidgets/NotificationWidget";
import pages from "../../../../api/settings/enums/settings";
import Loading from "../../../lib/ui/Loading";
import AgedAccounts from "./dashboardWidgets/AgedAccounts";

export default class ManagerDashboard extends React.Component {


  state = { widgetSettings: null, isLoading: true };

  componentWillMount() {
    this.getManagerWidgetSettings()
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
    const { widgetSettings } = this.state;
    if (widgetSettings) {
      return (
        <div className="m-b--25">
          <AgedAccounts filters={filters} />
          {widgetSettings.new_alert && <NotificationWidget filters={filters} />}
          {widgetSettings.account_assigned && <AssignedAccounts filters={filters} />}
          {widgetSettings.account_archived && <ArchivedAccounts filters={filters} />}
          {widgetSettings.reports_built && <BuiltReports filters={filters} />}
          {widgetSettings.report_generated && <GeneratedReports filters={filters} />}
          {widgetSettings.report_sent && <SentReports filters={filters} />}
          {widgetSettings.escalation_resolved && <EscalationResolved filters={filters} />}
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