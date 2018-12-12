import React from "react";
import Loading from "../../../../lib/ui/Loading";
import Notifier from "../../../../lib/Notifier";

export default class BulkActionRequestQueue extends React.Component {

  state = {
    isLoadingBulkActionQueues: false,
    bulkActionQueues: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getBulkActionRequestQueues(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getBulkActionRequestQueues(filters);
  }


  getBulkActionRequestQueues(filters) {
    this.setState({ isLoadingBulkActionQueues: true });
    setTimeout(() => {
      Meteor.call("bulkActionRequestQueue.get", filters.selectedClientId, '', (err, responseData) => {
        if (!err) {
          this.setState({ bulkActionQueues: responseData, isLoadingBulkActionQueues: false });
        } else {
          this.setState({ isLoadingBulkActionQueues: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  render() {
    const { isLoadingBulkActionQueues, bulkActionQueues } = this.state;
    if (!isLoadingBulkActionQueues) {
      return (
        <div className={bulkActionQueues.length > 0 ? '' : 'dashboard-content-center'}>
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
      return (
        <div className="dashboard-content-center">
          <Loading />
        </div>
      );
    }
  }
}