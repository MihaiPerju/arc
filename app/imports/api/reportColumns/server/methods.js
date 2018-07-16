import ReportColumns from "./../collection.js";
import schema from "../schema";

Meteor.methods({
  "reportColumn.create"(data) {
    const reportData = schema.clean(data);
    ReportColumns.update(
      { userId: this.userId },
      {
        $set: reportData
      },
      {
        upsert: true
      }
    );
  }
});
