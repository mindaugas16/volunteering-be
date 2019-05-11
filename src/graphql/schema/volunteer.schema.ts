export const volunteerTypeDefs =
    `
        type Volunteer {
            _id: ID!
            firstName: String!
            activities: [Activity]
        }
    `
;
