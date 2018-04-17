import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  insName: {
    type: String,
    optional: true
  },
  insCode: {
    type: String,
    optional: true
  },
  insBal: {
    type: String,
    optional: true
  },
  address1: {
    type: String,
    optional: true
  },
  address2: {
    type: String,
    optional: true
  },
  city: {
    type: String,
    optional: true
  },
  state: {
    type: String,
    optional: true
  },
  policy: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  }
});
