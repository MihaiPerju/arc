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
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import FacilityService from "./services/FacilityService.js";

Meteor.methods({
  "facilities.list"(params) {
    const queryParams = QueryBuilder.getFacilitiesParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    options.fields = { name: 1 };
    return Facilities.find(filters, options).fetch();
  },

  "facilities.count"(params) {
    const queryParams = QueryBuilder.getFacilitiesParams(params);
    let filters = queryParams.filters;
    return Facilities.find(filters).count();
  },

  "facility.getOne"(_id) {
    Security.isAdminTechOrManager(this.userId);
    return Facilities.findOne({ _id });
  },

  "facilities.get"(filters = {}) {
    return FacilityService.getFacilities(filters);
  },

  "facilities.getNames"(filters = {}) {
    let options = { fields: { name: 1 } };
    return Facilities.find(filters, options).fetch();
  },

  "facilities.getEssential"(filters = {}) {
    return FacilityService.getEssential(filters);
  },

  "facility.create"(data) {
    Security.isAdminOrTech(this.userId);

    Facilities.insert(data);
  },

  "facility.update"(facility) {
    Security.isAdminTechOrManager(this.userId);
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

  "facilities.fetch"(clientId) {
    Security.checkLoggedIn(this.userId);
    return Facilities.find({ clientId: clientId }).fetch();
  },
});
