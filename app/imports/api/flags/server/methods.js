import Flags from "../collection";

Meteor.methods({
  "flag.create"(data) {
    data.authorId = this.userId;
    Flags.insert(data);
  },
  
  "flag.remove"({ _id, message }) {
    Flags.update(
      { _id },
      {
        $set: {
          message,
          managerId: this.userId,
          open: false
        }
      }
    );
  }
});
