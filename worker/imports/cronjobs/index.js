import ReportsManagement from "../services/RunReports";
import LettersManagement from "../services/LettersManagement";
import EmailsManagement from "../services/EmailsManagement";

//Job for running reports
SyncedCron.add({
  name: "Run Report",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    ReportsManagement.run();
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
    LettersManagement.run();
  }
});

//Job for sending emails
SyncedCron.add({
  name: "Send Mails",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    EmailsManagement.run();
  }
});