import Accounts from "/imports/api/accounts/collection";

var counter = new Counter("countAccounts", Accounts.find({}));

Meteor.publish("countAccounts", function() {
  return counter;
});
