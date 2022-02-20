const ajax = require("supertest");

const postRequest = async (request) => {
  const response = await ajax(request.endpoint)
    .post(request.api)
    .send({ token: request.data });
  return response;
}

const getRequest = async (req) => {
  const response = await ajax(req.endpoint)
    .get(req.api + "/" + req.data)
    .set({ 'X-Auth-Token': req.data })

  return response;

}

module.exports = {
  postRequest: postRequest,
  getRequest
}
