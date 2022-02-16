require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const issService = require("./iss.service")

const create = async (req, expiresIn) => {
    const formdata = req.body;
    const endpoint = req.get("origin");
    const api = req.originalUrl;
    // console.log({ endpoint, api });
    const iss = endpoint + api;

    const token = await jwt.sign({
        iss,
        data: formdata
    }, secretKey, { expiresIn });
    return token;
}

const verify = (req) => {
    const token = req.body.token;
    if (token) {
        try {
            const tmp = jwt.verify(token, secretKey);
            const requestCommingFrom = tmp.iss;

            if (issService.indexOf(requestCommingFrom) != -1) {
                return {
                    isVerified: true,
                    data: tmp.data
                };
            } else {
                return {
                    isVerified: false,

                };
            }

        } catch (error) {
            return {
                isVerified: false,

            };
        }
    } else {
        return {
            isVerified: false,

        };
    }

}

module.exports = {
    createToken: create,
    verifyToken: verify
}