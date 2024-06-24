const { Sequelize } = require('sequelize');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql', // Explicitly specify the dialect
    logging: false, 
    define: {
        timestamps: false 
    }
});

module.exports = sequelize;