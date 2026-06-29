const express = require('express');
const router = express.Router();
const {
  uploadContract,
  getContracts,
  deleteContract
} = require('../controllers/contractController');

const { protect, restrict } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/', restrict('admin'), upload.single('file'), uploadContract);

router.get('/', getContracts);

router.delete('/:id', restrict('admin'), deleteContract);

module.exports = router;