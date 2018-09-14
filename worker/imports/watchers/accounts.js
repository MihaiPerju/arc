import Accounts from "/imports/api/accounts/collection";
import RulesEngine from "../services/RulesEngine";

Meteor.startup(function() {
  const AccountsNative = Accounts.rawCollection();

  const pipeline = [
    {
      $match: {
        operationType: "update",
        "updateDescription.updatedFields.isPending": true
      }
    }
  ];

  const changeStream = AccountsNative.watch(pipeline);

  changeStream.on(
    "change",
    Meteor.bindEnvironment(
      function(data) {
        const updatedDocumentId = data.documentKey._id;
        RulesEngine.run(updatedDocumentId);
      },
      function(error) {
        console.log(error);
      }
    )
  );
});
