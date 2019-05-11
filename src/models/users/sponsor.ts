import { Schema } from 'mongoose';
import User from './user';

const sponsorSchema = new Schema({
    extra: {
        type: String
    }
});

export default User.discriminator('Sponsor', sponsorSchema);
