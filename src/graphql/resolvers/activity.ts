import { compareDates, toDate } from '../../helpers/date';
import Activity from '../../models/activity';
import Event from '../../models/event';
import User from '../../models/users/user';
import { transformActivity, transformDateRange } from './merge';

export default {
    activities: async () => {
        try {
            const activities = await Activity.find();

            return activities.map(transformActivity);
        } catch (err) {
            throw err;
        }
    },
    activity: async args => {
        try {
            const activity = await Activity.findById(args.activityId);

            return transformActivity(activity);
        } catch (err) {
            throw err;
        }
    },
    createActivity: async ({activityInput}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        const transformedDate = transformDateRange(activityInput.date);

        if (compareDates(toDate(transformedDate.start), new Date()) === -1) {
            throw new Error('Start date should be greater or equal today date.');
        }

        if (transformedDate.end && compareDates(toDate(transformedDate.start), toDate(transformedDate.end)) === 1) {
            throw new Error('End date should be greater then start date.');
        }

        const fetchedEvent = await Event.findById(activityInput.eventId);

        const activity = new Activity({
            name: activityInput.name,
            description: activityInput.description,
            date: transformedDate,
            creator: req.userId,
            event: fetchedEvent,
            volunteersNeeded: activityInput.volunteersNeeded
        });
        let createdActivity;
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }
            if (!fetchedEvent) {
                throw new Error('Event not found.');
            }
            const result = await activity.save();
            createdActivity = transformActivity(result);

            // user.createdActivities.push(createdActivity);
            // await user.save();

            fetchedEvent.activities.push(createdActivity);
            await fetchedEvent.save();

            return createdActivity;
        } catch (err) {
            throw err;
        }
    }
};
