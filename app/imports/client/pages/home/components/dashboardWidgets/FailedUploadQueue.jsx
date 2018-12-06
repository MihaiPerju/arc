import React from "react";
import DashboardListItem from "../DashboardListItem";
import Loading from "../../../../lib/ui/Loading";
import Notifier from "../../../../lib/Notifier";


export default class FailedUploadQueue extends React.Component {

  state = {
    isLoadingFiles: false,
    files: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getFailedFiles(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getFailedFiles(filters);
  }

  getFailedFiles(filters) {
    this.setState({ isLoadingFiles: true });
    setTimeout(() => {
      Meteor.call("failedFiles.get", filters.selectedClientId, filters.selectedFacilityId, (err, responseData) => {
        if (!err) {
          this.setState({ files: responseData, isLoadingFiles: false });
        } else {
          this.setState({ isLoadingFiles: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }


  render() {
    const { isLoadingFiles, files } = this.state;
    if (!isLoadingFiles) {
      return (
        <div className={files.length > 0 ? '' : 'dashboard-content-center'}>
          {
            files.length > 0 ?
              files.map(file => { return <DashboardListItem key={`file-${file._id}`} data={file} />; })
              : <div className="dashboard-empty-content">
                No files has been found.
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
}