require('./config/config');
const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "s$$&cret";

var {mongoose} = require('./db/mongoose');
var {Ideas} = require('./models/Idea');


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
  Ideas.find({})
    .sort({date:'desc'})
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

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  })
  .then(idea => {
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
    errors.push({text:'Please add some details'});
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
      status: re.body.status
    }
    new Ideas(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'New idea successfly added!');
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
        req.flash('success_msg', 'Idea successfly updated!');
        res.redirect('/ideas');
      })
  });
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Ideas.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Idea was successfly removed');
      res.redirect('/ideas');
    });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
