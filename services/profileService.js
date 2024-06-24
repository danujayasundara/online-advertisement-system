const fs = require('fs');
const path = require('path');
const { updateProfileDao, getSellerProfile } = require('../dao/profileDao');
const { Advertisement, Seller } = require('../models');

// profile
const updateProfileInfo = async(req, res) => {
    const sellerId = req.userId;
    const { name, description, telephoneNo, cityId, image } = req.body;

    if(!name || !description || !telephoneNo || !cityId || !image) {
        return res.status(400).json({ message: 'All fields are required'});
    }

    try {
        /*let filePath = null;
        if(req.files && req.files.length > 0){
            filePath = req.files[0].path;
        }*/

        const updatedProfile = await updateProfileDao(sellerId, {
            name,
            description,
            telephoneNo,
            cityId
        }, image);

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile', error);
        res.status(500).json({ error: 'Server error'});
    }
};

//get seller profile
/*const getProfile = async (sellerId) => {
    try {
        const seller = await getSellerProfile(sellerId);

        if (!seller){
            throw new Error('Seller not found');
        }

        return seller;
    } catch (error) {
        console.error('Error fetching profile details', error);
        throw error;
    }
}*/
const getProfile = async (id, isAdId) => {
    const seller = await getSellerProfile(id, isAdId === 'true');

    if(!seller) {
        throw new Error(isAdId === 'true' ? 'Ad not found' : 'Seller not found');
    }
    
    return seller;
};

//get seller data for normal users by ad Id

module.exports = {
    updateProfileInfo,
    getProfile
}