import React from "react";
import AssignedToMe from "./dashboardWidgets/AssignedToMe";
import CompletedAccounts from "./dashboardWidgets/CompletedAccounts";

export default class UserDashboard extends React.Component {

  render() {
    const { filters } = this.props;
    return (
      <div className="m-b--25">
        <AssignedToMe filters={filters} />
        <CompletedAccounts filters={filters} />
      </div>
    );
  }
}