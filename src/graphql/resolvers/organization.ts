import User from '../../models/user';
import Organization from '../../models/organization';
import { transformOrganization } from './merge';
import bcrypt from 'bcryptjs';
import isEmail from 'validator/lib/isEmail';

export default {
    registerOrganization: async ({organizationInput, userInput}) => {
        try {
            const user = await Organization.findOne({email: userInput.email});

            if (user) {
                throw new Error('User already exist!');
            }

            const errors = [];

            if (!isEmail(userInput.email)) {
                errors.push({
                    email: 'invalidEmail'
                });
            }

            if (errors.length) {
                const error = new Error('Invalid input') as any;
                error.data = errors;
                error.code = 400;
                throw error;
            }

            const hashedPassword = await bcrypt.hash(userInput.password, 12);

            const organization = new Organization({
                email: userInput.email,
                firstName: userInput.firstName,
                lastName: userInput.lastName,
                postalCode: userInput.postalCode,
                password: hashedPassword,
                name: organizationInput.name,
                description: organizationInput.description,
                location: organizationInput.location
            });
            const result = await organization.save();

            return transformOrganization(result);
        } catch (err) {
            throw err;
        }
    },
    organizations: async () => {
        try {
            const organization = await Organization.find();

            return organization.map(event =>
                transformOrganization(event));
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
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found.');
            }

            const organization = await Organization.findById(args.organizationId);

            if (!organization) {
                throw new Error('Organization not found.');
            }

            // if (user.organizations.indexOf(organization._id) > -1 || organization.members.indexOf(user._id) > -1 ||
            //     organization.creator._id.equals(user._id)) {
            //     throw new Error('You already joined this group');
            // }

            organization.members.push(user._id);
            await organization.save();

            user.organizations.push(args.organizationId);
            await user.save();

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

            if (user.organizations.indexOf(organization._id) === -1 || organization.members.indexOf(user._id) === -1) {
                throw new Error('You already left this organization');
            }

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
    updateOrganization: async ({id, organizationInput}, req) => {
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

            const organization = await Organization.findById(id);

            if (!organization) {
                throw new Error('Organization not found');
            }

            // if (!organization.creator._id.equals(user._id)) {
            //     throw new Error('You can\'t update organization details');
            // }

            organization.name = organizationInput.name;
            organization.description = organizationInput.description;
            organization.location = {...organizationInput.location};

            const updatedOrganization = await organization.save();

            return transformOrganization(updatedOrganization);
        } catch (err) {
            throw err;
        }
    }
};
