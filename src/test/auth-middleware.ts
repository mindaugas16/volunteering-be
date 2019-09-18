import { expect } from 'chai';
import isAuth from '../middleware/is-auth';

it('should return isAuth=false if header is not presented', () => {
    const req = {
        get: headerName => null
    };

    isAuth(req, {}, () => {
    });
    expect(req).to.have.property('isAuth', false);
});

it('should yield a userId after decoding token', () => {
    const req = {
        // tslint:disable-next-line:max-line-length
        get: headerName => 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzlkMmFjMzQ1YzBiODJhYmYzNjVlYmIiLCJlbWFpbCI6InRlc3RAdGVzdC5sdCIsImlhdCI6MTU2ODgwOTgxMywiZXhwIjoxNTY4ODEzNDEzfQ.v-iEgz2XZUjL6Vm108tbz5--Ed8pO_m7IZ-NOcqUANQ'
    };

    isAuth(req, {}, () => {
    });

    expect(req).to.have.property('userId');
});
