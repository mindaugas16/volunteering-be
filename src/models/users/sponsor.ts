import { Schema } from 'mongoose';
import User, { UserInterface } from './user';

export interface SponsorInterface extends UserInterface {
    _id: string;
    sponsorName: string;
    sponsorLogo: string;
    sponsorWebsite: string;
}

const sponsorSchema = new Schema({
    sponsorName: {
        type: String,
        required: true,
        unique: true
    },
    organizationLogo: String,
    sponsorWebsite: String,
    extra: String,
    sponsoredEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

export default User.discriminator<SponsorInterface>('Sponsor', sponsorSchema);
