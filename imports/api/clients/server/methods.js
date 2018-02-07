import Security from '/imports/api/security/security.js';
import Clients from '/imports/api/clients/collection.js';
import Uploads from '/imports/api/s3-uploads/uploads/collection';
import fs from 'fs';

Meteor.methods({
    'client.create'(data) {
        Security.isAdminOrTech(this.userId);

        const existingClient = Clients.findOne({email: data.email});
        if (existingClient) {
            throw new Meteor.Error('Email taken!', 'This email is already taken!');
        }
        return Clients.insert(data);
    },

    'client.get'(id) {
        Security.isAdminOrTech(this.userId);

        return Clients.findOne({_id: id});
    },

    'client.getLogoPath'(uploadId) {
        Security.isAdminOrTech(this.userId);

        const existingUpload = Uploads.findOne({_id: uploadId});
        return existingUpload.path;
    },

    'client.update'(clientId, {clientName, firstName, lastName, email, logoPath, contacts}) {
        Security.isAdminOrTech(this.userId);

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

    'client.removeLogo'(clientId) {
        Security.isAdminOrTech(this.userId);

        const client = Clients.findOne({_id: clientId});
        const {logoId} = client;
        const logo = Uploads.findOne({_id: logoId});
        const {path} = logo;

        //Delete from local storage
        fs.unlinkSync(path);
        Uploads.remove({_id: logoId});

        Clients.update({_id: clientId}, {
            $unset: {
                logoId: null
            }
        });
    },

    'client.delete'(id) {
        Security.isAdminOrTech(this.userId);

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