const express = require('express');
const { createAdvertisement, updateAdvertisement, getAllAdvertisements, getAAd, getAllAds, deleteAdvertisement, getCitiesController, getCategoriesController, getAdOfASeller } = require('../controllers/adController');
const authenticate = require('../middleware/authMiddleware');

const upload = require('../config/multer');
//const { getAllCities } = require('../services/adService');

const router = express.Router();

//add new Ad
router.post('/ad', authenticate, upload.array('images', 5), createAdvertisement);

//update a Ad
router.put('/update', authenticate, upload.array('images', 5), updateAdvertisement);

//get all Ads of seller
router.post('/', authenticate, getAllAdvertisements);

//get a ad for seller
router.post('/one', authenticate, getAdOfASeller);

//get a ad for normal user
router.post('/user/ad', getAAd);

//get all Ads for normal user
router.post('/all', getAllAds);

//delete Ad
router.delete('/delete', authenticate, deleteAdvertisement);

//get cities
router.get('/cities', getCitiesController);

//get categories
router.get('/categories', getCategoriesController);

module.exports = router;