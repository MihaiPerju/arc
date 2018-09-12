import Rules from "/imports/api/rules/collection";

Meteor.startup(function() {
  const RulesNative = Rules.rawCollection();
  RulesNative.createIndex({ clientId: 1, facilityId: 1, priority: 1 });

  //   const changeStream = RulesNative.watch();
  //   changeStream.on("change", data => {
  // console.log(data);
  //   });
});
