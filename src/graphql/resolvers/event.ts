import Event from '../../models/event';
import User from '../../models/users/user';
import Tag from '../../models/tag';
import Organization from '../../models/users/organization';
import Volunteer from '../../models/users/volunteer';
import Achievement from '../../models/achievement';
import { transformDateRange, transformEvent } from './merge';
import { clearImage } from 'helpers/file';
import * as faker from 'faker';
import { EventStatus } from 'types/event-status.enum';

export default {
    events: async ({query, location, orderBy, statuses, tags, organizationIds, page}) => {
        try {
            let condition = null;
            if (query) {
                condition = {title: {$regex: query, $options: 'i'}};
            }

            if (statuses && statuses.length) {
                condition = {...condition, status: {$in: statuses}};
            }

            if (location) {
                condition = {
                    ...condition, $or: [
                        {'location.address': {$regex: location, $options: 'i'}},
                        {'location.city': {$regex: location, $options: 'i'}},
                        {'location.country': {$regex: location, $options: 'i'}}
                    ]
                };
            }

            if (tags && tags.length) {
                condition = {
                    ...condition,
                    'tags.label': {$in: tags}
                };
            }

            if (organizationIds && organizationIds.length) {
                condition = {
                    ...condition,
                    organization: {$in: organizationIds}
                };
            }

            if (!page) {
                page = 1;
            }

            const perPage = 12;
            let events = await Event.find(condition)
                .sort({updatedAt: -1})
                .skip((page - 1) * perPage)
                .limit(perPage);

            if (orderBy) {
                events = events.sort(orderBy);
            }

            return {
                events: events.map(event => transformEvent(event)),
                totalCount: Event.count(condition)
            };
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

            const sameEvent = await Event.findOne({title: eventInput.title});

            if (sameEvent) {
                throw new Error('Event title should be unique.');
            }

            const event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                date: transformDateRange(eventInput.date),
                location: eventInput.location,
                organization: organization._id,
                imagePath: eventInput.imagePath,
                customFields: eventInput.customFields,
                status: eventInput.status
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
            const organization = await Organization.findById(req.userId);
            if (!organization) {
                throw new Error('Organization not found.');
            }

            const event = await Event.findById(id);

            const imagePath = event.imagePath;

            if (eventInput.imagePath) {
                if (eventInput.imagePath !== 'remove') {
                    event.imagePath = eventInput.imagePath;
                } else if (imagePath) {
                    clearImage(imagePath);
                    event.imagePath = null;
                }
            }

            if (!organization._id.equals(event.organization._id)) {
                throw new Error('You can not update this event');
            }

            if (!event.status) {
                throw new Error('Event status is required');
            }

            event.title = eventInput.title;
            event.description = eventInput.description;
            event.date = eventInput.date;
            event.location = eventInput.location;
            event.status = eventInput.status;
            event.customFields = eventInput.customFields;

            const savedEvent = await event.save();

            return transformEvent(savedEvent);
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
            const user = await Organization.findById(req.userId);
            if (!user) {
                throw new Error('Organization not found.');
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

            return true;
        } catch (err) {
            throw err;
        }
    },
    rewardVolunteers: async ({eventId, achievements, volunteerIds}, req) => {
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

            const event = await Event.findById(eventId);

            if (!event) {
                throw new Error('Event not found');
            }

            const newAchievements = achievements.reduce(async (acc, a) => {
                const achievement = await new Achievement(a);
                acc.push(achievement);

                return acc;
            }, []);

            await newAchievements.then(async achievementsValues => {
                await volunteerIds.forEach(async id => {
                    const volunteer = await Volunteer.findById(id);

                    if (!volunteer) {
                        throw new Error('Volunteer not found');
                    }

                    volunteer.achievements.push(...achievementsValues);
                    volunteer.markModified('achievements');
                    volunteer.save();
                });
            });

            return true;
        } catch (err) {
            throw err;
        }
    },
    mockEvents: async ({count, organizationId}, req) => {
        const organization = await Organization.findById(organizationId);

        if (!organization) {
            throw new Error('Organization not found');
        }

        const events = [];
        let i = 0;

        while (i < count) {
            const status = EventStatus.PUBLIC;
            const title = faker.company.catchPhraseAdjective();
            const description = faker.lorem.paragraph(3);
            const date = {
                start: faker.date.recent(faker.random.number({min: 2, max: 10}) * -1),
                end: faker.date.recent(faker.random.number({min: 11, max: 20}) * -1)
            };
            const location = null;

            const event = new Event({
                title,
                status,
                description,
                date,
                location,
                organization: organizationId
            });

            events.push(event);
            i++;
        }

        return Event.insertMany(events)
            .then(e => {
                organization.events.push(...e.map(event => event._id));
                organization.markModified('events');
                organization.save();

                return e;
            });
    }
};
