
import supertest from "supertest"

describe('user test', () => {
    const host = "http://localhost:9091/api"
    describe('user create', () => {
        const userCreate = '/user/create'
        it(userCreate, function(done) {
            supertest(host)
            .post(userCreate)
            .send({
                name: "test",
                address: "addr",
                description: "123"
            })
            .expect(200)
            .end((err, res) => {
                done()
            })
        })
    })
    describe('user update', () => {
        const userCreate = '/user/update'
        it(userCreate, function(done) {
            supertest(host)
            .post(userCreate)
            .send({
                id: "2",
                name: "test2",
                address: "addr",
                description: "123"
            })
            .expect(200)
            .end((err, res) => {
                done()
            })
        })
    })
    describe('user search', () => {
        const userCreate = '/user/search'
        it(userCreate, function(done) {
            supertest(host)
            .get(userCreate)
            .send({
                pageSize: 10,
                pageNo: 1,
                isLoadAll: false
            })
            .expect(200)
            .end((err, res) => {
                done()
            })
        })
    })
    describe('user delete', () => {
        const userCreate = '/user/delete'
        it(userCreate, function(done) {
            supertest(host)
            .put(userCreate)
            .send({
                ids: [2]
            })
            .expect(200)
            .end((err, res) => {
                done()
            })
        })
    })
})