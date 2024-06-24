const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Seller = require('../models/seller');

const login = async (req, res) => {
    const { email, password } = req.body;   //extract email and password from the request body

    try {
        console.log('Received login request for:', email);
        const user = await Seller.findOne({ where: {email}});    //find a user with the given email
        if(!user){
            return res.status(401).json({ message: 'Invalid email or password'});

        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: 'Inavalis email or password'});
        }

        const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
};

module.exports = { login };