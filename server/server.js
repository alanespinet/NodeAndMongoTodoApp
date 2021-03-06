// Third party modules
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');


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

// POST REQUESTS
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

app.post('/users', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then( (user) => {
    res.send(user);
  })
  .catch( (e) => {
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


// PATCH REQUEST
app.patch('/todos/:id', (req, res) => {

  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if( !ObjectID.isValid(id) ){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed && body.completed)){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send(todo);
  }).catch( (e) => {
    res.send(e);
  });

});



// Server listen
app.listen(port, () => { console.log(`Server running at port ${port}` ); });
