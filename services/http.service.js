const ajax = require('supertest');
const tokenService = require('../services/token.service')

const postRequest = async (req) => {
    // console.log(token);
    const res = await ajax(req.endpoint)
        .post(req.api)
        .send({ token: req.data });
    return res;
}

module.exports = {
    postRequest
}