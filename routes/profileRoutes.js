const express = require('express');
const { updateProfileContr, getProfileDetails } = require('../controllers/profileController');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const router = express.Router();


//update profile
router.put('/profile', authenticate, upload.array('images', 1), updateProfileContr);

//get profile details by seller Id
router.get('/myprofile', authenticate, (req, res) => {
    req.query.isAdId = 'false';
    req.params.id = req.userId;
    getProfileDetails(req, res);
});

//get profile details by ad Id
router.get('/profile/ad/:id', (req, res) => {
    req.query.isAdId = 'true';
    getProfileDetails(req, res);
});

module.exports = router;