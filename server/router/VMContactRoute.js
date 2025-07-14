const express = require("express");
const router = express.Router();
const { createContact } = require("../controller/contact.Controller");

router.post("/", createContact);

module.exports = router;
