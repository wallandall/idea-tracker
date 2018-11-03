const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

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

const port = 3000;
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
})
