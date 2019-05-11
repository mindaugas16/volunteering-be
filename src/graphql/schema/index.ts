import { makeExecutableSchema } from 'graphql-tools';
import { organizationTypeDefs } from './organization.schema';
import { eventTypeDefs } from './event.schema';
import { userTypeDefs } from 'graphql/schema/user.schema';
import { sharedTypeDefs } from 'graphql/schema/shared.schema';

const rootTypeDefs = `
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
    typeDefs: [
        rootTypeDefs,
        sharedTypeDefs,
        organizationTypeDefs,
        eventTypeDefs,
        userTypeDefs
    ]
});
