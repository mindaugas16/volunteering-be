import User from '../../models/users/user';
import Organization from '../../models/users/organization';
import Volunteer from '../../models/users/volunteer';
import { transformOrganization } from './merge';

export default {
    organizations: async ({query, location, page}) => {
        try {
            let condition = null;
            if (query) {
                condition = {organizationName: {$regex: query, $options: 'i'}};
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

            if (!page) {
                page = 1;
            }

            const perPage = 12;
            const organization = await Organization.find(condition)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .sort({createdAt: 1});

            return {
                organizations: organization.map(o => transformOrganization(o)),
                totalCount: Organization.count(condition)
            };
        } catch (err) {
            throw err;
        }
    },
    organization: async args => {
        try {
            const organization = await Organization.findById(args.organizationId);

            return transformOrganization(organization);
        } catch (err) {
            throw err;
        }
    },
    joinOrganization: async (args, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const volunteer = await Volunteer.findById(req.userId);
            if (!volunteer) {
                throw new Error('Volunteer not found.');
            }

            const organization = await Organization.findById(args.organizationId);

            if (!organization) {
                throw new Error('Organization not found.');
            }

            // if (user.organizations.indexOf(organization._id) > -1 || organization.members.indexOf(user._id) > -1 ||
            //     organization.creator._id.equals(user._id)) {
            //     throw new Error('You already joined this group');
            // }

            organization.members.push(volunteer._id);
            await organization.save();

            volunteer.organizations.push(args.organizationId);
            await volunteer.save();

            return true;
        } catch (err) {
            throw err;
        }
    },
    leaveOrganization: async (args, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 400;
            throw error;
        }

        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }

            const organization = await Organization.findById(args.organizationId);

            if (!organization) {
                throw new Error('Organization not found');
            }

            // if (organization.creator._id.equals(user._id)) {
            //     throw new Error('You can\'t leave your own organization');
            // }

            // if (user.organizations.indexOf(organization._id) === -1 || organization.members.indexOf(user._id) === -1) {
            //     throw new Error('You already left this organization');
            // }

            // organization.members.pull(user._id);
            // await organization.save();
            //
            // user.organizations.pull(organization._id);
            // await user.save();

            return true;
        } catch (err) {
            throw err;
        }
    },
    updateOrganization: async ({organizationInput}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }

        try {
            const organization = await Organization.findById(req.userId);

            if (!organization) {
                throw new Error('Organization not found');
            }

            // if (!organization.creator._id.equals(user._id)) {
            //     throw new Error('You can\'t update organization details');
            // }

            organization.organizationName = organizationInput.organizationName;
            organization.description = organizationInput.description;
            organization.location = organizationInput.location;
            organization.organizationLogo = organizationInput.organizationLogo;
            organization.organizationWebsite = organizationInput.organizationWebsite;

            const updatedOrganization = await organization.save();

            return transformOrganization(updatedOrganization);
        } catch (err) {
            throw err;
        }
    }
};
