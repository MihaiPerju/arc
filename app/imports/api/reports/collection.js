import {Mongo} from 'meteor/mongo';
import ReportSchema from "./schema.js";

const Reports = new Mongo.Collection('reports');

Reports.attachSchema(ReportSchema);

export default Reports;
