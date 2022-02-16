const express = require('express');
const router = express.Router();

const tokenService = require('../services/token.service')
const httpService = require('../services/http.service')

router.post('/', async (req, res) => {
    const token = await tokenService.createToken(req, 120);

    httpService.postRequest({
        endpoint: req.get("origin"),
        api: "/api/private/company",
        data: token
    });
})

module.exports = router;