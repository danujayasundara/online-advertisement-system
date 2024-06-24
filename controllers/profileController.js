const fs = require('fs');
const path = require('path');
const { updateProfileInfo, getProfile } = require('../services/profileService');


// profile
const updateProfileContr = async (req, res) => {
    await updateProfileInfo(req, res);
};

//get profile
/*const getProfileDetails = async (req, res) => {
    const sellerId = req.userId;

    try{
        const seller = await getProfile(sellerId);

        res.status(200).json(seller);
    }catch (error) {
        if (error.message === 'Seller not found') {
            return res.status(404).json({ error: 'Seller not found'});
        }
        res.status(500).json({error: 'An error occurred while getting profile'});
    }
};*/
const getProfileDetails = async (req, res) => {
    const { id } = req.params; //id can be adId or sellerId
    const { isAdId } = req.query; //pass query parameter if it is an adId

    try {
        const seller = await getProfile(id, isAdId);
        res.status(200).json(seller);
    } catch (error) {
        console.error('Error fetching profile details', error);
        if (error.message === 'Seller not found') {
            return res.status(404).json({ error: 'Seller not found' });
        } else if (error.message === 'Ad not found') {
            return res.status(404).json({ error: 'Ad not found' });
        }
        res.status(500).json({ error: 'An error occurred while getting profile' });
    }
};

module.exports = {
    updateProfileContr,
    getProfileDetails
}