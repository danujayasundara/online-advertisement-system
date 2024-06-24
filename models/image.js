const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Advertisement = require('./advertisement');
const Seller = require('./seller');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    imageFile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageType: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    adId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Advertisement,
            key: 'id',
        },
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Seller,
            key: 'id',
        },
    },
},{
    tableName: 'image',
});

module.exports = Image;