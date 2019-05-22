import { compareDates, toDate } from 'helpers/date';
import Activity from '../../models/activity';
import Organization from '../../models/users/organization';
import Event from '../../models/event';
import Volunteer from '../../models/users/volunteer';
import Participation from '../../models/participation';
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
            const organization = await Organization.findById(req.userId);
            if (!organization) {
                throw new Error('Organization not found.');
            }
            if (!fetchedEvent) {
                throw new Error('Event not found.');
            }
            const result = await activity.save();
            createdActivity = transformActivity(result);

            fetchedEvent.activities.push(createdActivity);
            await fetchedEvent.save();

            return createdActivity;
        } catch (err) {
            throw err;
        }
    },
    updateActivity: async ({id, activityInput}, req) => {
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

        try {
            const organization = await Organization.findById(req.userId);
            if (!organization) {
                throw new Error('Organization not found.');
            }

            const {eventId, ...rest} = activityInput;

            // return Activity.findOneAndUpdate({_id: id}, rest, {new: true}, (err, doc) => {
            //     if (err) {
            //         throw new Error(err);
            //     }
            //
            //     return transformActivity(doc);
            // });
            return null;

        } catch (err) {
            throw err;
        }
    },
    deleteActivity: async ({id}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const activity = await Activity.findById(id);

            // if (activity.event.organization._id.equals(req.id)) {
            //     throw new Error('You can not delete activity');
            // }

            await Activity.findByIdAndRemove(id);
            const event = await Event.findById(activity.event);
            (event.activities as any).pull(id);
            await event.save();

            return true;
        } catch (err) {
            throw err;
        }
    },
    registerToActivity: async ({activityId}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const activity = await Activity.findById(activityId);

            if (!activity) {
                throw new Error('Activity not found.');
            }

            const volunteer = await Volunteer.findById(req.userId);

            if (!volunteer) {
                throw new Error('Volunteer not found.');
            }

            if (activity.participation.find(v => v.volunteer._id === volunteer._id)) {
                throw new Error('You are already signed up.');
            }

            const participation = new Participation({
                volunteer,
                activity
            });

            const newParticipation = await participation.save();

            activity.participation.push(newParticipation._id);

            const updateActivity = await activity.save();

            volunteer.participation.push(participation._id);

            await volunteer.save();

            return transformActivity(updateActivity);
        } catch (err) {
            throw err;
        }
    }
};
