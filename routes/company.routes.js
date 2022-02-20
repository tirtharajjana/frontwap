const express = require("express");
const router = express.Router();
const companyController = require("../controller/company.controller");

router.post("/",(request,response)=>{
  companyController.createCompany(request,response);
});

module.exports = router;
