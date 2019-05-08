import { Schema, model } from 'mongoose';

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

export default model('Participation', participationSchema);
