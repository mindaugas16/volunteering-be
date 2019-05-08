import { Schema, model, Document } from 'mongoose';

export interface ActivityInterface extends Document {
    participations: any[];
}

const activitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Schema.Types.Mixed
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    volunteersNeeded: {
        type: Number,
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    tags: [
        {
            type: String
        }
    ],
    participations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Participation'
        }
    ],
    volunteers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    requirements: {
        type: String
    }
}, { timestamps: true });

export default model<ActivityInterface>('Activity', activitySchema);
