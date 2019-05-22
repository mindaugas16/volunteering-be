import { Document, model, Schema } from 'mongoose';
import { EventInterface } from 'models/event';
import { ParticipationInterface } from 'models/participation';

export interface ActivityInterface extends Document {
    name: string;
    description: string;
    date: any;
    volunteersNeeded: number;
    event: EventInterface;
    tags: string[];
    participation: ParticipationInterface[];
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
    participation: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Participation'
        }
    ]
}, {timestamps: true});

export default model<ActivityInterface>('Activity', activitySchema);
