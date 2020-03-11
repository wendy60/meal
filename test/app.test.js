const chai = require('chai');
const request = require('supertest')

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

var app = require('../app.js');


describe('app testing', function() {
    it('testing', function() {
        var value = 'req.userInfo';
        expect(value).to.be.a('string')
    })
})

/*describe("#test express app", function() { //http测试
    let server;
    before(function() { //执行测试用例前开启服务器
        // runs before all tests in this block
        server = app.listen(9000);
    });

    after(function() { //执行完后关闭服务器监听
        // runs after all tests in this block
        server.close();
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });
    describe('#test server', function() {
        it('#test get /', function(done) {
            request(server)
                .get('/')
                .query({ n: 1 })
                .expect(200, function(err, res) {
                    if (err) {
                        console.log(err)
                        done(err)
                    } else {
                        console.log(res.body)
                        done()
                    }
                })
        });
        it('#test post /send', function(done) {
            request(server)
                .post("/send")
                .send({ name: "wushichao" })
                .expect(200, function(err, res) {
                    if (err) {
                        console.log(err)
                        done(err)
                    } else {
                        console.log(res.body)
                        done()
                    }
                })
        })
    })
})*/