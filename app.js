require('./config/config');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Home
app.get('/', (req, res) => {
  const title = "Welcome to Idea Tracker";
  res.render('index', {
    title: title
  });
});

//About
app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
