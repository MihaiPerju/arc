import Accounts from "/imports/api/accounts/collection";

Meteor.startup(function() {
  const AccountsNative = Accounts.rawCollection();
  const changeStream = AccountsNative.watch();
  changeStream.on("change", data => {
    console.log(data);
  });
});
