const express = require('express');
const router = express.Router();
const linksV2Controller = require('../controllers/links_v2');
var cors = require('cors');

// Controller v1 Routes
router.get('/', linksV2Controller.getLinks);
router.post('/', linksV2Controller.createLink);
router.delete('/:id', linksV2Controller.deleteLink);
router.put('/:id', linksV2Controller.updateLink);
module.exports = router;
