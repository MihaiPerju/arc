import Files from '/imports/api/files/collection.js';
import RevertService from '../services/RevertService';

Meteor.methods({
    "file.rollback"(_id) {
        RevertService.revert(_id);
        Files.remove({_id});

        //Need to perform the rest of the logic here, including getting backups and so on.
    }
});