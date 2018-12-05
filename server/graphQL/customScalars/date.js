const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

exports.gqlDate = new GraphQLScalarType({
    name: 'gqlDate',
    description: 'A valid JavaScriptS ISO date',
    serialize: value => value.getTime(),
    parseValue: value => new Date(value),
    parseLiteral: ast => {
        if(ast.kind === Kind.INT)
            return new Date(ast.value);

        return null;
    }
})