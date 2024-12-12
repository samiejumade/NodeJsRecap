const express = require('express');
const {handleGenerateNewShortURL, handleGateAnalytics} = require('../controllers/urls')
const   router = express.Router();

router.post('/',handleGenerateNewShortURL);
router.get('/analytics/:shortId',handleGateAnalytics);

module.exports = router;