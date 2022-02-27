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

const countClients = async (req, res) => {
    const tokenData = await tokenService.verifyToken(req);
    if (tokenData.isVerified) {
        const dataRes = await dbService.countData('client');
        res.status(200);
        res.json({
            data: dataRes
        })
    } else {
        res.status(401);
        res.json({
            message: "Permission denied"
        });
    }
}
const paginate = async (req, response) => {
    const tokenData = await tokenService.verifyToken(req);
    if (tokenData.isVerified) {
        let from = Number(req.params.from);
        let to = Number(req.params.to);
        const dataRes = await dbService.paginate(from, to, 'client');
        response.status(200);
        response.json({
            data: dataRes
        });
    }
    else {
        response.status(401);
        response.json({
            message: "Permission denied"
        });
    }

}

const deleteClients = async (req, res) => {
    const tokenData = await tokenService.verifyToken(req);
    if (tokenData.isVerified) {
        const id = req.params.id;
        const deleteRes = await dbService.deleteById(id, 'client');
        res.status(200);
        res.json({
            data: deleteRes
        })
    }
    else {
        res.status(401);
        res.json({
            message: "Permission denied"
        });
    }
}

module.exports = {
    create: create,
    countClients,
    paginate,
    deleteClients
}
