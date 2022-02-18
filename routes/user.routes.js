const express = require('express');
const router = express.Router();

const tokenService = require('../services/token.service')
const httpService = require('../services/http.service')

router.post('/', async (req, res) => {
    res.send("success")
})

module.exports = router;