import User from '../../models/users/user';
import Event from '../../models/event';
import Activity from '../../models/activity';
import Organization from '../../models/users/organization';
import DataLoader from 'dataloader';
import { dateToString } from '../../helpers/date';

const eventLoader = new DataLoader(eventIds => events(eventIds));

const activityLoader = new DataLoader(activityIds => activities(activityIds));

const userLoader = new DataLoader(userIds => users(userIds));

const organizationLoader = new DataLoader(ids => organizations(ids));

export const transformEvent = event =>
    ({
        ...event._doc,
        _id: event.id,
        date: transformDateRange(event.date),
        activities: activities.bind(this, event.activities),
        organization: organization.bind(this, event.organization),
        createdAt: dateToString(event._doc.createdAt),
        updatedAt: dateToString(event._doc.updatedAt),
        imagePath: event.imagePath
    });

export const transformUser = user =>
    ({
        ...user._doc,
        _id: user.id,
        password: null,
        organizations: () => organizationLoader.loadMany(user._doc.organizations)
    });

export const transformOrganization = organization =>
    ({
        ...organization._doc,
        _id: organization._id,
        creator: user.bind(this, organization.creator),
        members: users.bind(this, organization.members),
        events: () => eventLoader.loadMany(organization._doc.events)
    });

export const transformParticipation = participation =>
    ({
        ...participation._doc,
        _id: participation.id,
        volunteer: user.bind(this, participation._doc.volunteer),
        activity: singleActivity.bind(this, participation._doc.activity)
    });

export const transformDateRange = date =>
    ({
        start: dateToString(date.start),
        end: date.end ? dateToString(date.end) : null
    });

export const transformActivity = activity =>
    ({
        ...activity._doc,
        _id: activity.id,
        date: transformDateRange(activity._doc.date),
        creator: user.bind(this, activity._doc.creator),
        event: singleEvent.bind(this, activity._doc.event),
        createdAt: dateToString(activity._doc.createdAt),
        updatedAt: dateToString(activity._doc.updatedAt)
    });

export const transformBooking = booking =>
    ({
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    });

export const activities = async activityIds => {
    try {
        const foundActivities = await Activity.find({_id: {$in: activityIds}});

        return foundActivities.map(activity =>
            transformActivity(activity));
    } catch (err) {
        throw err;
    }
};

export const singleActivity = async activityId => {
    try {
        const activity = await activityLoader.load(activityId.toString());
        if (!activity) {
            throw new Error('Activity not found');
        }

        return activity;
    } catch (err) {
        throw err;
    }
};

export const users = async userIds => {
    try {
        return await User.find({_id: {$in: userIds}});
    } catch (err) {
        throw err;
    }
};

export const user = async userId => {
    try {
        const loadedUser = await userLoader.load(userId.toString());

        return {
            ...loadedUser._doc,
            _id: loadedUser.id,
            createdEvents: () => eventLoader.loadMany(loadedUser._doc.createdEvents),
            createdActivities: () => activityLoader.loadMany(loadedUser._doc.createdActivities)
        };
    } catch (err) {
        throw err;
    }
};

export const singleEvent = async eventId => {
    try {
        return await eventLoader.load(eventId.toString());
    } catch (err) {
        throw err;
    }
};

export const events = async eventIds => {
    try {
        const foundEvents = await Event.find({_id: {$in: eventIds}});

        return foundEvents.map(event =>
            transformEvent(event));
    } catch (err) {
        throw err;
    }
};

export const organization = async organizationId => {
    try {
        return await organizationLoader.load(organizationId.toString());
    } catch (err) {
        throw err;
    }
};

export const organizations = async organizationIds => {
    try {
        const foundOrganizations = await Organization.find({_id: {$in: organizationIds}});

        return foundOrganizations.map(item =>
            transformOrganization(item));
    } catch (err) {
        throw err;
    }
};
