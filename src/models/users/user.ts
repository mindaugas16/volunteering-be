import { Document, model, Schema } from 'mongoose';

export interface UserInterface extends Document {
    _doc: any;
    _id: any;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    activities: any[];
    postalCode: string;
    passwordResetAt: string;

    resetToken: string;
    resetTokenExpiresAt: number;
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
    role: {
        type: String,
        required: true
    },
    passwordResetAt: String,
    resetToken: String,
    resetTokenExpiresAt: Date
});

export default model<UserInterface>('User', userSchema);
