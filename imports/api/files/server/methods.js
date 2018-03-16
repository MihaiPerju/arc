import Files from '/imports/api/files/collection.js';

Meteor.methods({
    "file.rollback"(_id) {
        Files.remove({_id});

        //Need to perform the rest of the logic here, including getting backups and so on.
    }
});