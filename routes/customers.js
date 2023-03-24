const express = require('express')
const models = require('../models/customers')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/', (req,res) => {
    customers = models.getCustomers()
    customers.then((customers) => res.send(customers))
    customers.catch((err) => res.send("Something went wrong: ", err.message))
})

router.post('/', [auth,admin], (req,res) => {
    customer = models.createCustomer(req.body)
    customer.then((customer) => res.send(customer))
    customer.catch((err) => res.send("Something went wrong: ", err.message))
})

router.put('/:id', [auth,admin], (req,res) => {
    customer = models.updateCustomer(req.params.id,req.body)
    customer.then((customer) => res.send(customer))
    customer.catch((err) => res.send("Something went wrong: ", err.message))
})

router.delete('/:id', [auth,admin], (req,res) => {
    customer = models.deleteCustomer(req.params.id)
    customer.then((customer) => res.send(customer))
    customer.catch((err) => res.send("Something went wrong: ", err.message))
})

module.exports = router