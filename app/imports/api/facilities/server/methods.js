import { Meteor } from "meteor/meteor";
import Facilities from "/imports/api/facilities/collection.js";
import Security from "/imports/api/security/security.js";
import FacilitySchema from "../schema.js";
import Regions from "/imports/api/regions/collection";
import fs from "fs";
import os from "os";
import Business from "/imports/api/business";
import Uploads from "../../s3-uploads/uploads/collection";
import bcrypt from "bcrypt";

Meteor.methods({
  "facility.create"(data) {
    Security.isAdminOrTech(this.userId);

    Facilities.insert(data);
  },

  "facility.get"(facilityId) {
    Security.isAdminOrTech(this.userId);
    return Facilities.findOne(facilityId);
  },

  "facility.update"(facility) {
    Security.isAdminOrTech(this.userId);
    if (facility.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(facility.password, salt);
      facility.password = hash;
    }
    const facilityData = FacilitySchema.clean(facility);
    Facilities.update(
      { _id: facility._id },
      {
        $set: facilityData
      }
    );
  },

  "facility.remove"(facilityId) {
    Security.isAdminOrTech(this.userId);

    Facilities.remove(facilityId);
  },

  "facility.removeMany"(facilityIds) {
    Security.isAdminOrTech(this.userId);

    Facilities.remove({ _id: { $in: facilityIds } });
  },

  "facility.getRegions"(regionIds) {
    Security.isAdminOrTech(this.userId);

    return Regions.find({
      _id: {
        $in: regionIds
      }
    }).fetch();
  },

  "facility.getNames"() {
    return Facilities.find({}, { name: 1 }).fetch();
  },

  "facility.getLogo"(_id) {
    const facility = Facilities.findOne({ _id });
    const { logoPath } = facility;
    return logoPath;
  },

  "facility.removeLogo"(_id, path) {
    Facilities.update(
      { _id },
      {
        $unset: {
          logoPath: null
        }
      }
    );
    fs.unlinkSync(Business.LOCAL_STORAGE_FOLDER + "/" + path);
    Uploads.remove({ path });
  },

  "facility.switchStatus"(_id, status) {
    Security.isAdminOrTech(this.userId);

    return Facilities.update(
      { _id },
      {
        $set: {
          status: !status
        }
      }
    );
  }
});
