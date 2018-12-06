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
import ClientService from "/imports/api/clients/server/services/ClientService";
import Tags from "/imports/api/tags/collection.js";
import { moduleNames } from "/imports/api/tags/enums/tags";

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

  "clients.list"(params) {
    Security.isAdminOrTech(this.userId);
    const queryParams = QueryBuilder.getClientParams(params);
    let filters = queryParams.filters;
    let options = queryParams.options;
    //Project fields
    options.fields = { clientName: 1, tagIds: 1, email: 1 };
    return Clients.find(filters, options).fetch();
  },

  "clients.get"(filters = {}) {
    return ClientService.getClients(filters);
  },

  "clients.getEssential"(filters = {}) {
    return Clients.find(filters, {
      fields: {
        clientName: 1,
        email: 1,
        financialGoals: 1,
        logoPath: 1,
        contacts: 1,
        status: 1,
        managerIds: 1,
        tagIds: 1
      }
    }).fetch();
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
  },

  "client.getAll"() {
    Security.isAdminOrTech(this.userId);
    return Clients.find({}, { fields: { _id: 1, clientName: 1, tagIds: 1 } }).fetch();
  },

  "client.getWorkQueue"(clientId) {
    Security.isAdminOrTech(this.userId);
    let workQueue = [];

    let tagDetails = Tags.find({ clientId: clientId, entities: { $in: [moduleNames.WORK_QUEUE] }  }, { fields: { _id: 1, name: 1 } }).fetch();
    return tagDetails;
  },

  "clients.fetch"() {
    Security.checkLoggedIn(this.userId);
    return Clients.find().fetch();
  },

  "clients.getStatistics"() {
    Security.checkLoggedIn(this.userId);
    let filters = { 'managerIds': { $in: [this.userId] } };
    var clients = Clients.find(filters).fetch().map(c => {
      if (c.statistics) {
        c.agedAccountsPercentage = Math.round((c.statistics.over180 / c.statistics.totalInventory) * 100);
        c.callActionsPercentage = Math.round((c.statistics.callActions / c.statistics.totalInventory) * 100);
      }
      return c;
    });
    return clients;
  },

  "clients.getStatisticsChartData"() {
    Security.checkLoggedIn(this.userId);
    let filters = { 'managerIds': { $in: [this.userId] } };
    var clients = Clients.find(filters).fetch().map(c => {
      if (c.statistics) {
        c.agedAccountsPercentage = Math.round((c.statistics.over180 / c.statistics.totalInventory) * 100);
        c.callActionsPercentage = Math.round((c.statistics.callActions / c.statistics.totalInventory) * 100);
      }
      return { name: c.clientName, agedAccountsPercentage: c.agedAccountsPercentage, callActionsPercentage: c.callActionsPercentage };
    });
    return clients;
  }

});
