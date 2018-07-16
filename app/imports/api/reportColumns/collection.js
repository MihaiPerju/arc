import {Mongo} from 'meteor/mongo';
import ReportColumnSchema from "./schema.js";

const ReportColumns = new Mongo.Collection('reportColumns');

ReportColumns.attachSchema(ReportColumnSchema);

export default ReportColumns;
