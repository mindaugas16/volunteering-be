import { Schema } from 'mongoose';
import User, { UserInterface } from './user';

export interface OrganizationInterface extends UserInterface {
    organizationName: string;
    description: string;
    location: string;
    events: any[];
    members: any[];
    organizationLogo: string;
    organizationWebsite: string;
}

const organizationSchema = new Schema({
    organizationName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    location: {
        type: Schema.Types.Mixed
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Volunteer'
        }
    ],
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    organizationLogo: String,
    organizationWebsite: String
});

export default User.discriminator<OrganizationInterface>('Organization', organizationSchema);
