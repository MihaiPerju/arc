const { buildSchema } = require('graphql');
const account = require('./accounts/schema.gql')
const facility = require('./facilities/schema.gql');
const clients = require('./clients/schema.gql');
const { gqlDate } = require('./customScalars/date');

exports.schema = buildSchema(
    `scalar gqlDate
    type Query {
        ${account.queries}
        ${facility.queries}
        ${clients.queries}
    }
    ${account.baseSchema}
    ${facility.baseSchema}
    ${clients.baseSchema}

    # Generic contact type
    type Contact {
        firstName: String
        lastName: String
        phone: String
        email: String
        contactType: String
        notes: String
      }
    `
)

exports.resolvers = {
    ...require('./accounts/roots'),
    ...require('./facilities/roots'),
    ...require('./clients/root')
}