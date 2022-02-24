const express = require("express");
const router = express.Router();
const clientController = require("../controller/clients.controller")

router.get("/", (request, response) => {
    response.render("clients");
});
router.post("/", (request, response) => {
    clientController.create(request, response);
});

module.exports = router;
