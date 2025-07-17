const express = require('express');
const {
  createProperty,
  getAllProperties,
  deleteProperty,
  updateProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();


router.route('/')
  .get(getAllProperties)
  .post(protect, upload.single('image'), createProperty);

router.route('/:id')
  .delete(protect, deleteProperty)
  .put(protect, upload.single('image'), updateProperty); 

module.exports = router;
