import AccountActions from "./collection";
import Actions from "/imports/api/actions/collection";
import Users from "/imports/api/users/collection";

AccountActions.addLinks({
  action: {
    type: "one",
    collection: Actions,
    field: "actionId"
  },
  user: {
    type: "one",
    collection: Users,
    field: "userId"
  }
});
