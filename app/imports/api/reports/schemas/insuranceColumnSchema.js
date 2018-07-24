import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  insName: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  insCode: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  insBal: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  address1: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  address2: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  city: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  state: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  policy: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  phone: {
    type: Boolean,
    optional: true,
    defaultValue: false
  }
});
