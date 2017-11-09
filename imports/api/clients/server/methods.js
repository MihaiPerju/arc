import Security from '/imports/api/security/security.js';
import Clients from '/imports/api/clients/collection.js';
import Uploads from '/imports/api/s3-uploads/uploads/collection';

Meteor.methods({
    'client.create'(data) {
        Security.checkAllowedModifyClient(this.userId);

        const existingClient = Clients.findOne({email: data.email});
        if (existingClient) {
            throw new Meteor.Error('Email taken!', 'This email is already taken!');
        }
        return Clients.insert(data);
    },

    'client.get'(id) {
        Security.checkAllowedModifyClient(this.userId);

        return Clients.findOne({_id: id});
    },

    'client.getLogoPath'(uploadId) {
        Security.checkAllowedModifyClient(this.userId);

        const existingUpload = Uploads.findOne({_id: uploadId});
        return existingUpload.path;
    },

    'client.update'(clientId, {clientName, firstName, lastName, email, logoPath, contacts}) {
        Security.checkAllowedModifyClient(this.userId);

        Clients.update({_id: clientId}, {
            $set: {
                clientName,
                firstName,
                lastName,
                email,
                logoPath,
                contacts
            }
        })
    },

    'client.removeLogo'(clientId, uploadId) {
        Security.checkAllowedModifyClient(this.userId);

        Uploads.remove({_id: uploadId});

        Clients.update({_id: clientId}, {
            $unset: {
                logoPath: null
            }
        });
    },

    'client.delete'(id) {
        Security.checkAllowedModifyClient(this.userId);

        const existingClient = Clients.findOne({_id: id});
        const logoPath = existingClient.logoPath;

        Uploads.remove({path: logoPath});
        Clients.remove({_id: id});
    },

    'client.getByName'(name) {
        return Clients.find({
            clientName: {
                '$regex': name,
                '$options': 'i'
            }
        }).fetch()
    }
});