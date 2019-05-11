import { Document, model, Schema } from 'mongoose';
import { TagInterface } from '../../../volunteering-fe/src/app/ui-elements/tag/tag.interface';

export interface EventInterface extends Document {
    title: string;
    description: string;
    date: any;
    location: any;
    organization: any;
    creator: any;
    activities: any[];
    tags: any[];
    sponsors: any[];
    categories: any[];
    imagePath: string;
}

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    sponsors: [
        {
            type: String
        }
    ],
    categories: [
        {
            type: String
        }
    ],
    imagePath: {
        type: String
    }
}, {timestamps: true});

export default model<EventInterface>('Event', eventSchema);
