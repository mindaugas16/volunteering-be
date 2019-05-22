export const activityTypeDefs =
    `
        type Activity {
            _id: ID!
            name: String!
            description: String
            date: DateRange!
            creator: User!
            createdAt: String!
            updatedAt: String!
            event: Event!
            participation: [Participation!]
            volunteersNeeded: Int!
        }

        input ActivityInput {
            name: String!
            description: String
            date: DateRangeInput!
            eventId: ID!
            volunteersNeeded: Int!
        }

        extend type Query {
            activity(activityId: ID!): Activity!
            activities: [Activity!]!
        }

        extend type Mutation {
            createActivity(activityInput: ActivityInput!): Activity!
            updateActivity(id: ID!, activityInput: ActivityInput!): Activity!
            deleteActivity(id: ID!): Boolean

            registerToActivity(activityId: ID!): Activity
        }
    `;
