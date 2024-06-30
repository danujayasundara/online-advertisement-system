const {createNewAdService, updateAAdService, getAds, getAdDetails, getAllTheAdvertisements, deleteAdById, getAllCities, getAllCategories, getAdbyIdAndSellerId} = require('../services/adService');

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
    const { result, statusCode, error } = await getAds(req);
    if (error) {
        return res.status(statusCode).json({ error });
    }
    res.status(statusCode).json(result);
};

//get one ad of a seller
const getAdOfASeller = async(req, res) => {
    const { result, statusCode, error } = await getAdbyIdAndSellerId(req);
    if (error) {
        return res.status(statusCode).json({ message: error });
    }
    res.status(statusCode).json(result);
}

//get one Ad
const getAAd = async (req, res) => {
    const { result, statusCode, error } = await getAdDetails(req);
    if (error) {
        return res.status(statusCode).json({ message: error });
    }
    res.status(statusCode).json(result);
};

//get all Ads & filter ads
const getAllAds = async (req, res) => {
    const { result, statusCode, message, error } = await getAllTheAdvertisements(req);
    
    if (error) {
        return res.status(statusCode).json({ message });
    }
    
    res.status(statusCode).json(result);
};

//delete Ad
const deleteAdvertisement = async (req, res) => {
    const { statusCode, message } = await deleteAdById(req);
    res.status(statusCode).json({ message });
};

//get cities
const getCitiesController = async (req, res) => {
    const { statusCode, data, message, error } = await getAllCities();
    if (error) {
        return res.status(statusCode).json({ message, error });
    }
    res.status(statusCode).json(data);
};

//get categories
const getCategoriesController = async (req, res) => {
    const { statusCode, data, message, error } = await getAllCategories();
    if (error) {
        return res.status(statusCode).json({ message, error });
    }
    res.status(statusCode).json(data);
}

module.exports = { 
    createAdvertisement,
    updateAdvertisement,
    getAllAdvertisements,
    getAAd,
    getAllAds,
    deleteAdvertisement,
    getCitiesController,
    getCategoriesController,
    getAdOfASeller
 };