const express = require('express');
const User = require('../models/users')
const router = express.Router();
const bcrypt = require('bcrypt')

// auth Route
router.post('/', async (req, res) => {
  //const { error } = validateUser(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  const user = await User.User.findOne({email: req.body.email})
  if (!user) return res.status(400).send("Invalid email")
  
  const isPwdValid = await bcrypt.compare(req.body.password, user.password)

  if(!isPwdValid) return res.status(400).send("Invalid Password")
  token = User.generateAuthToken(user)
  res.header('x-auth-token', token).send("Logged in")
  
});

module.exports = router