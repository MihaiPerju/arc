import ClientsSchema from './schemas/schema.js'

const Clients = new Mongo.Collection('clients');

if(Meteor.isServer) {
    Clients._ensureIndex({status: 1});
}

Clients.attachSchema(ClientsSchema);

export default Clients;