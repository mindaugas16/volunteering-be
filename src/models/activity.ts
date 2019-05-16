import { Schema, model, Document } from 'mongoose';
import { UserInterface } from 'models/users/user';
import { EventInterface } from 'models/event';

export interface ActivityInterface extends Document {
    name: string;
    description: string;
    date: any;
    volunteersNeeded: number;
    event: EventInterface;
    tags: string[];
    volunteers: UserInterface[];
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
    volunteers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Volunteer'
        }
    ]
}, { timestamps: true });

export default model<ActivityInterface>('Activity', activitySchema);
