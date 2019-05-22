export const sharedTypeDefs = `

        type Achievement {
            _id: ID!
            label: String!
            value: Int
            icon: String
        }

        type Location {
            title: String
            address: String
            address2: String
            city: String
            country: String
            zipCode: String
        }

        type DateRange {
            start: String!
            end: String
        }

        input DateRangeInput {
            start: String!
            end: String
        }

        input AchievementInput {
            label: String!
            icon: String
            value: Int
        }

        input LocationInput {
            title: String
            address: String
            address2: String
            city: String
            country: String
            zipCode: String
        }
    `
;
