const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  // other fields
  winner: String, // or a more complex object if needed
});

const Profile = mongoose.model('Match', matchSchema);
module.exports = Profile;