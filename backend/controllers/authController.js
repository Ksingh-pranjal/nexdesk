//Actual logic lives here
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// function to generate JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },                     /*payload -> user's mongoDB ID passed here*/
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const register = async (req, res) => {
    const { name, email, password, role, company } = req.body;
    try{
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const user = await User.create({                //create hashes the user password automatically
            name,
            email,
            password,
            role: role || 'client',
            company: company || ''
        });

        res.status(201).json({                          //send back user info + token
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if(user && (await user.matchPassword(password))){           //matchPassword is custome method in User.js
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                token: generateToken(user._id)
            });
        } else{
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    res.json(req.user);
};

module.exports = { register, login, getMe };