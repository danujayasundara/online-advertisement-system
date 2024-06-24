const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'No token provided' });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);  //varify the token using the secret key
        req.userId = decode.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });

    }
};

module.exports = authenticate;