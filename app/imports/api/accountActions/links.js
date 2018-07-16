import AccountActions from "./collection";
import Actions from "/imports/api/actions/collection";
import Users from "/imports/api/users/collection";
import LetterTemplates from "/imports/api/letterTemplates/collection";
import Accounts from "/imports/api/accounts/collection";

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
  },
  letterTemplate: {
    type: "one",
    collection: LetterTemplates,
    field: "letterTemplateId"
  },
  flagAction: {
    type: "one",
    collection: AccountActions,
    field: "flagActionId"
  },
  manager: {
    type: "one",
    collection: Users,
    field: "managerId"
  },
  account: {
    type: "one",
    collection: Accounts,
    field: "accountId"
  }
});
