import ReportsManagement from "../services/RunReports";
import LettersManagement from "../services/LettersManagement";
import EmailsManagement from "../services/EmailsManagement";
import PlacementService from "../services/PlacementService";
import ReuploadService from "../services/ReuploadService";
import InventoryService from "../services/InventoryService";
import PaymentService from "../services/PaymentService";
import RulesEngine from "../services/RulesEngine";

// // Job for running reports
// SyncedCron.add({
//   name: "Run Report",
//   schedule: function(parser) {
//     // parser is a later.parse object
//     return parser.text("every 10 seconds");
//   },
//   job: function() {
//     ReportsManagement.run();
//   }
// });

//Job for sending letters
SyncedCron.add({
  name: "Send Letters",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("at 1:00 am on Wednesday");
  },
  job: function() {
    LettersManagement.run();
  }
});

// //Job for sending emails
// SyncedCron.add({
//   name: "Send Mails",
//   schedule: function(parser) {
//     // parser is a later.parse object
//     return parser.text("every 10 seconds");
//   },
//   job: function() {
//     EmailsManagement.run();
//   }
// });

//Job for importing accounts from placement file
SyncedCron.add({
  name: "Import Accounts from Placement",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    PlacementService.run();
  }
});

//Job for importing accounts from inventory file
SyncedCron.add({
  name: "Import Accounts from Inventory",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    InventoryService.run();
  }
});

// //Job for payment file
// SyncedCron.add({
//   name: "Create Payments",
//   schedule: function(parser) {
//     // parser is a later.parse object
//     return parser.text("every 10 seconds");
//   },
//   job: function() {
//     PaymentService.run();
//   }
// });

//Job for importing re-uploading files with changed header
SyncedCron.add({
  name: "Reupload Files",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    ReuploadService.run();
  }
});

//Job for passing accounts  through Rules Engine
SyncedCron.add({
  name: "Rules Engine",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 10 seconds");
  },
  job: function() {
    RulesEngine.run();
  }
});
