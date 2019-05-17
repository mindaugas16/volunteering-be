export const volunteerTypeDefs =
    `
        type Volunteer {
            _id: ID!
            firstName: String!
            activities: [Activity]
            achievements: [Achievement]
        }


        extend type Query {
            getVolunteer: Volunteer!
        }
    `
;
