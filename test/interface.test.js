const request = require('supertest');
const express = require('express');
const chai = require('chai');
const assert = chai.assert;
const app = express();

const should = require('should');
const cookieParser = require('cookie-parser');

app.get('/admin', function(req, res) {
    res.status(200).json({ name: 'admin' });
});

request(app)
    .get('/admin')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '16')
    .expect(200)
    .end(function(err, res) {
        if (err) throw err;
    });

describe('GET /admin', function() {
    it('responds with json', function(done) {
        request(app)
            .get('/admin')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /admin', function() {
    it('responds with json', function(done) {
        request(app)
            .get('/admin')
            .auth('username', 'password')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /admin', function() {
    it('responds with json', function() {
        return request(app)
            .get('/admin')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert(response.body, '')
            })
    });
});



describe('request.agent(app)', function() {
    const app = express();
    app.use(cookieParser());

    app.get('/', function(req, res) {
        res.cookie('cookie', 'hey');
        res.send();
    });

    app.get('/return', function(req, res) {
        if (req.cookies.cookie) res.send(req.cookies.cookie);
        else res.send(':(')
    });

    const agent = request.agent(app);

    it('should save cookies', function(done) {
        agent
            .get('/')
            .expect('set-cookie', 'cookie=hey; Path=/', done);
    });

    it('should send cookies', function(done) {
        agent
            .get('/return')
            .expect('hey', done);
    });
});