import Event from '../../models/event';
import User from '../../models/users/user';
import Tag from '../../models/tag';
import Organization from '../../models/users/organization';
import { transformDateRange, transformEvent } from './merge';

export default {
    events: async ({query, orderBy}) => {
        try {
            const events = await Event.find({title: {$regex: query, $options: 'i'}})
                .sort(orderBy);

            return events.map(event => transformEvent(event));
        } catch (err) {
            throw err;
        }
    },
    event: async args => {
        try {
            const event = await Event.findById(args.eventId);

            return transformEvent(event);
        } catch (err) {
            throw err;
        }
    },
    createEvent: async ({eventInput}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }
        try {
            const organization = await Organization.findById(req.userId);
            if (!organization) {
                throw new Error('Organization not found.');
            }

            const event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                date: transformDateRange(eventInput.date),
                location: eventInput.location,
                organization: organization._id,
                imagePath: eventInput.imagePath
            });
            const result = await event.save();

            organization.events.push(event);
            await organization.save();

            return transformEvent(result);
        } catch (err) {
            throw err;
        }
    },
    updateEvent: async ({id, eventInput}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }

            const event = await Event.findById(id);

            if (!event) {
                throw new Error('Event not found');
            }

            // if (!event.creator._id.equals(user._id)) {
            //     throw new Error('You can\'t update event details');
            // }

            event.title = eventInput.name;
            event.description = eventInput.description;
            event.date = eventInput.date;
            event.location = {...eventInput.location};

            const updatedEvent = await event.save();

            return transformEvent(updatedEvent);
        } catch (err) {
            throw err;
        }
    },
    addEventTag: async ({id, tagLabel}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }

            const event = await Event.findById(id);

            if (!event) {
                throw new Error('Event not found');
            }

            // if (!event.creator._id.equals(user._id)) {
            //     throw new Error('You can\'t add tags');
            // }

            const newTag = new Tag({label: tagLabel});
            event.tags.push(newTag);
            await event.save();

            return newTag;
        } catch (err) {
            throw err;
        }
    },
    updateEventTag: async ({id, tag}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }

            const event = await Event.findById(id);

            if (!event) {
                throw new Error('Event not found');
            }

            // if (!event.creator._id.equals(user._id)) {
            //     throw new Error('You can\'t update tag');
            // }
            const foundTagIndex = event.tags.findIndex(({_id}) => _id.equals(tag._id));
            if (foundTagIndex < 0) {
                throw new Error('Tag not found');
            }
            event.tags[foundTagIndex].label = tag.label;

            event.markModified('tags');
            await event.save();

            return event.tags[foundTagIndex];
        } catch (err) {
            throw err;
        }
    },
    deleteEventTag: async ({id, tagId}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }

            const event = await Event.findById(id);

            if (!event) {
                throw new Error('Event not found');
            }

            // if (!event.creator._id.equals(user._id)) {
            //     throw new Error('You can\'t delete tag');
            // }
            const foundTagIndex = event.tags.findIndex(tag => tag._id.equals(tagId));
            if (foundTagIndex < 0) {
                throw new Error('Tag not found');
            }
            const tempTag = event.tags[foundTagIndex];
            event.tags.splice(foundTagIndex, 1);

            event.markModified('tags');
            await event.save();

            return tempTag;
        } catch (err) {
            throw err;
        }
    }
};
