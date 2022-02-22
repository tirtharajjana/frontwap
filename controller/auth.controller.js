const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const checkUserLog = async (request)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const query = {
      token: request.cookies.authToken,
      isLogged: true
    };
    const userData = await dbService.getRecordByQuery(query,'user');
    if(userData.length > 0)
    {
      return true;
    }
  }
  else{
    return false;
  }
}

module.exports = {
  checkUserLog: checkUserLog
}
