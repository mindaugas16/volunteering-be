import authResolver from './auth';
import eventResolver from './event';
import activityResolver from './activity';
import participationResolver from './participation';
import organizationResolver from './organization';
import userResolver from './user';
import volunteerResolver from './volunteer';

const rootResolvers = {
    ...authResolver,
    ...eventResolver,
    ...activityResolver,
    ...participationResolver,
    ...organizationResolver,
    ...userResolver,
    ...volunteerResolver
};

export default rootResolvers;
