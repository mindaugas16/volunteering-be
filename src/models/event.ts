import { Document, model, Schema } from 'mongoose';
import { OrganizationInterface } from './users/organization';

export interface EventInterface extends Document {
    title: string;
    description: string;
    date: any;
    location: any;
    organization: OrganizationInterface;
    activities: any[];
    tags: any[];
    imagePath: string;
}

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    date: {
        type: Schema.Types.Mixed
    },
    location: {
        type: Schema.Types.Mixed
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    activities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }
    ],
    tags: [
        {
            type: Schema.Types.Mixed
        }
    ],
    imagePath: {
        type: String
    }
}, {timestamps: true});

export default model<EventInterface>('Event', eventSchema);
