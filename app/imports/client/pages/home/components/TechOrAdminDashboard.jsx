import React from "react";
import DashboardListItem from "./DashboardListItem";
import Loading from "../../../../client/lib/ui/Loading";

export default class TechOrAdminDashboard extends React.Component {


  renderFailedUploadQueues(files, isLoadingFiles) {
    if (!isLoadingFiles) {
      return (
        <div>
          {
            files.length > 0 ?
              files.map(file => { return <DashboardListItem key={`file-${file._id}`} file={file} />; })
              : <div className="dashboard-empty-content">
                No files has been found.
            </div>
          }
        </div>
      );
    } else {
      return <Loading />;
    }
  }

  renderBulkActionRequestQueues() {
    const { isLoadingBulkActionQueues, bulkActionQueues } = this.props;
    if (!isLoadingBulkActionQueues) {
      return (
        <div>
          {
            bulkActionQueues.length > 0 ?
              bulkActionQueues.map(action => {
                return (
                  <div key={`file-${action._id}`} className="dashboard-list-item">
                    <div className="dashboard-list-item-left-content">
                      <div className="dashboard-list-item-title">FIAS</div>
                      <div className="dashboard-list-item-sub-title">{action.type}</div>
                    </div>
                  </div>
                );
              })
              : <div className="dashboard-empty-content">
                No bulk actions has been found.
            </div>
          }
        </div>
      );
    } else {
      return <Loading />;
    }
  }

  render() {
    const { files, isLoadingFiles } = this.props;
    return (
      <div className="dashboard-row">
        <div className="dashboard-section">
          <div className="dashboard-section-header m-t--5">
            <div className="dashboard-section-title">
              Failed Upload Queue
            </div>
          </div>
          <div className="dashboard-section-content">
            {
              this.renderFailedUploadQueues(files, isLoadingFiles)
            }
          </div>
        </div>
        <div className="dashboard-section">
          <div className="dashboard-section-header m-t--5  m-l-5">
            <div className="dashboard-section-title">
              Bulk Action Request Queue
            </div>
          </div>
          <div className="dashboard-section-content m-l-5">
            {
              this.renderBulkActionRequestQueues()
            }
          </div>
        </div>
      </div>
    );
  }
}