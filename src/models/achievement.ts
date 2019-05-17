import { model, Schema, Document } from 'mongoose';

export interface AchievementInterface extends Document {
    _id: string;
    label: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    value: number;
}

const achievementSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

export default model<AchievementInterface>('Achievement', achievementSchema);
