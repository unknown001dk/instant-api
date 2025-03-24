const express = require('express');
const { registerUser, defineSchema } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/define-schema', defineSchema);

module.exports = router;
