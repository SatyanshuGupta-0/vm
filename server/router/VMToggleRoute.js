const express = require('express');
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const { getToggle, setToggle } = require('../controller/Toggle.Controller');

router.get('/toggle', getToggle);
router.post('/toggle',isAdmin("superadmin"), setToggle); // secure with auth in real use

module.exports = router;

