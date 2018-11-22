import Accounts from "/imports/api/accounts/collection";
import Facilities from "/imports/api/facilities/collection";
import Users from "/imports/api/users/collection";
import Clients from "/imports/api/clients/collection";
import Uploads from "/imports/api/uploads/uploads/collection";
import AccountActions from "/imports/api/accountActions/collection";
import Tags from "/imports/api/tags/collection";

Accounts.addLinks({
  facility: {
    type: "one", 
    collection: Facilities,
    field: "facilityId"
  },
  assignee: {
    type: "one",
    collection: Users,
    field: "assigneeId"
  },
  client: {
    type: "one",
    collection: Clients,
    field: "clientId"
  },
  attachments: {
    type: "many",
    collection: Uploads,
    field: "attachmentIds"
  },

  actions: {
    type: "many",
    collection: AccountActions,
    field: "actionIds"
  },
  tag: {
    type: "one",
    collection: Tags,
    field: "workQueueId"
  },
  flags: {
    type: "many",
    collection: AccountActions,
    field: "flagIds"
  },
  comments: {
    type: "many",
    collection: AccountActions,
    field: "commentIds"
  },
  letters: {
    type: "many",
    collection: AccountActions,
    field: "letterIds"
  },
  lockOwner: {
    type: "one",
    collection: Users,
    field: "lockOwnerId"
  }
});
