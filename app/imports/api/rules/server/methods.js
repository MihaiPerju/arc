import Rules from '/imports/api/rules/collection.js';

Meteor.methods ({
  'rule.create' (data) {
    const {priority, clientId} = data;
    Rules.update (
      {
        priority: {$gte: priority},
        clientId,
      },
      {
        $inc: {priority: 1},
      },
      {multi: true}
    );
    Rules.insert (data);
  },

  'rule.update' (data) {
    const {priority, clientId} = data;
    //Increase priority for all the rules that have a priority greater than or equal to the new one
    Rules.update (
      {
        priority: {$gte: priority},
        clientId,
      },
      {
        $inc: {priority: 1},
      },
      {multi: true}
    );

    //Update the rule itself
    Rules.update (
      {
        _id: data._id,
      },
      {
        $set: data,
      }
    );
  },
  'rule.delete' (_id) {
    //Take care of the security
    Rules.remove ({_id});
  },

  'rules.delete' (ids) {
    //Take care of the security
    Rules.remove ({_id: {$in: ids}});
  },
});
