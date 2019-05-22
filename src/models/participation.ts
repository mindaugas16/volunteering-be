import { Schema, model, Document } from 'mongoose';
import { VolunteerInterface } from 'models/users/volunteer';
import { ActivityInterface } from 'models/activity';

export interface ParticipationInterface extends Document {
    volunteer: VolunteerInterface;
    activity: ActivityInterface;
    additionalInformation: string;
    createdAt: string;
    updatedAt: string;
}

const participationSchema = new Schema({
    volunteer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    additionalInformation: {
        type: String
    }
}, { timestamps: true });

export default model<ParticipationInterface>('Participation', participationSchema);
