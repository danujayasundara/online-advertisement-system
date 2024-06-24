const fs = require('fs');
const path = require('path');
const {addNewAd, updateAdDao, createNewAd, findAllAdsBySellerId, getAdDetails, findAllAds, updateAdImages, addImage, findAdByIdAndSellerId, deleteAd, filterAds} = require('../dao/adDao');

//new Ad
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

//update Ad
const updateAAdService = async(req, res) => {
    const { id } = req.params;
    const { topic, price, description, telephoneNo, cityId, categoryId, images } = req.body; //extract from req body
    const sellerId = req.userId;

    try {
        await updateAdDao(
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
        res.status(500).json({ message: 'Server error', error});
    }
};

//get all Ads of a seller
const getAds = async (sellerId, page, pageSize) => {
    page = page && !isNaN(page) ? parseInt(page, 10) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize, 10) :10;

    const { rows: allAds, count: totalAdsCount } = await findAllAdsBySellerId(sellerId, page, pageSize);
    return{
        advertisements: allAds,
        adsCount: allAds.length,
    };
};

//get a Ad 
const getAdDetailsById = async (id) => {
    return await getAdDetails(id);
};

//gel all Ads
const getAllTheAdvertisements = async (page, pageSize) => {
    page = page && !isNaN(page) ? parseInt(page, 10) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize,10) : 10;

    const { rows: ads, count: totalAdsCount } = await findAllAds(page, pageSize);
    return{
        advertisements: ads,
        adsCount: ads.length
    };
}

//delete Ad
const deleteAdById = async (adId, sellerId) => {
    const ad = await findAdByIdAndSellerId(adId, sellerId);

    if (!ad){
        throw new Error('Advertisement not found');
    }

    await deleteAd(ad);
    return ad;
}

//filter Ads
const getFilterAds =async ({ categoryId, cityId, searchbar, page, pageSize }) => {

    page = page && !isNaN(page) ? parseInt(page, 10) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize, 10) : 10;
    
    const { advertisements, totalAdsCount } = await filterAds({ categoryId, cityId, searchbar, page, pageSize });

    return {
        advertisements, 
        adsCount: advertisements.length, 
    };
};

module.exports = {
    createNewAdService,
    updateAAdService,
    getAds,
    getAdDetailsById,
    getAllTheAdvertisements,
    deleteAdById,
    getFilterAds
};