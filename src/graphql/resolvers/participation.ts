import Participation from '../../models/participation';
import Activity from '../../models/activity';
import Volunteer from '../../models/users/volunteer';
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
    },
    deleteParticipation: async ({activityId}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 400;
            throw error;
        }

        try {
            const participation = await Participation.findOneAndRemove({activity: activityId, volunteer: req.userId});

            const activity = await Activity.findById(activityId);

            const foundIndex = activity.participation.findIndex(p => p._id === participation._id);

            activity.participation.splice(foundIndex, 1);

            activity.markModified('participation');
            activity.save();

            const volunteer = await Volunteer.findById(req.userId);
            const volunteerFoundIndex = volunteer.participation.findIndex(p => p._id === participation._id);
            volunteer.participation.splice(volunteerFoundIndex, 1);

            volunteer.markModified('participation');
            volunteer.save();

            return true;
        } catch (err) {
            throw err;
        }
    }
};
