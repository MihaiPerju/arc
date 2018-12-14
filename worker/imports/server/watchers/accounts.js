import Accounts from "/imports/api/accounts/collection";
import RulesEngine from "../../services/RulesEngine";

Meteor.startup(function() {
  //Process Accounts in pending state
  const accounts = Accounts.find(
    { isPending: true },
    { fields: { _id: 1 } }
  ).fetch();

  for (account of accounts) {
    RulesEngine.run(account._id);
  }

  //Launch Change Stream
  const AccountsNative = Accounts.rawCollection();

  const pipeline = [
    {
      $match: {
        $or: [
          {
            operationType: "update",
            "updateDescription.updatedFields.isPending": true
          },
          {
            operationType: "insert"
          }
        ]
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
      function(error) {}
    )
  );
});
