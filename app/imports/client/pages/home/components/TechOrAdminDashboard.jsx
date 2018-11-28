import React from "react";
import Notifier from "../../../lib/Notifier";
import FailedUploadQueue from "./dashboardWidgets/FailedUploadQueue";
import BulkActionRequestQueue from "./dashboardWidgets/BulkActionRequestQueue";
import pages from "../../../../api/settings/enums/settings";

export default class TechOrAdminDashboard extends React.Component {

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

  render() {
    const { widgetSettings } = this.state;
    const { filters } = this.props;
    return (
      <div className="dashboard-row full-width">
        {
          (widgetSettings && widgetSettings.failedUploadQueue) &&
          <div className="dashboard-section">
            <div className="dashboard-section-header m-t--5">
              <div className="dashboard-section-title">
                Failed Upload Queue
            </div>
            </div>
            <div className="dashboard-section-content">
              {
                <FailedUploadQueue filters={filters} />
              }
            </div>
          </div>
        }
        {
          (widgetSettings && widgetSettings.bulkActionRequestQueue) &&
          <div className="dashboard-section">
            <div className="dashboard-section-header m-t--5  m-l-5">
              <div className="dashboard-section-title">
                Bulk Action Request Queue
            </div>
            </div>
            <div className="dashboard-section-content m-l-5">
              {
                <BulkActionRequestQueue filters={filters} />
              }
            </div>
          </div>
        }
      </div>
    );
  }
}