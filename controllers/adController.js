//const { Advertisement, Image } = require('../models');
//const fs = require('fs');
//const path = require('path');
const {createNewAdService, updateAAdService, getAds, getAdDetailsById, getAllTheAdvertisements, deleteAdById, getFilterAds} = require('../services/adService');

//adding new ad
const createAdvertisement = async (req, res) => {
    await createNewAdService(req, res);
};

//update a Ad
const updateAdvertisement = async (req, res) => {
    await updateAAdService(req, res);
};

//get all Ads of a seller
const getAllAdvertisements = async (req, res) => {
    const sellerId = req.userId;
    const { page, pageSize } = req.query;

    try {
        const result = await getAds(sellerId, page, pageSize);
        res.status(200).json(result);
    }catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//get one Ad
const getAAd = async (req, res) => {
    const { id } = req.params;
    //const sellerId = req.userId;

    try{
        const adDetails = await getAdDetailsById(id);
        res.status(200).json(adDetails);
    } catch (error) {
        if (error.message === 'Advertisement not found'){
            return res.status(404).json({ message: 'Advertisement not found'});
        }
        res.status(500).json({ message: 'Server error', error});
    }
};

//get all Ads
const getAllAds = async (req, res) => {
    const { page, pageSize } = req.query;

    try {
        const result = await getAllTheAdvertisements(page, pageSize);
        res.status(200).json(result);
    } catch (error){
        console.error("Error getting advertisements:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ message: 'Server error' ,error});
    }
};

//delete Ad
const deleteAdvertisement = async (req, res) => {
    try {
        const adId = req.params.id;
        const sellerId = req.userId;

        await deleteAdById(adId, sellerId);

        res.status(200).json({ message: 'Advertisement deleted successfully!'}); 
    } catch (error) {
        if(error.message === 'Advertisement not found'){
            return res.status(404).json({ error: error.message});
        }
        console.error('Error deleting advertisement',error);
        res.status(500).json({ error: 'An error occur while deleting advertisement'});
    }
};

//filter Ads
const filterAdvertisements = async (req, res) => {

    let { categoryId, cityId, searchbar, page, pageSize } = req.body;

    if(page < 1 || pageSize < 1){
        return res.status(400).json({ error: 'Invalid page'});
    }

    try{
        const result = await getFilterAds({ categoryId, cityId, searchbar, page, pageSize });
        res.status(200).json(result);
    }catch(error) {
        console.error('Error filtering advertisements controller', error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: 'An error occured while filtering advertisements'});
    }
}

module.exports = { 
    createAdvertisement,
    updateAdvertisement,
    getAllAdvertisements,
    getAAd,
    getAllAds,
    deleteAdvertisement,
    filterAdvertisements
 };