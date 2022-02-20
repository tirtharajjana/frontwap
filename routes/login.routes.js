const express = require("express");
const { response } = require("../app");
const router = express.Router();

const tokenService = require('../services/token.service');
const httpService = require('../services/http.service');

router.post('/', async (req, res) => {
    const token = await tokenService.createToken(req, 120);

    //getting user id
    const companyRes = await httpService.getRequest({
        endpoint: req.get('origin'),
        api: "/api/private/company",
        data: token
    });

    if (companyRes.body.isCompanyExist) {
        const uid = companyRes.body.data[0]._id;

    } else {
        res.json(companyRes);
    }
})

module.exports = router;