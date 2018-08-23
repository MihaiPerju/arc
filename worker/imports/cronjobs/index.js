import ReportsManagement from "../services/RunReports";
import LettersManagement from "../services/LettersManagement";
import EmailsManagement from "../services/EmailsManagement";
import PlacementService from "../services/PlacementService";
import InventoryService from "../services/InventoryService";
import PaymentService from "../services/PaymentService";

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

// //Job for sending letters
// SyncedCron.add({
//   name: "Send Letters",
//   schedule: function(parser) {
//     // parser is a later.parse object
//     return parser.text("every 10 seconds");
//   },
//   job: function() {
//     LettersManagement.run();
//   }
// });

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
