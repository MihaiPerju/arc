import RunReports from "../services/RunReports";

//Job for running reports
SyncedCron.add({
  name: "Run Report",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    RunReports.run();
  }
});

//Job for sending letters
SyncedCron.add({
  name: "Send Letters",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    RunReports.run();
  }
});
