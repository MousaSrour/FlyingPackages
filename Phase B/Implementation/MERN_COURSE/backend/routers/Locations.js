const { Location } = require('../models/Location');
const express = require('express');
const router = express.Router();

/**
 * creating a new location object and saving
 * it to the database
 */
router.post('/', async (req, res) => {
  const { latitude, longitude, name } = req.body;

  // Check if a location with the same latitude, longitude, and name already exists so if it didn't exist, its null
  let existingLocation = await Location.findOne({ latitude, longitude, name });

  if (existingLocation) {
    // If the location already exists, return the existing one and there is no need to save
    return res.send(existingLocation);
  }

  // Create a new location
  let location = new Location({
    latitude,
    longitude,
    name,
  });

  location = await location.save();

  if (!location)
    return res.status(400).send('The location could not be added!');

  res.send(location);
});

module.exports = router;