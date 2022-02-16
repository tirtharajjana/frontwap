const tokenService = require('../services/token.service')

const createCompany = (req, res) => {
    // console.log(req.body);
    const token = tokenService.verifyToken(req);

    if (token.isVerified) {
        const data = token.data;

    } else {
        res.status(401);
        res.json({
            message: "Permission Denied"
        })
    }

}


module.exports = {
    createCompany
}