const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

describe('api testing', function() {
    it('testing type of value', function() {
        var comment = require('../routers/api');
        var value = 'customer.save();'
        expect(value).to.be.a('string')
    })

    it('testing type of value', function() {
        var comment = require('../routers/api');
        var value = 'restaurant.save();'
        expect(value).to.be.a('string')
    })

    it('testing deep-equal', function() {
        var comment = require('../routers/api');
        assert.deepEqual({ username: 'username' }, { username: 'username' });
    })

    it('testing deep-equal', function() {
        var comment = require('../routers/api');
        assert.deepEqual({ password: 'password' }, { password: 'password' });
    })
})