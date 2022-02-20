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

module.exports = {
  createUser: create
}
