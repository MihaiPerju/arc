import React, { Component } from "react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import { Timeline, TimelineEvent } from "react-event-timeline";
import moment from "moment";
import facilityQuery from "/imports/api/facilities/queries/facilityList";
import Loading from "/imports/client/lib/ui/Loading";

class ClientTimeline extends Component {
  getCsvActions = () => {
    const { data } = this.props;
    let csvActions = [];
    data.map(action => {
      csvActions = csvActions.concat(action.csvFiles);
    });
    return csvActions;
  };

  getFileName = (fileName) => {
    return fileName ? `${fileName.split(".")[0]}.csv` : "";
  }

  render() {
    const { isLoading, error } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }
    const csvActions = this.getCsvActions();

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">File uploads timeline</div>
        </div>
        {csvActions.length > 0 && (
          <Timeline>
            {csvActions.map((action, index) => {
              return (
                <TimelineEvent
                  key={index}
                  createdAt={moment(action.createdAt).format(
                    "MMMM Do YYYY, hh:mm a"
                  )}
                  icon={<i className="icon-file-text-o"/>}
                  iconColor="#3370b5"
                >
                  <p>{this.getFileName(action.fileName)}</p>
                </TimelineEvent>
              );
            })}
          </Timeline>
        )}
      </div>
    );
  }
}

export default withQuery(
  props => {
    const { client } = props;
    const { _id } = client;
    return facilityQuery.clone({ filters: { clientId: _id } });
  },
  { reactive: true }
)(ClientTimeline);
