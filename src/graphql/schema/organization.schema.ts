export const organizationTypeDefs =
    `
        type Organization {
            _id: ID!
            email: String!
            firstName: String!
            lastName: String!
            name: String!
            description: String

            location: Location
            events: [Event!]
            members: [User!]!
        }

        input OrganizationInput {
            creatorId: ID
            name: String!
            description: String
            location: LocationInput
        }

        extend type Query {
            organization(organizationId: ID!): Organization!
            organizations: [Organization!]!
        }

        extend type Mutation {
            joinOrganization(organizationId: ID): Boolean
            leaveOrganization(organizationId: ID): Boolean
            updateOrganization(organizationInput: OrganizationInput!): Organization!
        }
    `
;
