const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const create = async (request, response) => {
    const tokenData = await tokenService.verifyToken(request);
    if (tokenData.isVerified) {
        const data = request.body;
        data['companyId'] = tokenData.data.uid;
        try {
            const dataRes = await dbService.createRecord(data, 'client');
            response.status(200);
            response.json({
                message: "Record created",
                data: dataRes
            });
        }
        catch (error) {
            response.status(409);
            response.json({
                message: "Record not created",
                error: error
            });
        }
    }
    else {
        response.status(401);
        response.json({
            message: "Permission denied"
        });
    }
}

module.exports = {
    create: create
}
