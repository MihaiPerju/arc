import Security from "/imports/api/security/security.js";
import Clients from "/imports/api/clients/collection.js";
import Uploads from "/imports/api/uploads/uploads/collection";
import Facilities from "/imports/api/facilities/collection.js";
import fs from "fs";
import Business from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";
import Accounts from "/imports/api/accounts/collection";
import QueryBuilder from "/imports/api/general/server/QueryBuilder";
import Users from "../../users/collection";

Meteor.methods({
  "client.create"(data) {
    Security.isAdminOrTech(this.userId);
    data.createdAt = new Date();
    return Clients.insert(data);
  },

  "client.get"(_id) {
    Security.isAdminOrTech(this.userId);

    return Clients.findOne({
      _id
    });
  },

  "client.getOne"(_id) {
    Security.isAdminOrTech(this.userId);

    return Clients.findOne({ _id });
  },

  "clients.get"(params) {
    Security.isAdminOrTech(this.userId);
    const queryParams = QueryBuilder.getClientParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    //Project fields
    options.fields = { clientName: 1, tagIds: 1, email: 1 };
    return Clients.find(filters, options).fetch();
  },

  "clients.count"(params) {
    const queryParams = QueryBuilder.getClientParams(params);
    let filters = queryParams.filters;
    return Clients.find(filters).count();
  },

  "client.getLogoPath"(uploadId) {
    Security.isAdminOrTech(this.userId);

    const existingUpload = Uploads.findOne({
      _id: uploadId
    });
    return existingUpload.path;
  },

  "client.update"(_id, data) {
    Security.isAdminOrTech(this.userId);
    Clients.update(
      {
        _id
      },
      {
        $set: data
      }
    );
  },

  "client.assign"(_id, managerIds) {
    Security.isAdminOrTech(this.userId);
    //Update client
    Clients.update(
      {
        _id
      },
      {
        $set: {
          managerIds
        }
      }
    );

    //Update Accounts;
    Accounts.update(
      {
        clientId: _id
      },
      {
        $set: {
          managerIds
        }
      }
    );

    //Grant access to users
    Users.update(
      { _id: { $in: managerIds } },
      {
        $addToSet: {
          clientIds: _id
        }
      },
      { multi: true }
    );

    //Remove access to users
    Users.update(
      { _id: { $nin: managerIds } },
      {
        $pull: {
          clientIds: _id
        }
      },
      { multi: true }
    );
  },

  "client.removeLogo"(clientId) {
    Security.isAdminOrTech(this.userId);

    const client = Clients.findOne({
      _id: clientId
    });

    if (client) {
      const { logoPath } = client;
      const { root } = SettingsService.getSettings(settings.ROOT);

      //Delete from local storage
      Uploads.remove({
        path: logoPath
      });

      Clients.update(
        {
          _id: clientId
        },
        {
          $unset: {
            logoPath: null
          }
        }
      );
      const filePath = root + Business.CLIENTS_FOLDER + logoPath;
      if (logoPath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  },

  "client.delete"(_id) {
    Security.isAdminOrTech(this.userId);

    const existingClient = Clients.findOne({
      _id
    });
    if (existingClient) {
      const logoPath = existingClient.logoPath;

      Uploads.remove({
        path: logoPath
      });
      Clients.remove({
        _id
      });
    }
  },

  "client.deleteMany"(Ids) {
    Security.isAdminOrTech(this.userId);

    _.each(Ids, id => {
      Meteor.call("client.removeLogo", id);
      Clients.remove({
        _id: id
      });
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
      {
        _id: _id
      },
      {
        $set: {
          status: !status
        }
      },
      err => {
        if (!err && !!status) {
          Facilities.update(
            {
              clientId: _id
            },
            {
              $set: {
                status: false
              }
            },
            {
              multi: true
            }
          );
        }
      }
    );
  },

  "client.tag"({ _id, tagIds }) {
    Clients.update(
      {
        _id
      },
      {
        $set: {
          tagIds
        }
      }
    );
  }
});
