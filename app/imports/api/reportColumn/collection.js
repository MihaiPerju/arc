import {Mongo} from 'meteor/mongo';
import ReportColumnSchema from "./schema.js";

const ReportColumn = new Mongo.Collection('reportColumn');

ReportColumn.attachSchema(ReportColumnSchema);

export default ReportColumn;
