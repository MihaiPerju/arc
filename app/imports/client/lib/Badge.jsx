import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";

class Badge extends Component {
  render() {
    const { counter } = this.props;
    return (
      <div>
        {counter > 0 && <div className="badge text-center">{counter}</div>}
      </div>
    );
  }
}

export default (BadgeCountContainer = withTracker(({ label }) => {
  let countHandle;
  let loading;
  let counter;

  if (label === "Unassigned") {
    countHandle = Meteor.subscribe("unassignedAccounts");
    loading = !countHandle.ready();
    counter = Counter.get("unassignedAccounts");
  }

  if (label === "Tickles") {
    countHandle = Meteor.subscribe("tickledAccounts", Meteor.userId());
    loading = !countHandle.ready();
    counter = Counter.get("tickledAccounts");
  }

  if (label === "Escalations") {
    countHandle = Meteor.subscribe("escalatedAccounts", Meteor.userId());
    loading = !countHandle.ready();
    counter = Counter.get("escalatedAccounts");
  }
  if (label === "Flagged") {
    countHandle = Meteor.subscribe("flaggedAccounts", Meteor.userId());
    loading = !countHandle.ready();
    counter = Counter.get("flaggedAccounts");
  }
  return {
    loading,
    counter
  };
})(Badge));
