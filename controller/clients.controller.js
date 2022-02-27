const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const create = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const data = request.body;
    data['companyId'] = tokenData.data.uid;
    try {
        const dataRes = await dbService.createRecord(data,'client');
        response.status(200);
        response.json({
          message: "Record created",
          data: dataRes
        });
    }
    catch(error)
    {
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

const countClients = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const dataRes = await dbService.countData('client');
    response.status(200);
    response.json({
      data: dataRes
    })
  }
  else {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

const paginate = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    let from = Number(request.params.from);
    let to = Number(request.params.to);
    const dataRes = await dbService.paginate(from,to,'client');
    response.status(200);
    response.json({
      data: dataRes
    });
  }
  else  {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

const deleteClients = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const id = request.params.id;
    const deleteRes = await dbService.deleteById(id,'client');
    response.status(200);
    response.json({
      data: deleteRes
    });
  }
  else  {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

module.exports = {
  create: create,
  countClients: countClients,
  paginate: paginate,
  deleteClients: deleteClients
}
