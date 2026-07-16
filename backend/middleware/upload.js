const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join('/tmp', 'uploads', 'contracts');

try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (err) {
    console.error("Failed to create upload directory:", err);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
  // Guard: if file or filename is missing, reject cleanly instead of crashing
  if (!file || !file.originalname) {
    return cb(new Error('No valid file received'), false);
  }

  const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, Word, and image files are allowed'), false);
  }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10*1024*1024
    }
});

module.exports = upload;