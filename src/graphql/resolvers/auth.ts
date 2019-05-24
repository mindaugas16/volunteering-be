import crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { isEmail } from 'validator';
import User from '../../models/users/user';
import Volunteer from '../../models/users/volunteer';
import Organization from '../../models/users/organization';
import Sponsor from '../../models/users/sponsor';
import { transformUser } from './merge';
import * as nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { dateToString } from 'helpers/date';

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SEND_GRID_API_KEY
    }
}));

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
    },
    getResetToken: async ({email}, req) => {
        const buffer = crypto.randomBytes(32);

        try {
            const errors = [];

            if (!isEmail(email)) {
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

            const token = buffer.toString('hex');
            const user = await User.findOne({email});
            if (!user) {
                // Return true then user not found to doesn't let other users to know that this email address are registered to system
                return true;
            }

            if (user.resetTokenExpiresAt > Date.now()) {
                throw new Error('Something went wrong');
            }

            user.resetToken = token;
            user.resetTokenExpiresAt = Date.now() + 3600 * 1000;

            user.save();
            transporter.sendMail({
                to: user.email,
                from: 'no-reply@my-volunteering.herokuapp.com',
                subject: 'Password reset',
                html: `
                      <h1>Reset password</h1>
                      <p>You requested a password reset</p>
                      <p>Click this <a href="https://my-volunteering.herokuapp.com/auth/reset/${token}">link</a> to set a new password</p>
                        `
            });

            return true;
        } catch (err) {
            throw err;

        }
    },
    resetPassword: async ({token, password}, req) => {
        try {
            const user = await User.findOne({resetToken: token, resetTokenExpiresAt: {$gt: Date.now()}});
            if (!user) {
                throw new Error('Reset token is invalid');
            }
            user.passwordResetAt = dateToString(new Date());
            user.password = await bcrypt.hash(password, 12);
            user.resetToken = undefined;
            user.resetTokenExpiresAt = undefined;

            user.save();

            return true;
        } catch (err) {
            throw err;
        }
    },
    changePassword: async ({oldPassword, newPassword, repeatPassword}, req) => {
        if (!req.isAuth) {
            const error = new Error('Unauthenticated') as any;
            error.code = 401;
            throw error;
        }
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found');
            }

            const errors = [];

            const isEqual = await bcrypt.compare(oldPassword, user.password);


            if (!isEqual) {
                errors.push({
                    oldPassword: 'notMatchToCurrent'
                });
            } else {
                if (oldPassword === newPassword) {
                    errors.push({
                        newPassword: 'unique'
                    });
                }

                if (newPassword !== repeatPassword) {
                    errors.push({
                        repeatPassword: 'notMatch'
                    });
                }
            }

            if (errors.length) {
                const error = new Error('Invalid input') as any;
                error.data = errors;
                error.code = 400;
                throw error;
            }

            user.passwordResetAt = dateToString(new Date());
            user.password = await bcrypt.hash(newPassword, 12);

            user.save();

            return true;
        } catch (err) {
            throw err;
        }
    }
};
