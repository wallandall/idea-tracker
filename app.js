require('./config/config');
const path = require('path');
const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
var {mongoose} = require('./db/mongoose');
const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Handlebars Helper
const {
  truncate,
  stripTags,
  formatDate
} = require('./helpers/hbs');

//Passport config
require('./config/passport')(passport);

const port = process.env.PORT || 3000;
const SECRET_PASS = process.env.SECRET_PASS || "s$$&cret";

// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'SECRET_PASS',
  resave: true,
  saveUninitialized: true
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome to Idea-Tracker';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
