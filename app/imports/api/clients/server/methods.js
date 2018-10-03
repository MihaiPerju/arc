import Security from "/imports/api/security/security.js";
import Clients from "/imports/api/clients/collection.js";
import Uploads from "/imports/api/uploads/uploads/collection";
import Facilities from "/imports/api/facilities/collection.js";
import User from "/imports/api/users/collection.js"
import fs from "fs";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection.js";
import sendEmail from './emailTemplate'
import sendEmailForAttachment from './attachmentEmailTemplate'
import ClientService from "./services/ClientService.js"
import MAIL_URL from '../../../../config'

Meteor.startup(function () {
  process.env.MAIL_URL=MAIL_URL
});
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
    let ids=data.managerIds
    let to
    for(let i of ids){
      let managerData= User.findOne({_id:i}).getEmail()
      to=managerData
      sendEmail({ to, email:data.email });
    }
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
  },
  "client.sendEmail"(client_id){
    const client = Clients.findOne({ _id:client_id });
    let managers=client.managerIds;
    let clientName=client.clientName
   for(let manager of managers)
{
  let managerData= User.findOne({_id:manager}).getEmail()
  sendEmailForAttachment({to:managerData,clientName})
}
ClientService.sendNotification(managers,client_id,clientName)

  }
});
