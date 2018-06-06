import SimpleSchema from "simpl-schema";
import FacilityContactSchema from "/imports/api/facilities/schemas/contactSchema.js";
import ImportRulesSchema from "./schemas/importRulesSchema.js";
import PaymentRulesSchema from "./schemas/PaymentRulesSchema";
import allowedFrequencies from "./enums/frequency.js";

export default new SimpleSchema({
  name: {
    type: String
  },
  clientId: {
    type: String
  },
  addressOne: {
    type: String,
    optional: true
  },
  addressTwo: {
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
  zipCode: {
    type: SimpleSchema.Integer,
    optional: true
  },
  status: {
    type: Boolean,
    defaultValue: true
  },
  regionId: {
    label: "Region",
    type: String,
    optional: true
  },
  contacts: {
    type: Array,
    optional: true
  },
  "contacts.$": {
    type: FacilityContactSchema,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  allowedUsers: {
    type: Array,
    optional: true
  },
  "allowedUsers.$": {
    type: String
  },
  placementRules: {
    type: ImportRulesSchema,
    optional: true
  },
  inventoryRules: {
    type: ImportRulesSchema,
    optional: true
  },
  paymentRules: {
    type: PaymentRulesSchema,
    optional: true
  },
  logoPath: {
    type: String,
    optional: true
  },
  sftpPath: {
    type: String
  },
  fileId: {
    type: String,
    optional: true
  },
  host: {
    type: String,
    optional: true
  },
  user: {
    type: String,
    optional: true
  },
  frequency: {
    type: String,
    optional: true,
    allowedValues: allowedFrequencies
  },
  password: {
    type: String,
    optional: true
  }
});
