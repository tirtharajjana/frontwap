require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

router.post('/', (req, res) => {
    const formdata = req.body;
    const token = jwt.sign({
        iss: "",
        data: formdata
    }, secretKey, { expiresIn: 120 });
})

module.exports = router;