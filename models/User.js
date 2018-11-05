const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
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
  date: {
    type: Date,
    default: Date.now
  }
});

var Users = mongoose.model('users', UsersSchema);

module.exports = {Users};
