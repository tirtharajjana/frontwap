const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");

router.get('/', (req, res) => {
    res.render('profile')
})


module.exports = router;