import Files from "/imports/api/files/collection.js";
import RevertService from "../services/RevertService";
import UploadStatuses from "/imports/api/files/enums/statuses";
import FileTypes from "/imports/api/files/enums/fileTypes";
import FileService from "./services/FileService";

Meteor.methods({
  "file.rollback"(_id) {
    RevertService.revert(_id);
    Files.remove({ _id });

    //Need to perform the rest of the logic here, including getting backups and so on.
  },

  "file.dismiss"(_id) {
    Files.update({ _id }, { $set: { status: UploadStatuses.DISMISS } });
  },

  "file.getHeader"(_id) {
    const { facilityId, type, fileName } = Files.findOne({ _id });
    if (type === FileTypes.INVENTORY) {
      return "Inventory";
    } else {
      const header = FileService.getHeader(fileName);
      console.log(header);
    }
  }
});
