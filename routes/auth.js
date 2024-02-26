const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const jwt = require('jsonwebtoken')
const Profile = require('../models/profile');
const axios = require('axios')
const authenticateToken = require('../middleware/authMiddleware');
const Message = require('../models/message');


router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.post('/user/favoriteTeam', async (req, res) => {
  const { userName, teamName } = req.body;
  try {
    const user = await Profile.findOne({ name: userName });
    if (user.favoriteTeams.includes(teamName)) {
      return res.status(400).send('Team already in favorites.');
    }
    user.favoriteTeams.push(teamName);
    await user.save();
    res.send('Team added to favorites.');
  } catch (error) {
    res.status(500).send('Server error');
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await Profile.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

router.get('/messages/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    const messages = await Message.find({
      $or: [{ senderName: userName }, { recipientName: userName }]
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

router.get('/favoriteTeam', async (req, res) => {
  try {
    const { userName } = req.query;

    if (!userName) {
      return res.status(400).send('UserName is required');
    }

    const user = await Profile.findOne({ name: userName });

    res.json(user.favoriteTeams);
  } catch (err) {
    res.status(500).send(err.toString())
  }
})

router.delete('/favoriteTeam', async (req, res) => {
  const { userName, teamName } = req.query;
  try {
    const user = await Profile.findOne({ name: userName });
    const index = user.favoriteTeams.indexOf(teamName);
    if (index > -1) {
      user.favoriteTeams.splice(index, 1);
      await user.save();
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
})

router.get('/favoriteLeagues', async (req, res) => {
  try {
    const { userName } = req.query;

    if (!userName) {
      return res.status(400).send('UserName is required');
    }

    const user = await Profile.findOne({ name: userName });

    res.json(user.favoriteLeagues);
  } catch (err) {
    res.status(500).send(err.toString())
  }
})

router.post('/user/favoriteLeagues', async (req, res) => {
  const { userName, leagueName } = req.body;
  try {
    const user = await Profile.findOne({ name: userName });
    if (user.favoriteLeagues.includes(leagueName)) {
      return res.status(400).send('Team already in favorites.');
    }
    user.favoriteLeagues.push(leagueName);
    await user.save();
    res.send('Team added to favorites.');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.delete('/favoriteLeagues', async (req, res) => {
  const { userName, leagueName } = req.query;
  try {
    const user = await Profile.findOne({ name: userName });
    const index = user.favoriteLeagues.indexOf(leagueName);
    if (index > -1) {
      user.favoriteLeagues.splice(index, 1);
      await user.save();
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
})

module.exports = router;