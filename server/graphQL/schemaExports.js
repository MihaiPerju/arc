const { buildSchema } = require('graphql');

// Account related queries
exports.accountSchema = buildSchema(require('./accounts/schema.gql').accountSchema);
exports.accountRoots = require('./accounts/roots');