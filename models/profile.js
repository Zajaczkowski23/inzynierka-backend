const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  favoriteTeams: [{
    type: String,
    unique: true
  }],
  favoriteLeagues: [{
    type: String,
    unique: true
  }],
}, {
  timestamps: true
})

const Profile = mongoose.model('User', userSchema);
module.exports = Profile;