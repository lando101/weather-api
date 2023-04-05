const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiKey = process.env.WEATHER_API_KEY;

/**
 * @swagger
 * /weather/{city}:
 *   get:
 *     summary: Get the current weather for a city.
 *     parameters:
 *       - in: path
 *         name: city
 *         description: The name of the city.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A JSON object containing the temperature and description for the specified city.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: number
 *                   description: The current temperature in Celsius.
 *                 description:
 *                   type: string
 *                   description: A brief description of the current weather conditions.
 */
router.get('/:city', (req, res) => {
  const city = req.params.city;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;



  axios.get(url)
    .then(response => {
      const weatherData = response.data;
      const weather = {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description
      };
      res.json(weather);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error');
    });
});

/**
 * @swagger
 * /weather/{lat}/{lon}:
 *   get:
 *     summary: Get weather data from OpenWeatherMap One Call API
 *     parameters:
 *       - name: lat
 *         in: path
 *         description: Latitude of the location
 *         required: true
 *         type: number
 *         format: float
 *       - name: lon
 *         in: path
 *         description: Longitude of the location
 *         required: true
 *         type: number
 *         format: float
 *       - name: exclude
 *         in: query
 *         description: Parts of the weather data to exclude from the response
 *         required: false
 *         type: string
 *         default: ""
 *       - name: units
 *         in: query
 *         description: Set units to return metrics
 *         required: false
 *         type: string
 *         default: ""
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 */
router.get('/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const { exclude } = req.query;
  const { units } = req.query;
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${apiKey}`;
  try {
    const { data } = await axios.get(apiUrl);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;