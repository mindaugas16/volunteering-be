import Volunteer from '../../models/users/volunteer';

export default {
    getVolunteer: async (args, req) => {
        try {
            return await Volunteer.findById(req.userId);
        } catch (err) {
            throw err;
        }
    }
};
