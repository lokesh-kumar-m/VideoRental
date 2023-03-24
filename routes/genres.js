const express = require('express');
const models = require('../models/genres')
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// Get Route
router.get('/', (req, res) => {
  genres = models.getGenres();
  genres.then((genres) => res.json(genres))
  genres.catch((genres) => res.json(genres))
});

// Create Route
router.post('/', [auth,admin], (req, res) => {
  //const { error } = validateGenre(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  genre = models.createGenres(req.body)
  genre.then((genre) => res.json(genre))
  genre.catch((genre) => res.json(genre))
});

// Update Route
router.put('/:id', [auth,admin], (req, res) => {
  //const { error } = validateGenre(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  genre = models.updateGenre(req.params.id,req.body)
  genre.then((genre) => res.json(genre))
  genre.catch((genre) => res.json(genre))

});

// Delete Route
router.delete('/:id', [auth,admin], (req, res) => {

  genre = models.deleteGenre(req.params.id)
  genre.then((genre) => res.json(genre))
  genre.catch((genre) => res.json(genre))

});

// Get Specific Route
router.get('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  genres.then(
    (genres) => {
      if (!genre) return res.status(404).send('The genre with the given ID was not found.');
      res.json(genres)
    }
  )
  genres.catch((genres) => res.json(genres))
  
  
});

module.exports = router