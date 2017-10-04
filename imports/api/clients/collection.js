import ClientsSchema from './schema.js'

const Clients = new Mongo.Collection('clients');

Clients.attachSchema(ClientsSchema);

export default Clients;