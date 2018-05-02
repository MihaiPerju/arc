import ClientsSchema from './schemas/schema.js'

const Clients = new Mongo.Collection('clients');

Clients.attachSchema(ClientsSchema);

export default Clients;