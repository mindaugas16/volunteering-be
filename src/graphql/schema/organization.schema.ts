export const organizationTypeDefs =
    `
        type Organization {
            _id: ID!
            email: String!
            firstName: String!
            lastName: String!
            organizationName: String!
            description: String

            location: Location
            events: [Event!]
            members: [User!]!
        }

        input OrganizationInput {
            creatorId: ID
            organizationName: String!
            description: String
            location: LocationInput
        }

        extend type Query {
            organization(organizationId: ID!): Organization!
            organizations(query: String, location: String): [Organization!]!
        }

        extend type Mutation {
            joinOrganization(organizationId: ID): Boolean
            leaveOrganization(organizationId: ID): Boolean
            updateOrganization(organizationInput: OrganizationInput!): Organization!
        }
    `
;
