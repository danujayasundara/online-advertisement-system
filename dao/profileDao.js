const fs = require('fs');
const path = require('path');
const { Seller, Image, Advertisement } = require('../models');

// profile
const updateProfileDao = async (sellerId, data, imageBase64) => {
    const seller = await Seller.findByPk(sellerId);

    if(!seller) {
        throw new Error('Seller not found');
    }

    await seller.update(data);

    if (imageBase64){
        const existingImage = await Image.findOne({
            where: { sellerId: sellerId, imageType: 'profile'}
        });

        const imageBuffer =Buffer.from(imageBase64.split(',')[1], 'base64');
        //extract file extention for different types
        const match = imageBase64.match(/^data:image\/(\w+);base64,/);
        if(!match) {
            throw new Error('Invalid image format');
        }
        const fileExtension = match[1];
        const imageName = `profile_${Date.now()}.${fileExtension}`;
        const imagePath = path.join(__dirname, '../uploads', imageName);

        let existingImageBase64 = null;
        if(existingImage) {
            const existingImageBuffer = fs.readFileSync(existingImage.imageFile);
            existingImageBase64 = `data:image/${fileExtension};base64,${existingImageBuffer.toString('base64')}`;
        }

        if(existingImageBase64 !== imageBase64) {
            fs.writeFileSync(imagePath, imageBuffer);

            if(existingImage){
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
/*const getSellerProfile = async (sellerId) => {
    const seller = await Seller.findOne({
        where: { id: sellerId},
        attributes: { exclude: ['email','password']},
        include: [
            { model: Image, as: 'images', where: { imageType: 'profile'}, required: false} //left join to get seller, if they havn't profile
        ]
    });
    return seller;
}*/

const getSellerProfile = async (id, isAdId = false) => {
    let seller;

    if (isAdId) {
        const ad = await Advertisement.findOne({
            where: { id },
            include: [
                {model: Seller, as: 'seller', attributes: { exclude: ['email', 'password'] }, include: [
                    {model: Image, as: 'images', where: { imageType: 'profile'}, required: false}
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
                {model: Image, as: 'images', where: { imageType: 'profile'}, required: false}
            ]
        });
    }

    return seller;
}


module.exports = {
    updateProfileDao,
    getSellerProfile
}