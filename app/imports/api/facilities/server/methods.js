import { Meteor } from "meteor/meteor";
import Facilities from "/imports/api/facilities/collection.js";
import Security from "/imports/api/security/security.js";
import FacilitySchema from "../schema.js";
import Regions from "/imports/api/regions/collection";
import fs from "fs";
import Business from "/imports/api/business";
import Uploads from "../../uploads/uploads/collection";
import bcrypt from "bcrypt";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

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
    const facilityData = FacilitySchema.clean(facility);
    Facilities.update(
      {
        _id: facility._id
      },
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

    Facilities.remove({
      _id: {
        $in: facilityIds
      }
    });
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
    return Facilities.find(
      {},
      {
        name: 1
      }
    ).fetch();
  },

  "facility.removeLogo"(_id) {
    const { root } = SettingsService.getSettings(settings.ROOT);

    const { logoPath } = Facilities.findOne({
      _id
    });
    const filePath = root + Business.CLIENTS_FOLDER + logoPath;

    Facilities.update(
      {
        _id
      },
      {
        $unset: {
          logoPath: null
        }
      }
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    Uploads.remove({
      path: logoPath
    });
  },

  "facility.switchStatus"(_id, status) {
    Security.isAdminOrTech(this.userId);

    return Facilities.update(
      {
        _id
      },
      {
        $set: {
          status: !status
        }
      }
    );
  },

  "facility.updatePassword"(password, _id) {
    Security.isAdminOrTech(this.userId);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    Facilities.update(
      {
        _id
      },
      {
        $set: { password: hash }
      }
    );
  },

  "facilities.get"(clientId) {
    Security.checkLoggedIn(this.userId);
    return Facilities.find({ clientId: clientId }).fetch();
  },
});
