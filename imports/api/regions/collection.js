import RegionsSchema from './schemas/schema.js'

const Regions = new Mongo.Collection('regions');

Regions.attachSchema(RegionsSchema);

export default Regions;