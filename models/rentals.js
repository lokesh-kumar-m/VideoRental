const mongoose = require('mongoose');
const Customer = require('./customers')
const Movie = require('./movies');

mongoose.connect("mongodb://localhost/vidly", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log("Rentals - Connected to MongoDB"))
    .catch((err) => console.log("Rentals - Error Connecting to MongoDB:", err.message))

const rentalSchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },

    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },

    date_out:{
        type: Date,
        required: true,
        default: Date.now
    },

    date_returned:{
        type: Date,
    },

    rental_fee: {
        type: Number,
        min: 0
    }

})

const Rental = mongoose.model('Rental', rentalSchema)

async function getRentals(){

    const rentals = await Rental
    .find()
    .populate('customer', 'name phone isGold -_id')
    .populate('movie', 'title genre number_in_stock daily_rental_price -_id')
    .sort({date_out: 1})

    console.log("Rentals: ", rentals)
    return rentals
}

async function createRental(body){

    if(!mongoose.Types.ObjectId.isValid(body.customer_id) || !mongoose.Types.ObjectId.isValid(body.movie_id)) {
        message = "Bad Request, correct your customer and movie ID"    
        return message
    }

    const customer = await Customer.Customer.findById(body.customer_id)
    
    if(!customer){
        const message = "Customer with supplied ID not found"
        return message
    }

    const movie = await Movie.Movie.findById(body.movie_id)
    if(!movie){
        const message = "Movie with supplied ID not found"
    }

    console.log("Customer and Movie with supplied ID found")

    const rental = Rental({
        customer: customer,
        movie: movie,
    })

    try{
        const rental_result = await rental.save()
        console.log("Created: ", rental_result)
        movie.number_in_stock -= 1
        const movie_result =  await movie.save()
        console.log("Updated Movie: ", movie_result)
        return rental_result
    }
    catch(ex){
        for(field in ex.errors){
            console.log("ERR:", ex.errors[field].message)
        }
        return ex.errors
    }
}

async function returnRental(id){

    if(!mongoose.Types.ObjectId.isValid(id)) {
        message = "Bad Request, correct your Rental ID"    
        return message
    }

    const rental = await Rental.findById(id)
    if(!rental){
        const message = "Rental with supplied ID not found"
        return message
    }

    console.log("Rental with supplied ID found")
    
    if(rental.date_returned){
        const message = "Rental was already returned"
        return message
    }

    const movie = await Movie.Movie.findById(rental.movie._id)
   
    rental.date_returned  = Date.now()
    rental.rental_fee = calculateRent(rental.date_out, rental.date_returned, movie.daily_rental_price)


    try{
        const rental_result = await rental.save()
        console.log("Returned: ", rental_result)
        movie.number_in_stock += 1
        const movie_result = await movie.save()
        console.log("Updated Movie: ", movie_result)
        return rental_result
    }
    catch(ex){
        for(field in ex.errors){
            console.log("ERR:", ex.errors[field].message)
        }
        return ex.errors
    }
}

async function deleteRental(id){
    
    if(!mongoose.Types.ObjectId.isValid(id)) {
        message = "Bad Request, correct your Rental ID"    
        return message
    }

    const rental = await Rental.findById(id)
    if(!rental){
        const message = "Rental with supplied ID not found"
        return message
    }

    if(rental.date_returned){
        try{
            const rental_result = await rental.deleteOne()
            console.log("Deleted returned rental: ", rental_result)
            return rental_result
        }
        catch(ex){
            for(field in ex.errors){
                console.log("ERR:", ex.errors[field].message)
            }
            return ex.errors
        }
    }

    console.log("Rental with supplied ID found")

    const movie = await Movie.Movie.findById(rental.movie._id)
    
    try{
        const rental_result = await rental.deleteOne()
        console.log("Deleted: ", rental_result)
        movie.number_in_stock += 1
        const movie_result = await movie.save()
        console.log("Updated Movie: ", movie_result)
        
        return rental_result
    }
    catch(ex){
        for(field in ex.errors){
            console.log("ERR:", ex.errors[field].message)
        }
        return ex.errors
    }
}

function calculateRent(date_out, date_returned, daily_rental_price) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date_out.getFullYear(), date_out.getMonth(), date_out.getDate());
    const utc2 = Date.UTC(date_returned.getFullYear(), date_returned.getMonth(), date_returned.getDate());
    
    const rental_fee = daily_rental_price * (Math.floor((utc2 - utc1) / _MS_PER_DAY));
    console.log(rental_fee)
    
    return rental_fee
}

module.exports = {
    getRentals: getRentals,
    createRental: createRental,
    returnRental: returnRental,
    deleteRental: deleteRental
}