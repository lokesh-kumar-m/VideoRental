const express = require('express');
const models = require('../models/rentals')
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// Get Route
router.get('/', (req, res) => {
  rentals = models.getRentals();
  rentals.then((rentals) => res.json(rentals))
  rentals.catch((rentals) => res.json(rentals))
});

// Create Route
router.post('/', auth, (req, res) => {
  //const { error } = validateRental(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  rental = models.createRental(req.body)
  rental.then((rental) => res.json(rental))
  rental.catch((rental) => res.json(rental))
});

// Update Route
router.put('/:id/return', [auth, admin], (req, res) => {
  //const { error } = validateRental(req.body); 
  //if (error) return res.status(400).send(error.details[0].message);

  rental = models.returnRental(req.params.id)
  rental.then((rental) => res.json(rental))
  rental.catch((rental) => res.json(rental))

});

// Delete Route
router.delete('/:id', [auth, admin], (req, res) => {

  rental = models.deleteRental(req.params.id)
  rental.then((rental) => res.json(rental))
  rental.catch((rental) => res.json(rental))

});

// Get Specific Route
router.get('/:id', (req, res) => {
  const rental = rentals.find(c => c.id === parseInt(req.params.id));
  rentals.then(
    (rentals) => {
      if (!rental) return res.status(404).send('The rental with the given ID was not found.');
      res.json(rentals)
    }
  )
  rentals.catch((rentals) => res.json(rentals))
  
  
});

module.exports = router