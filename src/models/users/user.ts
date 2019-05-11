import { Document, model, Schema } from 'mongoose';

export interface UserInterface extends Document {
    _id: any;
    _doc: any;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdActivities: any[];
    activities: any[];
    postalCode: string;
    bio: string;
    organizations: any[];
    createdEvents: any[];
    participations: any[];
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    contacts: {
        type: String
    },
    bio: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    createdActivities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }
    ],
    organizations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        }
    ]
});

export default model<UserInterface>('User', userSchema);
