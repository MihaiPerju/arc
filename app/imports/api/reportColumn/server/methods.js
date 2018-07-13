import ReportColumn from "./../collection.js";
import schema from "../schema";

Meteor.methods({
  "reportColumn.create"(data) {
    const reportData = schema.clean(data);
    ReportColumn.update(
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
