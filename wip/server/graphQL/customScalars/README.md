# GraphQLScalarType
**serialize:**
Invoked when serializing the result to send it back to a client.

**parseValue:**
Invoked to parse client input that was passed through variables.

**parseLiteral:**
Invoked to parse client input that was passed inline in the query. This receives AST (Abstract Syntax Tree).

Example AST: { "kind": "StringValue", "value": "2017-10-06T14:54:54+00:00" "loc": { "start": 51, "end": 78 } }