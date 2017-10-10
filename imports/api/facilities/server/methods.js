import {Meteor} from "meteor/meteor";
import Facilities from "/imports/api/facilities/collection.js";
import Security from '/imports/api/security/security.js';
import statusEnum from "/imports/api/facilities/enums/statuses.js";

Meteor.methods({
    'facility.create' (data) {
        Security.checkAllowedModifyClient(this.userId);

        data.status = statusEnum.NEW;
        Facilities.insert(data);
    },

    'facility.remove' (facilityId) {
        Security.checkAllowedModifyClient(this.userId);

        Facilities.remove(facilityId);
    }
});