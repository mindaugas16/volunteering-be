export const participationTypeDefs =
    `
        type Participation {
            _id: ID!
            volunteer: Volunteer!
            activity: Activity!
        }

        input ParticipationInput {
            volunteer: ID!
            activity: ID!
        }

        extend type Query {
            participation: [Participation]
        }
    `;
