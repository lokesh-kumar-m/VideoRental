const mongoose = require('mongoose')
const { func } = require('joi')

mongoose.connect("mongodb://localhost/vidly", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log("Customers - Connected to MongoDB"))
    .catch((err) => console.log("Customers - Error Connecting to MongoDB: ", err.message))

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    isGold:{
        type: Boolean,
        required: true,
    }

})

const Customer = mongoose.model('Customer', customerSchema)

async function getCustomers(){
    const customers = await Customer.find()
    console.log("Customers: ", customers)
    return customers
}

async function createCustomer(body){
    const customer = Customer({
        name: body.name,
        phone: body.phone,
        isGold: body.isGold
    })

    try{
        const result = await customer.save()
        console.log("Created: ", result)
        return result
    }
    catch(ex){
        for(field in ex.errors)
            console.log("Error: ", ex.errors[field].message)
        return ex.errors
    }
    
}

async function updateCustomer(id,body){
    const customer = await Customer.findById(id)

    if(!customer){
        const message = "Document with supplied ID not found"
        console.log(message)
        return message
    }

    console.log("Document with supplied ID found")

    customer.name = body.name
    customer.phone = body.phone
    customer.isGold = body.isGold

    try{
        const result = await customer.save()
        console.log("Updated: ", result)
        return result
    }
    catch(ex){
        for(field in ex.errors)
            console.log("Error: ", ex.errors[field].message)
        return ex.errors
    }
    
}

async function deleteCustomer(id){
    const customer = await Customer.findById(id)

    if(!customer){
        const message = "Document with supplied ID not found"
        console.log(message)
        return message
    }

    console.log("Document with supplied ID found")

    try{
        const result = await customer.deleteOne()
        console.log("Deleted: ", result)
        return result
    }
    catch(ex){
        for(field in ex.errors)
            console.log("Error: ", ex.errors[field].message)
        return ex.errors
    }
    
}

module.exports = {
    getCustomers: getCustomers,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer,
}