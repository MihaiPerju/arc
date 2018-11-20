import React from "react";

import AssignedAccounts from "./dashboardWidgets/AssignedAccounts";
import ArchivedAccounts from "./dashboardWidgets/ArchivedAccounts";
import ReportsBuilt from "./dashboardWidgets/ReportsBuilt";

export default class ManagerDashboard extends React.Component {

  render() {
    const { filters } = this.props;
    return (
      <div>
        <AssignedAccounts filters={filters} />
        <ArchivedAccounts filters={filters} />
        <ReportsBuilt filters={filters} />
      </div>
    );
  }
}