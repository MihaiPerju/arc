import React, { Component } from "react";
import Accounts from "/imports/api/accounts/collection";
import { withTracker } from "meteor/react-meteor-data";

class Badge extends Component {
  render() {
    console.log(this.props);
    return <div className="badge text-center" />;
  }
}

export default (BadgeCountContainer = withTracker(() => {
  const countHandle = Meteor.subscribe("countAccounts");
  console.log(countHandle);
  const loading = !countHandle.ready();
  const counter = Accounts.find().count();
  return {
    loading,
    counter
  };
})(Badge));
