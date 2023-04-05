const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const router = express.Router();
router.use(bodyParser.json());

// Initialize Firebase Admin SDK with Service Account key
const serviceAccount = require('../json/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user account.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             uid:
 *               type: string
 *       400:
 *         description: Bad request.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
// Create a new user account
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password
    });
    res.status(201).json({ message: 'User created successfully!', uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user with email and password.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to authenticate.
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             uid:
 *               type: string
 *       400:
 *         description: Bad request.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
// Authenticate a user with email and password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().signInWithEmailAndPassword(email, password);
    res.status(200).json({ message: 'User authenticated successfully!', uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the currently authenticated user.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
// Logout the currently authenticated user
router.post('/logout', async (req, res) => {
  try {
    await admin.auth().signOut();
    res.status(200).json({ message: 'User logged out successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;