const express = require('express');
const { dynamicCrudOperations } = require('../controllers/dynamicController');
const router = express.Router();

router.route('/:userId/:schemaName/:id?').all(dynamicCrudOperations);

module.exports = router;
