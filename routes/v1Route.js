const express = require('express');
const router = express.Router();
const linksController = require('../controllers/links_v1');
var cors = require('cors');

// Controller v1 Routes
router.get('/', cors(), linksController.getLinks);
router.get('/:shortUrl', cors(), linksController.getLink);
router.patch(
  '/:shortUrl/incrementClicks',
  cors(),
  linksController.incrementClicks
);
router.post('/', cors(), linksController.createLink);
router.delete('/:id', cors(), linksController.deleteLink);
router.put('/:id', cors(), linksController.updateLink);
router.patch('/:shortUrl/expire', cors(), linksController.updateExpireAt);
router.get('/:shortUrl/stats', cors(), linksController.getStats);
router.get('/:shortUrl/stats/:stat', cors(), linksController.getSpecificStats);
router.patch(
  '/api/v1/links/:shortUrl/spend/:points',
  cors(),
  linksController.spendPoints
);
module.exports = router;
