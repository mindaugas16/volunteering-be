import { Schema } from 'mongoose';
import User, { UserInterface } from './user';

export interface OrganizationInterface extends UserInterface {
    name: string;
    description: string;
    location: string;
    events: any[];
    members: any[];
}

const organizationSchema = new Schema({
    name: {
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
    ]
});

export default User.discriminator<OrganizationInterface>('Organization', organizationSchema);
