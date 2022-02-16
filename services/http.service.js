const ajax = require('supertest');
const tokenService = require('../services/token.service')

const postRequest = (req) => {
    // console.log(token);
    ajax(req.endpoint)
        .post(req.api)
        .send({ token: req.data })
        .end((err, dataRes) => {
            console.log(dataRes.body);
        });
}

module.exports = {
    postRequest
}