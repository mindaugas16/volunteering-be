export const eventTypeDefs =
`
        type Event {
            _id: ID!
            title: String!
            description: String
            imagePath: String
            createdAt: String!
            updatedAt: String!

            date: DateRange!
            organization: Organization!
            location: Location
            tags: [Tag]
            activities: [Activity!]!
        }

        input EventInput {
            title: String!
            description: String
            imagePath: String
            date: DateRangeInput!
            location: LocationInput
        }

        extend type Query {
            event(eventId: ID!): Event!
            events(query: String, orderBy: String): [Event!]!
        }

        extend type Mutation {
            createEvent(eventInput: EventInput!): Event!
            updateEvent(id: ID!, eventInput: EventInput!): Event!
            addEventTag(id: ID!, tagLabel: String!): String!
        }
    `;
