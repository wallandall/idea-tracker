const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: true
  },
  status: {
    type: String
  }
});

var Ideas = mongoose.model('Ideas', IdeaSchema);

module.exports = {Ideas};
