const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const City = require('./city');

const Seller = sequelize.define('Seller', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(150),
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    telephoneNo: {
        type: DataTypes.STRING(15),
    },
    cityId: {
        type: DataTypes.INTEGER,
        references: {
            model: City,
            key: 'id',
        },
    },
},
    {
        tableName: 'seller',
        timestamps: false
});

Seller.sync()
.then(() => {
    console.log('Seller table synced');
}).catch((error) => {
    console.error('Error syncing Seller table:', error);
});

module.exports = Seller;