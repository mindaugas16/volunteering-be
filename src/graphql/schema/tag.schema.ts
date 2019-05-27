export const tagTypeDefs = `

        type Tag {
            _id: ID!
            label: String!
        }

        input TagInput {
            label: String!
        }

        input TagUpdateInput {
            _id: ID!
            label: String!
        }

        extend type Query {
            relatedTags: [Tag!]
        }
    `
;
