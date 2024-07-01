const { Op, where } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { Advertisement, Seller, Image, Category, City } = require('../models');

//add new Ad
const addNewAd = async (data) => {
    return await Advertisement.create(data);
};

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

//find images
const findImagesByAdIdAndSellerId = async (adId, sellerId) => {
    return await Image.findAll({
        where: { adId, sellerId, imageType: 'ad' }
    });
};

//find ad by Id and Seller
const findAdByIdAndSellerId = async (adId, sellerId) => {
    return await Advertisement.findOne({
        where: {id: adId, sellerId, isDeleted: false},
        attributes: {
            exclude: ['sellerId', 'isDeleted'] 
        },
    });
}

//find Ad by id (find one)
const findAdById = async (id) => {
    return await Advertisement.findOne({
        where: {id, isDeleted: false},
        attributes: {
            exclude: ['cityId', 'categoryId', 'sellerId', 'isDeleted'] ,
        },
        include: [
            { model: Seller, as: 'seller', attributes: ['name', 'telephoneNo', 'description']},
            { model: Image, as: 'images', attributes: ['imageFile']},
            { model: Category, as: 'category', attributes: ['id','categoryName']},
            { model: City, as: 'city', attributes: ['id', 'cityName']},
        ]
    });
};

//find Ads by seller id
const findAllAdsBySellerId = async (sellerId, startIndex, maxResults) => {
    const offset = startIndex || 0;  //number of records to skip based on the start index
    const limit = maxResults || 10;

    return await Advertisement.findAndCountAll({
        where: {sellerId, isDeleted: false},
        attributes: {
            exclude: ['cityId', 'categoryId', 'sellerId', 'isDeleted'] ,
        },
        limit: limit,  //limit the number of records returned to pageSize
        offset: offset,
        order: [['lastModified', 'DESC']],
        include: [
            { model: Seller, as: 'seller', attributes: ['name', 'telephoneNo', 'description']},
            { model: Image, as: 'images', attributes: ['imageFile']},
            { model: Category, as: 'category', attributes: ['id', 'categoryName']},
            { model: City, as: 'city', attributes: ['id', 'cityName']},
        ]
    });
};

//get all Ads & filter ads
const findAllAds = async ({ categoryId, cityId, searchbar, startIndex, maxResults, sortBy }) => {
    const offset = startIndex || 0;
    const limit = maxResults || 10;

    let conditions = {
        where: { isDeleted: false },
        limit: limit,
        offset: offset,
       // order: [['lastModified', 'DESC']],
        order: [],
        attributes: {
            exclude: ['cityId', 'categoryId', 'sellerId', 'isDeleted'] ,
        },
        include: [
            { model: Seller, as: 'seller', attributes: ['name', 'telephoneNo', 'description'] },
            { model: Image, as: 'images', attributes: ['imageFile'] },
            { model: Category, as: 'category', attributes: ['id', 'categoryName'] },
            { model: City, as: 'city', attributes: ['id', 'cityName'] },
        ]
    };

    // Filter by category
    if (categoryId) {
        conditions.where.categoryId = categoryId;
    }

    // Filter by city
    if (cityId) {
        conditions.where.cityId = cityId;
    }

    // Filter by topic and description
    if (searchbar) {
        const searchDetails = searchbar.trim();
        conditions.where = {
            ...conditions.where,
            [Op.or]: [
                { topic: { [Op.like]: `%${searchDetails}%` } },
                { description: { [Op.like]: `%${searchDetails}%` } }
            ]
        };
    }

    if (sortBy === 'Price_ASC') {
        conditions.order.push(['price', 'ASC']);
    } else if (sortBy === 'Price_DESC') {
        conditions.order.push(['price', 'DESC']);
    } else {
        // Default sorting by 'lastModified' in descending order
        conditions.order.push(['lastModified', 'DESC']);
    }

    const { rows: advertisements, count: totalAdsCount } = await Advertisement.findAndCountAll(conditions);

    return { advertisements, totalAdsCount };
};

//delete an ad
const deleteAd = async (ad) => {
    return await ad.update({ isDeleted: true });
};

//get cities
const getCities = async () => {
    return await City.findAll({
        attributes: ['id', 'cityName'],
        order:[[ 'cityName', 'ASC']]
    });
}

//get categories
const getCategories = async() => {
    return await Category.findAll({
        attributes: [ 'id', 'categoryName'],
        order: [[ 'categoryName', 'ASC']]
    })
}

module.exports = {
    addNewAd,
    updateAd,
    findAdById,
    findAllAdsBySellerId,
    addImage,
    findAllAds,
    findAdByIdAndSellerId,
    deleteAd,
    getCities,
    getCategories,
    findImagesByAdIdAndSellerId
};