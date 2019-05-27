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
            organizationLogo: String
            organizationWebsite: String
        }

        type OrganizationsResults {
            totalCount: Int
            organizations: [Organization!]!
        }

        input OrganizationInput {
            creatorId: ID
            organizationName: String!
            description: String
            location: LocationInput
            organizationLogo: String
            organizationWebsite: String
        }

        extend type Query {
            organization(organizationId: ID!): Organization!
            organizations(query: String, location: String, page: Int): OrganizationsResults
        }

        extend type Mutation {
            joinOrganization(organizationId: ID): Boolean
            leaveOrganization(organizationId: ID): Boolean
            updateOrganization(organizationInput: OrganizationInput!): Organization!
        }
    `
;
