const { Op, where } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { Advertisement, Seller, Image, Category, City } = require('../models');

//function for base64
const processBase64Images = async (images, adId, sellerId, imageType) => {
    const imagePromises = images.map((imageBase64, index) => {
        //determine file extension and create a unique file name
        const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)[1];
        const ext = mimeType.split('/')[1];
        const imageBuffer = Buffer.from(imageBase64.split(',')[1],'base64');
        const imageName = `${imageType}_${adId}_${index}_${Date.now()}.${ext}`;
        const imagePath = path.join(__dirname, '../uploads',imageName);

        //save image file path
        fs.writeFileSync(imagePath, imageBuffer);

        return addImage({
            imageFile: imagePath,
            imageType: imageType,
            adId: adId,
            sellerId: sellerId
        });
    });
    await Promise.all(imagePromises); 
}

//add new Ad
const addNewAd = async (data) => {
    return await Advertisement.create(data);
};

const createNewAd = async (adData, images, sellerId) => {
    const newAd = await addNewAd(adData);

    if(images && images.length > 0){
        await processBase64Images(images, newAd.id, sellerId, 'ad');
    }
    return newAd;
}

//add image
const addImage =  async (imageData) => {
    return await Image.create(imageData);
};

//update existing Ad
const updateAd = async (id, sellerId, data) => {
    return await Advertisement.update(data, 
        {
            where: {id, sellerId}
        }
    );
};

//update images
const updateAdImages = async (adId, sellerId, images ) => {
    //fetch existing images of a ad
    const existingImages = await Image.findAll({
        where: { adId, sellerId, imageType: 'ad' }
    });

    //extract image paths if image exist
    const existingImageBase64s = existingImages.map(image => {
        const imageBuffer = fs.readFileSync(image.imageFile);
        return imageBuffer.toString('base64');
    });

    //filter already exist images
    const newImages = images.filter(imageBase64 => {
        const base64Content = imageBase64.split(',')[1];
        return !existingImageBase64s.includes(base64Content);
    });

    if (newImages.length > 0) {
        await processBase64Images(newImages, adId, sellerId, 'ad');
    }
};

const updateAdDao = async (id, sellerId, adData, images) => {
    const ad = await findAdByIdAndSellerId(id, sellerId);

    if(!ad) {
        throw new Error('Advertisement not found');
    }

    await updateAd(id, sellerId, adData);

    if (images && images.length > 0){
        await updateAdImages(id, sellerId, images);
    }

    return ad;
};

//find ad by Id and Seller
const findAdByIdAndSellerId = async (adId, sellerId) => {
    return await Advertisement.findOne({
        where: {id: adId, sellerId}
    });
}

//find Ad by id (find one)
const findAdById = async (id) => {
    return await Advertisement.findOne({
        where: {id, isDeleted: false},
        include: [
            { model: Seller, as: 'seller', attributes: ['name', 'telephoneNo', 'description']},
            { model: Image, as: 'images', attributes: ['imageFile']},
            { model: Category, as: 'category', attributes: ['categoryName']},
            { model: City, as: 'city', attributes: ['cityName']},
        ]
    });
};

const getAdDetails = async (id) => {
    const ad = await findAdById(id);
    if(!ad){
        throw new Error('Advertisement not found');
    } 
    return ad;
}

//find Ads by seller id     page: The page number to retrieve/pageSize: The number of advertisements per page.
const findAllAdsBySellerId = async (sellerId, page, pageSize) => {
    const offset = (page - 1) * pageSize;  //number of records to skip based on the current page and page size.
    return await Advertisement.findAndCountAll({
        where: {sellerId, isDeleted: false},
        limit: pageSize,  //limit the number of records returned to pageSize
        offset: offset,
        order: [['lastModified', 'DESC']],
        include: [
            { model: Seller, as: 'seller', attributes: ['name', 'telephoneNo', 'description']},
            { model: Image, as: 'images', attributes: ['imageFile']},
            { model: Category, as: 'category', attributes: ['categoryName']},
            { model: City, as: 'city', attributes: ['cityName']},
        ]
    });
};

//get all Ads
const findAllAds = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;

    return await Advertisement.findAndCountAll({
        where: { isDeleted: false},
        limit: pageSize,
        offset: offset,
        order: [['lastModified', 'DESC']],
        attributes: ['id','topic','price' ,'lastModified'],
        include: [
            { model: Image, as: 'images', attributes: ['imageFile']},
            { model: Category, as: 'category', attributes: ['categoryName']},
            { model: City, as: 'city', attributes: ['cityName']},
        ]
    });
};

//delete an ad
const deleteAd = async (ad) => {
    return await ad.update({ isDeleted: true });
};

//filter Ads
const filterAds = async ({ categoryId, cityId, searchbar, page, pageSize }) => {
    const offset = (page - 1) * pageSize;

    let conditions = {
        where: { isDeleted: false },
        limit: pageSize,
        offset: offset,
        order: [['lastModified', 'DESC']],
        include: [
            { model: Seller, as: 'seller', attributes: ['name', 'telephoneNo', 'description']},
            { model: Image, as: 'images', attributes: ['imageFile']},
            { model: Category, as: 'category', attributes: ['categoryName']},
            { model: City, as: 'city', attributes: ['cityName']},
        ]
    };

    //filter by category
    if(categoryId){
        conditions.where.categoryId = categoryId;
    }

    //filter by city
    if(cityId){
        conditions.where.cityId = cityId;
    }

    //filter by topic and description
    if(searchbar){
        const searchDetails = searchbar.trim();
        conditions.where = {
            ...conditions.where,
            [Op.or]:[
                {topic: {[Op.like]: `%${searchDetails}%`}},
                {description: {[Op.like]: `%${searchDetails}%`}}
            ]
        };
    }

    const {rows: advertisements, count: totalAdsCount} = await Advertisement.findAndCountAll(conditions);

    return { advertisements,  totalAdsCount};
};

module.exports = {
    addNewAd,
    updateAdDao,
    createNewAd,
    findAdById,
    getAdDetails,
    findAllAdsBySellerId,
   // findImgByAdIdAndSellerId,
    addImage,
    updateAdImages,
    findAllAds,
    findAdByIdAndSellerId,
    deleteAd,
    filterAds
};