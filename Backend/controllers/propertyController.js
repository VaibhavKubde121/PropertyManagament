const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');

exports.createProperty = async (req, res) => {
  const { title, description, location, price } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newProperty = await Property.create({
      user: req.user._id,
      title,
      description,
      location,
      price,
      imageUrl: imagePath,
    });

    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ],
      }
      : {};

    const properties = await Property.find(query).populate('user', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    // Delete the associated image file (optional)
    if (property.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'public', property.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const { title, description, location, price } = req.body;

    // If new image uploaded, remove the old one
    if (req.file) {
      if (property.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'public', property.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      property.imageUrl = `/uploads/${req.file.filename}`;
    }

    property.title = title || property.title;
    property.description = description || property.description;
    property.location = location || property.location;
    property.price = price || property.price;

    const updated = await property.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
