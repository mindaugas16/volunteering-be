import Participation from '../../models/participation';
import { transformParticipation } from './merge';

export default {
    participation: async (args, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 400;
            throw error;
        }

        try {
            const participation = await Participation.find({volunteer: req.userId});

            return participation.map(p =>
                transformParticipation(p));
        } catch (err) {
            throw err;
        }
    }
};
