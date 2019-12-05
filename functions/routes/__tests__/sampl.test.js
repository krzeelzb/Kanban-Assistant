
const mongoose = require('mongoose');
const UserModel = require('./user');
const ColumnModel = require('./column');
const CardModel = require('./card');
const request = require('supertest');
const app = require('../../server');
describe('Column Endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost/trello", { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });
    it('should return all columns', async () => {
        const res = await request(app)
            .get('/api/all')

        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('message')
    })
})
