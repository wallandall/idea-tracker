require('./config/config');
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose');
var {Ideas} = require('./models/Idea');

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method oberride middleware
app.use(methodOverride('_method'));

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

// Idea Index Page
app.get('/ideas', (req, res) => {
  Ideas.find({})
    .sort({due_date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});


// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) =>{
  Ideas.findOne({
    _id: req.params.id
  }).then(idea=>{
    res.render('ideas/edit', {
      idea:idea
    });
  });
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

    const newUser = {
      title: req.body.title,
      details: req.body.details,
      due_date: req.body.due_date,
      status: req.body.status
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.due_date = req.body.due_date;
    idea.status = req.body.status;
    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      })
  });
});


// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Ideas.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/ideas');
    });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
