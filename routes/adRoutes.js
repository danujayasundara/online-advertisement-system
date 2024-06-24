const express = require('express');
//const { createAd, getAds, getOneAd, updateAd } = require('../controllers/adController');
const { createAdvertisement, updateAdvertisement, getAllAdvertisements, getAAd, getAllAds, deleteAdvertisement, filterAdvertisements } = require('../controllers/adController');
const authenticate = require('../middleware/authMiddleware');

const upload = require('../config/multer');

const router = express.Router();

//add new Ad
router.post('/ad', authenticate, upload.array('images', 5), createAdvertisement);

//update a Ad
router.put('/ad/:id', authenticate, upload.array('images', 5), updateAdvertisement);

//get all Ads of seller
router.get('/', authenticate, getAllAdvertisements);

//get a ad for seller
router.get('/ad/:id', authenticate, getAAd);

//get a ad for normal user
router.get('/user/ad/:id', getAAd);

//get all Ads
router.get('/all', getAllAds);

//delete Ad
router.delete('/delete/:id', authenticate, deleteAdvertisement);

//filter Ads
router.post('/filter', filterAdvertisements);

module.exports = router;