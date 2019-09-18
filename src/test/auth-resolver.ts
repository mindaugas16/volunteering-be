import { expect } from 'chai';
import sinon from 'sinon';

import User from '../models/users/user';
import AuthResolver from '../graphql/resolvers/auth';

// describe('Auth resolver login', () => {
//     it('should throw error if database fails', () => {
//         const stub = sinon.stub(User, 'findOne');
//         stub.throws();
//
//         const args = {
//             email: 'test@test.lt',
//             password: 'test'
//         };
//
//         const req = {
//             isAuth: true
//         };
//
//         AuthResolver.login(args, req).catch(error => {
//             expect(error).to.be.an('error');
//         });
//
//         stub.restore();
//     });
// });
