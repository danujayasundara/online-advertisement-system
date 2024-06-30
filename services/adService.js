const fs = require('fs');
const path = require('path');
const { Image } = require('../models');
const {addNewAd, updateAd, findImagesByAdIdAndSellerId, findAllAdsBySellerId, findAdById, findAllAds, addImage, findAdByIdAndSellerId, deleteAd, getCities, getCategories} = require('../dao/adDao');
const { processBase64Image, convertImageToBase64  } = require('../utils/imageUtils');

//new Ad
const createNewAd = async (adData, images, sellerId) => {
    const newAd = await addNewAd(adData);

    if (images && images.length > 0) {
        for (const imageBase64 of images) {
            const imagePath = processBase64Image(imageBase64, 'ad', newAd.id);
            await Image.create({
                imageFile: imagePath,
                imageType: 'ad',
                adId: newAd.id,
                sellerId: sellerId
            });
        }
    }
    return newAd;
}

const createNewAdService = async(req, res) => {
    const { topic, price, description, telephoneNo, cityId, categoryId, images } = req.body; //extract from req body
    const sellerId = req.userId;

    try{
        const newAd = await createNewAd({
            topic,
            price,
            lastModified: new Date(),
            description,
            telephoneNo,
            cityId,
            categoryId,
            sellerId
        }, images, sellerId);
        res.status(201).json(newAd);
    } catch (error) {
        console.error('Error creating advertisement', error);
        res.status(500).json({ message: 'Server error'});
    }
};

//update images
const updateAdImages = async (adId, sellerId, images) => {
    // Fetch existing images of the ad
    const existingImages = await findImagesByAdIdAndSellerId(adId, sellerId);

    // Extract base64 content of existing images
    const existingImageBase64s = existingImages.map(image => {
        const imageBuffer = fs.readFileSync(image.imageFile);
        return imageBuffer.toString('base64');
    });

    // Filter new images that are not already in the existing images
    const newImages = images.filter(imageBase64 => {
        const base64Content = imageBase64.split(',')[1];
        return !existingImageBase64s.includes(base64Content);
    });

    if (newImages.length > 0) {
        for (const imageBase64 of newImages) {
            const imagePath = processBase64Image(imageBase64, 'ad', adId);
            await Image.create({
                imageFile: imagePath,
                imageType: 'ad',
                adId: adId,
                sellerId: sellerId
            });
        }
    }
};


const updateExAd = async (id, sellerId, adData, images) => {
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

//update Ad
const updateAAdService = async(req, res) => {
    const { id, topic, price, description, telephoneNo, cityId, categoryId, images } = req.body; //extract from req body
    const sellerId = req.userId;

    try {
        await updateExAd(
            id, sellerId, {
                topic,
                price,
                lastModified: new Date(),
                description,
                telephoneNo,
                cityId,
                categoryId 
            },
            images
        );
        res.status(200).json({ message: 'Advertisement updated successfully'});
    } catch (error) {
        if(error.message === 'Advertisement not found') {
            return res.status(404).json({ message: 'Advertisement not found'});
        }
        console.error('Error updating advertisement:', error);
        res.status(500).json({ message: 'Server error', error});
    }
};

//get all Ads of a seller
const getAds = async (req) => {

    const sellerId = req.userId;
    let { startIndex, maxResults } = req.body;

    try {
        // Convert body parameters to integers
        startIndex = startIndex ? parseInt(startIndex, 10) : 0;
        maxResults = maxResults ? parseInt(maxResults, 10) : 10;

        if (startIndex < 0 || maxResults < 1) {
            return { error: 'Invalid pagination parameters', statusCode: 400 };
        }

        const { rows: allAds } = await findAllAdsBySellerId(sellerId, startIndex, maxResults);

        return {
            result: {
                advertisements: allAds,
                adsCount: allAds.length,
            },
            statusCode: 200
        };
    } catch (error) {
        console.error('Error fetching advertisements:', error);

        if (error.message === 'Invalid pagination parameters') {
            return { error: 'Invalid pagination parameters', statusCode: 400 };
        }

        return { error: 'Server error', statusCode: 500 };
    }
};

//get one ad of a seller
const getAdbyIdAndSellerId = async (req) => {
    const { adId } = req.body;
    const sellerId = req.userId;

    try {
        const ad = await findAdByIdAndSellerId(adId, sellerId);
        if (!ad) {
            return { error: 'Ad not found', statusCode: 404 };
        }
        return { result: ad, statusCode: 200 };
    } catch (error) {
        console.error(`Error finding ad by Id and SellerId: ${error.message}`);
        return { error: 'Server error', statusCode: 500 };
    }
}

//get a Ad 
const getAdDetails = async (req) => {
    try {
        const { id } = req.body;
        const ad = await findAdById(id);
        if (!ad) {
            return { error: 'Advertisement not found', statusCode: 404 };
        }
        return { result: ad, statusCode: 200 };
    } catch (error) {
        console.error(`Error fetching advertisement details: ${error.message}`);
        return { error: 'Server error', statusCode: 500 };
    }
}

//gel all Ads
const getAllTheAdvertisements = async (req) => {
    try {
        const { categoryId, cityId, searchbar, startIndex, maxResults, sortBy } = req.body;
        
        // Convert to integers and set defaults
        const parsedStartIndex = startIndex ? parseInt(startIndex, 10) : 0;
        const parsedMaxResults = maxResults ? parseInt(maxResults, 10) : 10;

        // Validate pagination parameters
        if (parsedStartIndex < 0 || parsedMaxResults < 1) {
            return { statusCode: 400, message: 'Invalid pagination parameters' };
        }

        const { advertisements } = await findAllAds({
            categoryId,
            cityId,
            searchbar,
            startIndex: parsedStartIndex,
            maxResults: parsedMaxResults,
            sortBy
        });

        return {
            result: { advertisements, adsCount: advertisements.length },
            statusCode: 200
        };
    } catch (error) {
        console.error('Error getting advertisements:', error.message);
        return { statusCode: 500, message: 'Server error', error };
    }
};

//delete Ad
const deleteAdById = async (req) => {
    try {
        const { adId } = req.body;
        const sellerId = req.userId;

        const ad = await findAdByIdAndSellerId(adId, sellerId);
        if (!ad) {
            return { statusCode: 404, message: 'Advertisement not found' };
        }

        await deleteAd(ad);
        return { statusCode: 200, message: 'Advertisement deleted successfully!' };
    } catch (error) {
        console.error('Error deleting advertisement', error);
        return { statusCode: 500, message: 'An error occurred while deleting the advertisement' };
    }
};

//get cities
const getAllCities = async() => {
    try {
        const cities = await getCities();
        return { statusCode: 200, data: cities };
    } catch (error) {
        console.error('Error getting cities', error.message);
        return { statusCode: 500, message: 'Server error', error };
    }
}

//get categories
const getAllCategories = async() => {
    try {
        const categories = await getCategories();
        return { statusCode: 200, data: categories };
    } catch (error) {
        console.error('Error getting categories', error.message);
        return { statusCode: 500, message: 'Server error', error };
    }
}

module.exports = {
    createNewAdService,
    updateAAdService,
    getAds,
    getAdDetails,
    getAllTheAdvertisements,
    deleteAdById,
    getAllCities,
    getAllCategories,
    getAdbyIdAndSellerId
};