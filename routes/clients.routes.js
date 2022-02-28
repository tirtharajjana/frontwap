const express = require("express");
const router = express.Router();
const clientController = require("../controller/clients.controller");

router.get("/",(request,response)=>{
  response.render("clients");
});

router.get("/count-all",(request,response)=>{
  clientController.countClients(request,response);
});

router.get("/:from/:to",(request,response)=>{
  clientController.paginate(request,response);
});

router.post("/",(request,response)=>{
  clientController.create(request,response);
});

router.delete("/:id",(request,response)=>{
  clientController.deleteClients(request,response);
});

router.put("/:id",(request,response)=>{
  clientController.updateClients(request,response);
});

module.exports = router;
