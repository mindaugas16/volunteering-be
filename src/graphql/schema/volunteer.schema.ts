export const volunteerTypeDefs =
    `
        type Volunteer {
            _id: ID!
            firstName: String!
            lastName: String!
            activities: [Activity]
            achievements: [Achievement]
        }


        extend type Query {
            getVolunteer: Volunteer!
        }
    `
;
