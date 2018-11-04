const express = require("express");
const router = express.Router();

//User Login
router.get('/login', (req, res)=>{
  res.send('login');
})

//User registration
router.get('/register', (req, res)=>{
  res.send('register');
});


module.exports = router;
