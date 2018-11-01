const { buildSchema } = require('graphql');

exports.schema = buildSchema(
    require('./accounts/schema.gql').accountSchema
)

exports.resolvers = {
    ...require('./accounts/roots')
}