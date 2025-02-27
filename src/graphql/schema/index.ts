import { makeExecutableSchema } from 'graphql-tools';
import { organizationTypeDefs } from './organization.schema';
import { eventTypeDefs } from './event.schema';
import { userTypeDefs } from 'graphql/schema/user.schema';
import { sharedTypeDefs } from 'graphql/schema/shared.schema';
import { activityTypeDefs } from 'graphql/schema/activity.schema';
import { volunteerTypeDefs } from 'graphql/schema/volunteer.schema';
import { participationTypeDefs } from 'graphql/schema/participation.schema';
import { tagTypeDefs } from 'graphql/schema/tag.schema';
import { sponsorTypeDefs } from 'graphql/schema/sponsor.schema';

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
        userTypeDefs,
        activityTypeDefs,
        volunteerTypeDefs,
        participationTypeDefs,
        tagTypeDefs,
        sponsorTypeDefs
    ]
});
