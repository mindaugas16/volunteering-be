import authResolver from './auth';
import eventResolver from './event';
import activityResolver from './activity';
import participationResolver from './participation';
import organizationResolver from './organization';
import userResolver from './user';
import volunteerResolver from './volunteer';
import tagResolver from './tag';

const rootResolvers = {
    ...authResolver,
    ...eventResolver,
    ...activityResolver,
    ...participationResolver,
    ...organizationResolver,
    ...userResolver,
    ...volunteerResolver,
    ...tagResolver
};

export default rootResolvers;
