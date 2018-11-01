const { buildSchema } = require('graphql');
const account = require('./accounts/schema.gql')
const facility = require('./facilities/schema.gql');
const { gqlDate } = require('./customScalars/date');

exports.schema = buildSchema(
    `scalar gqlDate
    type Query {
        ${account.queries}
        ${facility.queries}
    }
    ${account.baseSchema}
    ${facility.baseSchema}
    `
)

exports.resolvers = {
    ...require('./accounts/roots'),
    ...require('./facilities/roots')
}