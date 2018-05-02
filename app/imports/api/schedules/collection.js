import SchedulesSchema from './schemas/schema.js'

const Schedules = new Mongo.Collection('schedules');

Schedules.attachSchema(SchedulesSchema);

export default Schedules;