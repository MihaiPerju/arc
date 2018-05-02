import PaymentSchema from '/imports/api/payments/schemas/schema.js'

const Payments = new Mongo.Collection('payments');

Payments.attachSchema(PaymentSchema);

export default Payments;