const express = require('express');
const models = require('../models/users')
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// Get Route
router.get('/', (req, res) => {
  users = models.getUsers();
});

// Create Route
router.post('/register', (req, res) => {
  //const { error } = validateUser(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  user = models.createUser(req.body)
  const token = models.generateAuthToken(user);

  user.then((user) => res.header('x-auth-token', token).json(user))
  user.catch((user) => res.json(user))
});

// Delete Route
router.delete('/:id', [auth, admin], (req, res) => {

  user = models.deleteUser(req.params.id)
  user.then((user) => res.json(user))
  user.catch((user) => res.json(user))

});

// Get Specific Route
router.get('/me', auth, async(req, res) => {

  console.log(req.user._id)
  const user = await models.User
  .findById(req.user._id)
  .select({name:1, email:1}) 
  
  res.send(user)

});

module.exports = router