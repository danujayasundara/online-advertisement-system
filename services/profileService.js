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

//get profile
const getProfile = async (req) => {
    const { id } = req.params; // id can be adId or sellerId
    const { isAdId } = req.query; // pass query parameter if it is an adId

    try {
        const seller = await getSellerProfile(id, isAdId === 'true');
        if (!seller && isAdId === 'true') {
            throw new Error('Ad not found');
        } else if (!seller) {
            throw new Error('Seller not found');
        }
        return { statusCode: 200, data: seller };
    } catch (error) {
        console.error('Error fetching profile details', error);
        if (error.message === 'Seller not found' || error.message === 'Ad not found') {
            throw { statusCode: 404, message: error.message }; // Throw a 404 status code for 'Ad not found' or 'Seller not found'
        }
        throw { statusCode: 500, message: 'An error occurred while getting profile', error };
    }
};


module.exports = {
    updateProfileInfo,
    getProfile
}