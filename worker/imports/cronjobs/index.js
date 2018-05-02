import RunReports from "../services/RunReports";

SyncedCron.add({
  name: "Scan ",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    RunReports.run();
  }
});
