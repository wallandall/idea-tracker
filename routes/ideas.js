const express = require("express");
const router = express.Router();

var {Ideas} = require('../models/Idea');

// Idea Index Page
router.get('/', (req, res) => {
  Ideas.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Ideas.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Idea was successfly removed');
      res.redirect('/ideas');
    });
});


module.exports = router;
