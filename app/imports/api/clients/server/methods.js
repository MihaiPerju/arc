import Security from "/imports/api/security/security.js";
import Clients from "/imports/api/clients/collection.js";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import Facilities from "/imports/api/facilities/collection.js";
import fs from "fs";
import os from "os";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection.js";

Meteor.methods({
  "client.create"(data) {
    Security.isAdminOrTech(this.userId);
    data.createdAt = new Date();
    return Clients.insert(data);
  },

  "client.get"(id) {
    Security.isAdminOrTech(this.userId);

    return Clients.findOne({ _id: id });
  },

  "client.getLogoPath"(uploadId) {
    Security.isAdminOrTech(this.userId);

    const existingUpload = Uploads.findOne({ _id: uploadId });
    return existingUpload.path;
  },

  "client.update"(_id, data) {
    Security.isAdminOrTech(this.userId);

    Clients.update(
      { _id },
      {
        $set: data
      }
    );
  },

  "client.removeLogo"(clientId) {
    Security.isAdminOrTech(this.userId);

    const client = Clients.findOne({ _id: clientId });

    if (client) {
      const { logoPath } = client;
      const { rootFolder } = Settings.findOne({
        rootFolder: { $ne: null }
      });
      //Delete from local storage
      Uploads.remove({ path: logoPath });

      Clients.update(
        { _id: clientId },
        {
          $unset: {
            logoPath: null
          }
        }
      );
      const filePath = rootFolder + Business.CLIENTS_FOLDER + logoPath;
      if (logoPath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  },

  "client.delete"(_id) {
    Security.isAdminOrTech(this.userId);

    const existingClient = Clients.findOne({ _id });
    if (existingClient) {
      const logoPath = existingClient.logoPath;

      Uploads.remove({ path: logoPath });
      Clients.remove({ _id });
    }
  },

  "client.deleteMany"(Ids) {
    Security.isAdminOrTech(this.userId);

    _.each(Ids, id => {
      Meteor.call("client.removeLogo", id);
      Clients.remove({ _id: id });
    });
  },

  "client.getByName"(name) {
    return Clients.find({
      clientName: {
        $regex: name,
        $options: "i"
      }
    }).fetch();
  },

  "client.switchStatus"(_id, status) {
    Security.isAdminOrTech(this.userId);

    return Clients.update(
      { _id: _id },
      {
        $set: {
          status: !status
        }
      },
      err => {
        if (!err && !!status) {
          Facilities.update(
            { clientId: _id },
            {
              $set: {
                status: false
              }
            },
            { multi: true }
          );
        }
      }
    );
  },

  "client.tag"({ _id, tagIds }) {
    Clients.update(
      { _id },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
