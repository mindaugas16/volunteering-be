import Event from '../../models/event';

export default {
    relatedTags: async (args, req) => {
        try {
            const events = await Event.find({tags: {$exists: true, $not: {$size: 0}}})
                .limit(20);

            return events.reduce((acc, {tags}) => {
                acc.push(...tags);

                return acc;
            }, []);
        } catch (err) {
            throw err;
        }
    }
};
