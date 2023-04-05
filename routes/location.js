const express = require('express');
const axios = require('axios');
const apiKey = process.env.LOCATION_API_KEY;

const router = express.Router();
/**
 * @swagger
 * /location/query/{query}:
 *   get:
 *     description: Retrieve a list of locations based on text input
 *     parameters:
 *       - name: text
 *         description: Text input for location search
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A list of locations based on the text input
 *       500:
 *         description: Internal server error
 */
router.get('/query/:query', async (req, res) => {
  const { text } = req.query;
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&filter=countrycode:us&type=city&limit=5&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * @swagger
 * /location/coord/{lat}/{lon}:
 *   get:
 *     summary: Get reverse geocoding data for a given latitude and longitude.
 *     parameters:
 *       - in: path
 *         name: lat
 *         description: The latitude of the location.
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: lon
 *         description: The longitude of the location.
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: A successful response containing reverse geocoding data.
 *       500:
 *         description: An error response indicating a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/coord/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;