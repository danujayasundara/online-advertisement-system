const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    categoryName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'category',
});

module.exports = Category;