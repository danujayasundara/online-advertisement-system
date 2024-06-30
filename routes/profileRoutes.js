const express = require('express');
const { updateProfileContr, getProfileDetails } = require('../controllers/profileController');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const router = express.Router();


//update profile
router.put('/profile', authenticate, upload.array('images', 1), updateProfileContr);

//get profile details by seller Id
router.get('/myprofile', authenticate, (req, res) => {
    const userId = req.userId;
    getProfileDetails({ params: { id: userId }, query: { isAdId: 'false'}}, res);
});

//get profile details by ad Id
router.post('/profile', (req, res) => {
    const adId = req.body.id;
    getProfileDetails({ params: { id: adId }, query: { isAdId: 'true'}}, res);
});

module.exports = router;