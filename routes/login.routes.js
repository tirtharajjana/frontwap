const express = require("express");
const { response } = require("../app");
const router = express.Router();

const tokenService = require('../services/token.service');
const httpService = require('../services/http.service');
const bcryptService = require('../services/bcrypt.service');

router.post('/', async (req, res) => {
    const token = await tokenService.createToken(req, 120);

    //getting user id
    const companyRes = await httpService.getRequest({
        endpoint: req.get('origin'),
        api: "/api/private/company",
        data: token
    });

    if (companyRes.body.isCompanyExist) {
        const query = {
            body: {
                uid: companyRes.body.data[0]._id
            },
            endpoint: req.get('origin'),
            api: '/api/private/user',
            iss: req.get('origin') + req.originalUrl
        }

        const uidToken = await tokenService.createCustomToken(query, 120);
        const passwordRes = await httpService.getRequest({
            endpoint: req.get('origin'),
            api: "/api/private/user",
            data: uidToken
        });

        if (passwordRes.body.isCompanyExist) {
            const realPassword = passwordRes.body.data[0].password;
            // console.log(realPassword, req.body.password);
            const isLogged = await bcryptService.decrypt(realPassword, req.body.password);
            if (isLogged) {
                const authToken = await tokenService.createCustomToken(query, 604800);//7 days
                res.cookie("authToken", authToken, { maxAge: 604800 });//7 days
                res.status(200);
                res.json({
                    isLogged: true,
                    message: 'success'
                })
            } else {
                res.status(401);
                res.json({
                    isLogged: false,
                    message: 'Wrong Password'
                })
            }
        } else {
            res.status(passwordRes.status);
            res.json(passwordRes.body)
        }
    } else {
        res.status(companyRes.status)
        res.json(companyRes.body);
    }
})

module.exports = router;