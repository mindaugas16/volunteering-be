export const eventTypeDefs =
`
        enum EventStatus {
          DRAFT
          PUBLIC
          PRIVATE
        }

        type Event {
            _id: ID!
            title: String!
            description: String
            imagePath: String
            createdAt: String!
            updatedAt: String!
            status: Int!

            date: DateRange!
            organization: Organization!
            location: Location
            tags: [Tag]
            activities: [Activity!]!
            customFields: [CustomField!]
        }

        type EventResults {
            events: [Event!]!
            totalCount: Int!
        }

        input EventInput {
            title: String!
            description: String
            imagePath: String
            date: DateRangeInput!
            location: LocationInput
            status: Int!
            customFields: [CustomFieldInput]
        }

        extend type Query {
            event(eventId: ID!): Event!
            events(query: String, location: String, orderBy: String,
             statuses: [Int], tags: [String], organizationId: ID, page: Int): EventResults!
        }

        extend type Mutation {
            createEvent(eventInput: EventInput!): Event!
            updateEvent(id: ID!, eventInput: EventInput!): Event!
            addEventTag(id: ID!, tagLabel: String!): Tag!
            deleteEventTag(id: ID!): Boolean!

            rewardVolunteers(eventId: ID!, achievements: [AchievementInput!]!, volunteerIds: [ID!]!): Boolean
            mockEvents(count: Int!, organizationId: ID!): [Event]
        }
    `;
