export const sharedTypeDefs = `
        type Tag {
            _id: ID!
            label: String!
        }

        type Location {
            title: String
            address: String
            address2: String
            city: String
            country: String
            zipCode: String
        }

        type DateRange {
            start: String!
            end: String
        }

        input DateRangeInput {
            start: String!
            end: String
        }

        input TagInput {
            label: String!
        }

        input TagUpdateInput {
            _id: ID!
            label: String!
        }

        input LocationInput {
            title: String
            address: String
            address2: String
            city: String
            country: String
            zipCode: String
        }
    `
;

// export default buildSchema(`
//         type Activity {
//             _id: ID!
//             name: String!
//             description: String
//             date: DateRange!
//             creator: User!
//             createdAt: String!
//             updatedAt: String!
//             event: Event!
//             volunteers: [ID!]
//             volunteersNeeded: Int!
//         }

//         type Participation {
//             volunteer: User!
//             activity: Activity!
//             additionalInformation: String
//             createdAt: String!
//             updatedAt: String!
//         }
//
//         input ActivityInput {
//             name: String!
//             description: String
//             date: DateRangeInput!
//             eventId: ID!
//             volunteersNeeded: Int!
//         }
//

//
//         input LocationInput {
//             title: String
//             address: String
//             address2: String
//             city: String
//             country: String
//             zipCode: String
//         }
//
//         input ParticipationInput {
//             activityId: ID!
//             additionalInformation: String
//         }
//
//         type RootQuery {
//             activity(activityId: ID!): Activity!
//             activities: [Activity!]!
//             participations: [Participation!]!
//         }
//
//         type RootMutation {
//
//             updateEventTag(id: ID!, tag: TagUpdateInput!): Tag!
//             deleteEventTag(id: ID!, tagId: ID!): Tag!
//
//
//             createActivity(activityInput: ActivityInput): Activity
//             participate(participationInput: ParticipationInput): Participation
//
//         }
//
//         schema {
//             query: RootQuery
//             mutation: RootMutation
//         }
//
// `);
