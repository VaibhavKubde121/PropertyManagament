const express = require('express');
const {
  createProperty,
  getAllProperties,
  deleteProperty,
  updateProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // ✅ Multer middleware

const router = express.Router();

// ✅ Routes
router.route('/')
  .get(getAllProperties)
  .post(protect, upload.single('image'), createProperty); // 👈 file upload

router.route('/:id')
  .delete(protect, deleteProperty)
  .put(protect, upload.single('image'), updateProperty); // 👈 file upload

module.exports = router;
