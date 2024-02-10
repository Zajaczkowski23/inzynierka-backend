const express = require('express')
const mongoose = require('mongoose')
const Profile = require('../models/profile.js')

const app = express()
const AuthRoute = require('../routes/auth.js')

const dbURL = 'mongodb+srv://krystian:krystian2@cluster.c6yyhpd.mongodb.net/livescore?retryWrites=true&w=majority'
const port = 4200;

app.use(express.json());

app.use('/api', AuthRoute)

mongoose.connect(dbURL).then((result) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}).catch((err) => console.log(err));
