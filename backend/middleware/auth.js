//Authentication middleware -> wristband checker -> runs before protected routes
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Function to be executed before protected route handlers
//next -> function to call when middleware is done 
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch(error){
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if(!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const restrict = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            return res.status(403).json({
                message: `Role '${req.user.role}' is not allowed to do this`
            });
        }
        next();
    };
};

module.exports = { protect, restrict };