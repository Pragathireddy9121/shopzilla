const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type filter (optional)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
