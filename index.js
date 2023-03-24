//const Joi = require('joi');

const config = require('config')
const express = require('express');
const app = express();
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')

if (!config.get('jwtPrivateKey')){
  console.error('FATAL ERR: No JWT Private Key defined')
  process.exit(1)
}

/*
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}*/

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.use(express.json());
app.use('/api/genres/', genres)
app.use('/api/customers/', customers)
app.use('/api/movies/', movies)
app.use('/api/rentals/', rentals)
app.use('/api/users/', users)
app.use('/api/auth/', auth)