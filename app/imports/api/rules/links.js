import Clients from "/imports/api/clients/collection";
import Rules from "/imports/api/rules/collection";

Rules.addLinks({
  client: {
    type: "one",
    collection: Clients,
    field: "clientId"
  }
});
