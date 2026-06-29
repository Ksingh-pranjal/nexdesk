const Contract = require('../models/Contract');

//Upload a contract
const uploadContract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, expiryDate, clientId } = req.body;

    if(!clientId){
      return res.status(400).json({ message: 'clientid is required' });
    }

    const contract = await Contract.create({
      title: title || req.file.originalname,
      filePath: req.file.path,
      originalName: req.file.originalname,
      client: clientId,   // whoever is logged in and uploading
      expiryDate: expiryDate || null
    });

    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get contracts
const getContracts = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') {
      query.client = req.user._id;
    }

    const contracts = await Contract.find(query)
      .populate('client', 'name company')
      .sort({ createdAt: -1 });

    // Convert each contract's filePath into a browser-usable URL
    // We extract just the filename and rebuild a clean /uploads/... path
    const formatted = contracts.map((c) => ({
      ...c.toObject(),
      fileUrl: `/uploads/contracts/${c.filePath.split(/[\\/]/).pop()}`
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete a contract
const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    await contract.deleteOne();
    res.json({ message: 'Contract deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadContract,getContracts, deleteContract };