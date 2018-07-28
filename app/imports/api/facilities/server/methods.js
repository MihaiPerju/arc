import {
  Meteor
} from "meteor/meteor";
import Facilities from "/imports/api/facilities/collection.js";
import Security from "/imports/api/security/security.js";
import FacilitySchema from "../schema.js";
import Regions from "/imports/api/regions/collection";
import fs from "fs";
import os from "os";
import Business from "/imports/api/business";
import Uploads from "../../s3-uploads/uploads/collection";
import Settings from "/imports/api/settings/collection.js";

Meteor.methods({
  "facility.create" (data) {
    Security.isAdminOrTech(this.userId);

    Facilities.insert(data);
  },

  "facility.get" (facilityId) {
    Security.isAdminOrTech(this.userId);
    return Facilities.findOne(facilityId);
  },

  "facility.update" (facility) {
    Security.isAdminOrTech(this.userId);
    const facilityData = FacilitySchema.clean(facility);
    Facilities.update({
      _id: facility._id
    }, {
      $set: facilityData
    });
  },

  "facility.remove" (facilityId) {
    Security.isAdminOrTech(this.userId);

    Facilities.remove(facilityId);
  },

  "facility.removeMany" (facilityIds) {
    Security.isAdminOrTech(this.userId);

    Facilities.remove({
      _id: {
        $in: facilityIds
      }
    });
  },

  "facility.getRegions" (regionIds) {
    Security.isAdminOrTech(this.userId);

    return Regions.find({
      _id: {
        $in: regionIds
      }
    }).fetch();
  },

  "facility.getNames" () {
    return Facilities.find({}, {
      name: 1
    }).fetch();
  },

  "facility.removeLogo" (_id) {
    const {
      rootFolder
    } = Settings.findOne({
      rootFolder: {
        $ne: null
      }
    });

    const {
      logoPath
    } = Facilities.findOne({
      _id
    });

    Facilities.update({
      _id
    }, {
      $unset: {
        logoPath: null
      }
    });
    fs.unlinkSync(rootFolder + Business.CLIENTS_FOLDER + logoPath);
    Uploads.remove({
      path: logoPath
    });
  },

  "facility.switchStatus" (_id, status) {
    Security.isAdminOrTech(this.userId);

    return Facilities.update({
      _id
    }, {
      $set: {
        status: !status
      }
    });
  }
});