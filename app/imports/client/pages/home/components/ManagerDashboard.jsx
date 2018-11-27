import React from "react";

import AssignedAccounts from "./dashboardWidgets/AssignedAccounts";
import ArchivedAccounts from "./dashboardWidgets/ArchivedAccounts";
import BuiltReports from "./dashboardWidgets/BuiltReports";
import GeneratedReports from "./dashboardWidgets/GeneratedReports";
import SentReports from "./dashboardWidgets/SentReports";
import EscalationResolved from "./dashboardWidgets/EscalationResolved";
import NotificationWidget from "./dashboardWidgets/NotificationWidget";

export default class ManagerDashboard extends React.Component {

  render() {
    const { filters } = this.props;
    return (
      <div className="m-b--25">
        <NotificationWidget filters={filters} />
        <AssignedAccounts filters={filters} />
        <ArchivedAccounts filters={filters} />
        <BuiltReports filters={filters} />
        <GeneratedReports filters={filters} />
        <SentReports filters={filters} />
        <EscalationResolved filters={filters} />

      </div>
    );
  }
}