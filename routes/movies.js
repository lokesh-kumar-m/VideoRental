const express = require('express');
const models = require('../models/movies')
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// Get Route
router.get('/', (req, res) => {
  movies = models.getMovies();
  movies.then((movies) => res.json(movies))
  movies.catch((movies) => res.json(movies))
});

// Create Route
router.post('/', [auth,admin], (req, res) => {
  //const { error } = validateMovie(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  movie = models.createMovies(req.body)
  movie.then((movie) => res.json(movie))
  movie.catch((movie) => res.json(movie))
});

// Update Route
router.put('/:id', [auth,admin], (req, res) => {
  //const { error } = validateMovie(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  movie = models.updateMovie(req.params.id,req.body)
  movie.then((movie) => res.json(movie))
  movie.catch((movie) => res.json(movie))

});

// Delete Route
router.delete('/:id', [auth,admin], (req, res) => {

  movie = models.deleteMovie(req.params.id)
  movie.then((movie) => res.json(movie))
  movie.catch((movie) => res.json(movie))

});

// Get Specific Route
router.get('/:id', (req, res) => {
  const movie = movies.find(c => c.id === parseInt(req.params.id));
  movies.then(
    (movies) => {
      if (!movie) return res.status(404).send('The movie with the given ID was not found.');
      res.json(movies)
    }
  )
  movies.catch((movies) => res.json(movies))
  
  
});

module.exports = router