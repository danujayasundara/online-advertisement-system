const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    cityName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'city',
});

module.exports = City;