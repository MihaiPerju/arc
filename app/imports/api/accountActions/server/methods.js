import AccountActionsService from "/imports/api/accountActions/server/services/AccountActionsService";

Meteor.methods({
  "accountActions.get"(params) {
    return AccountActionsService.getActions(params);
  }
});
