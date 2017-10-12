import {Meteor} from "meteor/meteor";
import Facilities from "/imports/api/facilities/collection.js";
import Security from '/imports/api/security/security.js';
import FacilitySchema from "../schema.js";

Meteor.methods({
    'facility.create' (data) {
        Security.checkAllowedModifyClient(this.userId);

        Facilities.insert(data);
    },

    'facility.get' (facilityId) {
        Security.checkAllowedModifyClient(this.userId);
        return Facilities.findOne(facilityId);
    },

    'facility.update' (facility) {
        Security.checkAllowedModifyClient(this.userId);
        const facilityData = FacilitySchema.clean(facility);

        Facilities.update({_id: facility._id}, {
            $set: facilityData
        })
    },

    'facility.remove' (facilityId) {
        Security.checkAllowedModifyClient(this.userId);

        Facilities.remove(facilityId);
    }
});