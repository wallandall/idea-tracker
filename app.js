require('./config/config');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose');
var {Ideas} = require('./models/Idea');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extends: false}));
app.use(bodyParser.json());

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

// About Route
app.get('/ideas/ideas', (req, res) => {
  res.render('ideas/ideas');
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add idea details'});
  }
  if(!req.body.due_date){
    errors.push({text:'Please add a due date'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
      due_date: req.body.due_date
    });
  } else {
    res.send('passed');
  }
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
