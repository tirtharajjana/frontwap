const tokenService = require('../services/token.service')
const dbService = require('../services/database.service')

const createCompany = async (req, res) => {
    // console.log(req.body);
    const token = tokenService.verifyToken(req);

    if (token.isVerified) {
        const data = token.data;
        try {
            const dataRes = await dbService.createRecord(data);
            res.status(200);
            res.json({
                isCompanyCreated: true,
                message: "Compnay Created",
                data: dataRes
            })

        } catch (error) {
            // console.log(error);
            res.status(409);
            res.json({
                isCompanyCreated: false,
                message: error
            })
        }
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