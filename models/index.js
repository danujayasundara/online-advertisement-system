const sequelize = require('../config/database');
const City = require('./city');
const Category = require('./category');
const Seller = require('./seller');
const Advertisement = require('./advertisement');
const Image = require('./image');

//define relationships
Seller.belongsTo(City,{ foreignKey: 'cityId', as: 'city' });
Advertisement.belongsTo(City,{ foreignKey: 'cityId', as: 'city' });
Advertisement.belongsTo(Category,{ foreignKey: 'categoryId', as: 'category' });
Advertisement.belongsTo(Seller,{ foreignKey: 'sellerId', as: 'seller' });
Image.belongsTo(Advertisement,{ foreignKey: 'adId', as: 'ad' });
Image.belongsTo(Seller,{ foreignKey: 'sellerId', as: 'seller' });
Advertisement.hasMany(Image, { foreignKey: 'adId', as: 'images' });
Seller.hasMany(Image, { as: 'images', foreignKey: 'sellerId' });

//sync models
sequelize.sync().then(() => {
    console.log('Database & tables created!');
}).catch ((error) => {
    console.log('Error creating databse tables', error);
});

module.exports = {
    City,
    Category,
    Seller,
    Advertisement,
    Image,
};