import SimpleSchema from "simpl-schema";

export default new SimpleSchema({
  name: {
    type: String,
    optional:true //testing 
  },
  description: {
    type: String,
    optional:true //testing 
  },
  clientId: {
    type: String,
    optional:true //testing 
  },
  rule: {
    type: Object,
    blackbox: true
  }
});
