import { buildSchema } from 'graphql';

export default buildSchema(`

        type Tag {
            _id: ID!
            label: String!
        }

        type User {
            _id: ID!
            email: String!
            firstName: String!
            lastName: String!
            postalCode: String!
            contacts: String
            password: String
            role: String
        }

        type Organization {
            _id: ID!
            email: String!
            firstName: String!
            lastName: String!
            members: [User!]!
            name: String!
            description: String
            location: Location
            events: [Event!]
        }

        type Activity {
            _id: ID!
            name: String!
            description: String
            date: DateRange!
            creator: User!
            createdAt: String!
            updatedAt: String!
            event: Event!
            volunteers: [ID!]
            volunteersNeeded: Int!
        }

        type DateRange {
            start: String!
            end: String
        }

        type Location {
            title: String
            address: String
            address2: String
            city: String
            country: String
            zipCode: String
        }

        type Event {
            _id: ID!
            title: String!
            description: String
            date: DateRange!
            organization: Organization!
            activities: [Activity!]
            location: Location
            tags: [Tag]
            imagePath: String
            createdAt: String!
            updatedAt: String!
        }

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        type Participation {
            volunteer: User!
            activity: Activity!
            additionalInformation: String
            createdAt: String!
            updatedAt: String!
        }

        input ActivityInput {
            name: String!
            description: String
            date: DateRangeInput!
            eventId: ID!
            volunteersNeeded: Int!
        }

        input OrganizationInput {
            creatorId: ID
            name: String!
            description: String
            location: LocationInput
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

        input EventInput {
            title: String!
            description: String
            date: DateRangeInput!
            location: LocationInput
            imagePath: String
        }

        input UserInput {
            email: String!
            password: String!
            firstName: String!
            lastName: String!
            postalCode: String!
            termsAndConditions: Boolean!

            name: String
        }

        input UserUpdateInput {
            firstName: String!
            lastName: String!
            postalCode: String
        }

        input LocationInput {
            title: String
            address: String
            address2: String
            city: String
            country: String
            zipCode: String
        }

        input ParticipationInput {
            activityId: ID!
            additionalInformation: String
        }

        enum UserRole {
          GENERAL
          VOLUNTEER
          ORGANIZATION
          SPONSOR
        }

        type RootQuery {
            event(eventId: ID!): Event!
            events(query: String, orderBy: String): [Event!]!
            activity(activityId: ID!): Activity!
            activities: [Activity!]!
            organization(organizationId: ID!): Organization!
            organizations: [Organization!]!
            login(email: String!, password: String!): AuthData!
            participations: [Participation!]!
            currentUser: User
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            updateEvent(id: ID!, eventInput: EventInput!): Event!
            addEventTag(id: ID!, tagLabel: String!): Tag!
            updateEventTag(id: ID!, tag: TagUpdateInput!): Tag!
            deleteEventTag(id: ID!, tagId: ID!): Tag!

            createUser(userInput: UserInput!, userRole: UserRole!): User
            updateUserInfo(userInput: UserUpdateInput): User

            createActivity(activityInput: ActivityInput): Activity
            participate(participationInput: ParticipationInput): Participation

            registerOrganization(organizationInput: OrganizationInput, userInput: UserInput): Organization
            joinOrganization(organizationId: ID): Boolean
            leaveOrganization(organizationId: ID): Boolean
            updateOrganization(id: ID!, organizationInput: OrganizationInput!): Organization!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

`);
