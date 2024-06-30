const fs = require('fs');
const path = require('path');
const { processBase64Image, convertImageToBase64 } = require('../utils/imageUtils');
const { Seller, Image, Advertisement } = require('../models');

// profile
const updateProfileDao = async (sellerId, data, imageBase64) => {
    const seller = await Seller.findByPk(sellerId);

    if (!seller) {
        throw new Error('Seller not found');
    }

    await seller.update(data);

    if (imageBase64) {
        const existingImage = await Image.findOne({
            where: { sellerId: sellerId, imageType: 'profile' }
        });

        let existingImageBase64 = null;
        if (existingImage) {
            existingImageBase64 = convertImageToBase64(existingImage.imageFile);
        }

        if (existingImageBase64 !== imageBase64) {
            const imagePath = processBase64Image(imageBase64, 'profile', sellerId);

            if (existingImage) {
                await existingImage.update({
                    imageFile: imagePath
                });
            } else {
                await Image.create({
                    imageFile: imagePath,
                    imageType: 'profile',
                    sellerId: sellerId
                });
            }
        }
    }
    return seller;
};

//get profile
const getSellerProfile = async (id, isAdId = false) => {
    let seller;

    if (isAdId) {
        const ad = await Advertisement.findOne({
            where: { id, isDeleted: false },
            include: [
                {model: Seller, as: 'seller', attributes: { exclude: ['email', 'password'] }, include: [
                    {model: Image, as: 'images', where: { imageType: 'profile'}, attributes: { exclude: ['adId','sellerId'] },required: false}
                ]}
            ]
        });
        if(ad) {
            seller = ad.seller;
        }
    } else {
        seller = await Seller.findOne({
            where: { id },
            attributes: { exclude: ['email', 'password'] },
            include: [
                {model: Image, as: 'images', where: { imageType: 'profile'}, attributes: { exclude: ['adId','sellerId'] }, required: false}
            ]
        });
    }

    return seller;
}


module.exports = {
    updateProfileDao,
    getSellerProfile
}