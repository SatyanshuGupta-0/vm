const express = require('express');
const router = express.Router();
const { pingUser, getLiveUsers } = require('../controller/ActiveUser.Controller');

router.post('/ping', pingUser);
router.get('/live-users', getLiveUsers);

module.exports = router;
