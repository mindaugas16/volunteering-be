import { Schema } from 'mongoose';
import User from './user';

const sponsorSchema = new Schema({
    extra: {
        type: String
    },
    sponsoredEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

export default User.discriminator('Sponsor', sponsorSchema);
