import Facilities from "/imports/api/facilities/collection.js";
import Files from "./collection";

Files.addLinks({
  facility: {
    type: "one",
    collection: Facilities,
    field: "facilityId"
  }
});
