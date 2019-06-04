export const userTypeDefs = `
     type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
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
           organizations: [Organization]
    }

    input UserInput {
            email: String!
            password: String!
            firstName: String!
            lastName: String!
            postalCode: String!
            termsAndConditions: Boolean!

            organizationName: String
            sponsorName: String
    }

    input UserUpdateInput {
            firstName: String!
            lastName: String!
            postalCode: String
    }

    enum UserRole {
          GENERAL
          VOLUNTEER
          ORGANIZATION
          SPONSOR
    }

    extend type Query {
        login(email: String!, password: String!): AuthData!
        currentUser: User
    }

    extend type Mutation {
         createUser(userInput: UserInput!, userRole: UserRole!): User
         updateUserInfo(userInput: UserUpdateInput): User
         changePassword(oldPassword: String!, newPassword: String!, repeatPassword: String!): Boolean
         deleteUser: Boolean
    }
  `;
