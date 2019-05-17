import { Schema } from 'mongoose';
import User, { UserInterface } from './user';
import { OrganizationInterface } from 'models/users/organization';
import { AchievementInterface } from 'models/achievement';
import { ActivityInterface } from 'models/activity';

export interface VolunteerInterface extends UserInterface {
    organizations: OrganizationInterface[];
    achievements: AchievementInterface[];
    activities: ActivityInterface[];
}

const volunteerSchema = new Schema({
    participations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Participation'
        }
    ],
    skills: [
        {
            type: String
        }
    ],
    interests: [
        {
            type: String
        }
    ],
    achievements: [
        {
            type: Schema.Types.Mixed
        }
    ],
    organizations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        }
    ],
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    activities: [
        {
            type: Schema.Types.Mixed
        }
    ]
});

export default User.discriminator<VolunteerInterface>('Volunteer', volunteerSchema);
