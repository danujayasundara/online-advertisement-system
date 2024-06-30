const fs = require('fs');
const path = require('path');
const { updateProfileInfo, getProfile } = require('../services/profileService');


// profile
const updateProfileContr = async (req, res) => {
    await updateProfileInfo(req, res);
};

//get profile
const getProfileDetails = async (req, res) => {
    try {
        const { statusCode, data, message } = await getProfile(req);
        res.status(statusCode).json({ message, data });
    } catch (error) {
        console.error('Error in getProfileDetails controller:', error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = {
    updateProfileContr,
    getProfileDetails
}