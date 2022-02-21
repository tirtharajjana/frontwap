const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const create = async (request, response) => {
  const token = tokenService.verifyToken(request);
  if (token.isVerified) {
    try {
      const userRes = await databaseService.createRecord(token.data, 'user');
      response.status(200);
      response.json({
        isUserCreated: true,
        message: "user created !"
      });
    }
    catch (error) {
      response.status(500);
      response.json({
        isUserCreated: false,
        message: "Internal server error"
      });
    }
  }
  else {
    response.status(401);
    response.json({
      message: "Permission denied !"
    })
  }
}

const getUserPassword = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    const query = token.data;
    const dataRes = await databaseService.getRecordByQuery(query, 'user');
    if (dataRes[0]) {
      res.status(200);
      res.json({
        isCompanyExist: true,
        message: "success",
        data: dataRes
      });
    } else {
      res.status(401);
      res.json({
        isCompanyExist: false,
        message: "Company not found"
      })
    }
  } else {
    res.status(401);
    res.json({
      message: "Permission Denied  !"
    })
  }
}

const createLog = async (req, res) => {
  const token = await tokenService.verifyToken(req);
  if (token.isVerified) {
    console.log("Accepted");
  } else {
    res.status(401);
    res.json({
      message: "Permission Denied  !"
    })
  }
}

module.exports = {
  createUser: create,
  getUserPassword,
  createLog
}
