// Third party modules
var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');


// Own modules
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');


// Initialization process
var app = express();
const port = process.env.PORT || 3000;

// Moddlewares
app.use(bodyParser.json());



// Requests

// POST
app.post('/todos', (req, res) => {

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then( (doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});


// GET ALL REQUEST
app.get('/todos', (req, res) => {

  Todo.find().then( (todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });

});


// GET ONE REQUEST
app.get('/todos/:id', (req, res) => {

  var id = req.params.id;

  if( !ObjectID.isValid(id) ){
    return res.status(404).send();
  }

  Todo.findById(id).then( (todo) => {

    if( !todo ){
      return res.status(404).send();
    }

    res.send(todo);
  })
  .catch( (e) => {
    res.status(400).send();
  });

});



// DELETE REQUEST
app.delete('/todos/:id', (req, res) => {

  var id = req.params.id;

  if( !ObjectID.isValid(id) ){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then( (todo) => {

    if( !todo ){
      return res.status(404).send();
    }

    res.send(todo);
  })
  .catch( (e) => {
    res.status(400).send();
  });

});

// Server listen
app.listen(port, () => { console.log(`Server running at port ${port}` ); });
