const express = require("express");
const router = express.Router();

const {ensureAuthenticated} = require('../helpers/auth');


var {Ideas} = require('../models/Idea');

// Idea Index Page
router.get('/',ensureAuthenticated, (req, res) => {
  Ideas.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
      due_date: req.body.due_date
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
      due_date: req.body.due_date,
      status: req.body.status

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
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Ideas.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Idea was successfly removed');
      res.redirect('/ideas');
    });
});


module.exports = router;
