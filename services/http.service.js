const ajax = require("supertest");

const postRequest = async (request)=>{
  const response = await ajax(request.endpoint)
  .post(request.api)
  .send({token:request.data});
  return response;
}

module.exports = {
  postRequest: postRequest
}
