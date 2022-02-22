const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const create = async (request,response)=>{
  const token = tokenService.verifyToken(request);
  if(token.isVerified)
  {
      try{
          const userRes = await databaseService.createRecord(token.data,'user');
          response.status(200);
          response.json({
            isUserCreated: true,
            message: "user created !"
          });
      }
      catch(error)
      {
        response.status(500);
        response.json({
          isUserCreated: false,
          message: "Internal server error"
        });
      }
  }
  else{
    response.status(401);
    response.json({
      message: "Permission denied !"
    })
  }
}

const getUserPassword = async (request,response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const query = token.data;
    console.log(query);
    const dataRes = await databaseService.getRecordByQuery(query,'user');
    if(dataRes.length > 0)
    {
      response.status(200);
      response.json({
        isCompanyExist: true,
        message: "success",
        data: dataRes
      });
    }
    else{
      response.status(404);
      response.json({
        isCompanyExist: false,
        message: "Company not found !"
      });
    }
  }
  else{
    response.status(401);
    response.json({
      message: "Permission denied !"
    })
  }
}

const createLog = async (request,response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const query = {
      uid: token.data.uid
    };

    const data = {
      token: request.body.token,
      expiresIn: 86400, // 1 day
      isLogged: true,
      updatedAt: Date.now()
    };

    const userRes = await databaseService.updateByQuery(query,'user',data);
    response.status(201);
    response.json({
      message: "Update Success !"
    });
  }
  else{
    response.status(401);
    response.json({
      message: "Permission denied !"
    })
  }
}

module.exports = {
  createUser: create,
  getUserPassword: getUserPassword,
  createLog: createLog
}
