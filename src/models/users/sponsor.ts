import { Schema } from 'mongoose';
import User, { UserInterface } from './user';

export interface SponsorInterface extends UserInterface {
    _id: string;
    sponsorName: string;
}

const sponsorSchema = new Schema({
    sponsorName: {
        type: String,
        required: true,
        unique: true
    },
    extra: String,
    sponsoredEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

export default User.discriminator<SponsorInterface>('Sponsor', sponsorSchema);
