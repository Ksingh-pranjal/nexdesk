//For admin to manage users
const User = require('../models/User');

//Create new client
const createClient = async (req, res) => {
    const { name, email, password, company, site, phone } = req.body;

    try{
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ message: 'Email already in use' });
        }

        const client = await User.create({
            name,
            email,
            password,
            role: 'client',
            company,
            site,
            phone
        });

        res.status(201).json({
            _id: client._id,
            name: client.name,
            email: client.email,
            company: client.company,
            site: client.site,
            phone: client.phone,
            role: client.role
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

//create new engineer
const createEngineer = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try{
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ message: 'Email already in use' });
        }

        const engineer = await User.create({
            name,
            email,
            password,
            role: 'engineer',
            phone
        });

        res.status(201).json({
            _id: engineer._id,
            name: engineer.name,
            email: engineer.email,
            phone: engineer.phone,
            role: engineer.role
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Get all clients
const getClients = async (req, res) => {
    try{
        const filter = { role: 'client' };
        if(req.query.includeInactive !== 'true'){
            filter.isActive = true;
        }

        const clients = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json(clients);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Get all engineers
const getEngineers = async (req, res) => {
    try{
        const filter = { role: 'engineer' };
        if(req.query.includeInactive !== 'true'){
            filter.isActive = true;
        }
        const engineers = await User.find(filter)
            .select('-password')
            .sort({ name: 1 });

        res.json(engineers);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Update a user (client or engineer)
const updateUser = async (req, res) => {
    const { name, company, site, phone } = req.body;

    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });

        if(name) user.name = name;
        if(company !== undefined) user.company = company;
        if(site !== undefined) user.site = site;
        if(phone !== undefined) user.phone = phone;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            company: user.company,
            site: user.site,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Deactivate a user
const deactivateUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
        user.isActive = false;
        await user.save();
        res.json({ message: `${user.role} deactivated successfully` });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Reactivate a user
const activateUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = true;
        await user.save();

        res.json({ message: `${user.role} reactivated successfully` });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createClient,
    createEngineer,
    getClients,
    getEngineers,
    updateUser,
    deactivateUser,
    activateUser
};