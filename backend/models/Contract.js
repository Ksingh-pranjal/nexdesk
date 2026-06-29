const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    // name of contract
    title: {
      type: String,
      required: true,
      trim: true
    },

    // The actual file path on disk where Multer saved it
    filePath: {
      type: String,
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    expiryDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Contract', contractSchema);