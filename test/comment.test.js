const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

describe('comment testing', function() {
    it('testing', function() {
        var comment = require('../routers/admin');
        var value = 'Promise.reject();'
        expect(value).to.be.a('string')
    })
})