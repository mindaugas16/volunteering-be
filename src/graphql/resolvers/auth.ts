import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { isEmail } from 'validator';
import User from '../../models/users/user';
import Volunteer from '../../models/users/volunteer';
import Organization from '../../models/users/organization';
import Sponsor from '../../models/users/sponsor';
import { transformUser } from './merge';

export default {
    createUser: async ({userInput, userRole}) => {
        try {
            let type = null;
            const role: string = userRole;
            switch (userRole) {
                case 'VOLUNTEER':
                    type = Volunteer;
                    break;
                case 'ORGANIZATION':
                    type = Organization;
                    break;
                case 'SPONSOR':
                    type = Sponsor;
                    break;
                default:
                    type = User;
            }
            const user = await type.findOne({email: userInput.email});

            if (user) {
                throw new Error('User already exist!');
            }

            const errors = [];

            if (!isEmail(userInput.email)) {
                errors.push({
                    email: 'invalidEmail'
                });
            }

            if (!userInput.termsAndConditions) {
                errors.push({
                    termsAndConditions: 'required'
                });
            }

            if (errors.length) {
                const error = new Error('Invalid input') as any;
                error.data = errors;
                error.code = 400;
                throw error;
            }

            const {password, ...rest} = userInput;

            const hashedPassword = await bcrypt.hash(password, 12);
            const createdUser = new type({
                ...rest,
                password: hashedPassword,
                role
            });

            const result = await createdUser.save();

            return {
                ...result._doc,
                _id: result.id,
                password: null
            };

        } catch (error) {
            throw error;
        }
    },
    // createUser: async args => {
    //     try {
    //         const user = await User.findOne({ email: args.userInput.email });
    //
    //         if (user) {
    //             throw new Error('User already exist!');
    //         }
    //         const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    //         const createdUser = new User({
    //             email: args.userInput.email,
    //             firstName: args.userInput.firstName,
    //             lastName: args.userInput.lastName,
    //             postalCode: args.userInput.postalCode,
    //             password: hashedPassword,
    //         });
    //         const result = await createdUser.save();
    //         return {
    //             ...result._doc,
    //             _id: result.id,
    //             password: null
    //         }
    //
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    login: async (args, req) => {
        const errors = [];
        if (req.isAuth) {
            throw new Error('You\'re already logged in!');
        }

        if (!isEmail(args.email)) {
            const error = {
                message: 'Invalid email address'
            };
            errors.push(error);
        }

        if (errors.length) {
            const error = new Error('Invalid input') as any;
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findOne({email: args.email});
        const isEqual = await bcrypt.compare(args.password, user.password);

        if (!user || !isEqual) {
            throw new Error('Invalid credentials.');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            'somesupersecretkey',
            {
                expiresIn: '1h'
            }
        );

        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        };
    },
    currentUser: async (args, req) => {
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

            return transformUser(user);
        } catch (err) {
            throw err;
        }
    }
};
