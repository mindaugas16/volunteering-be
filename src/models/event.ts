import { Document, model, Schema } from 'mongoose';
import { OrganizationInterface } from './users/organization';
import { EventStatus } from 'types/event-status.enum';
import { ActivityInterface } from 'models/activity';

export interface EventInterface extends Document {
    title: string;
    description: string;
    date: any;
    location: any;
    organization: OrganizationInterface;
    activities: ActivityInterface[];
    tags: any[];
    imagePath: string;
    status: EventStatus;
    customFields: any[];
}

const eventSchema = new Schema({
    status: {
        type: Number,
        required: true
    },
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
    customFields: [
        {
            type: Schema.Types.Mixed
        }
    ],
    imagePath: {
        type: String
    }
}, {timestamps: true});

export default model<EventInterface>('Event', eventSchema);
