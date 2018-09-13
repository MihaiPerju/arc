import Accounts from "/imports/api/accounts/collection";
import Rules from "/imports/api/rules/collection";

Meteor.startup(function() {
  const AccountsNative = Accounts.rawCollection();

  const changeStream = AccountsNative.watch();
  changeStream.on("change", data => {
    console.log(data);
  });
});
