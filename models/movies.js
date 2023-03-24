const mongoose = require('mongoose');
const Genre = require('./genres')

// Connect to DB
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log("Movies - Connected to MongoDB"))
  .catch(err => console.log("Movies - Error Connecting to MongoDB: ", err.message))

// Document Schema
const movieSchema = new mongoose.Schema({

  title : {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    maxlength: 255,    
  },

   genre: {
    type:Genre.genreSchema,
    required: true 
   },

  number_in_stock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },

  daily_rental_price: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },

});

// Collection 
const Movie = mongoose.model('Movie', movieSchema)

// Read Operation
async function getMovies(){
  const movies = await Movie
  .find()
  .sort({title:1})

  console.log("Movies: ", movies)
  return movies
}

// Create Operation
async function createMovies(body){
    
    const genre = await Genre.Genre.findById(body.genre_id)
    if(!genre){
        message = "Genre with the supplied ID not found";
        return message;
    }

    console.log("Genre with the supplied ID found")

    const movie = Movie({
        title: body.title,
        
        genre: {
            _id: genre._id,
            name: genre.name,
        },

        number_in_stock: body.number_in_stock,
        daily_rental_price: body.daily_rental_price
    })

    try{
        const result = await movie.save()
        console.log("Created: ",result)
        return result
    }
    catch(ex){
        for(field in ex.errors){
        console.log("ERR: ", ex.errors[field])
        return ex.errors[field]
        } 
    }
}

// Update Operation
async function updateMovie(id, body){
  const movie = await Movie.findById(id)

  if(!movie){
    message = "No Movie found with supplied ID";
    return message;
  }

  const genre = await Genre.Genre.findById(body.genre_id)
  if(!genre){
      message = "Genre with the supplied ID not found";
      return message;
  }

  console.log("Movie and Genre found with supplied ID");

  movie.title = body.title;
  movie.genre._id = genre._id;
  movie.genre.name = genre.name;
  movie.number_in_stock = body.number_in_stock;
  movie.daily_rental_price = body.daily_rental_price;
  
  try{
    
    const result = await movie.save()
    console.log("Updated", result);
    return result;
  }
  catch(ex){

    for(field in ex.errors){
      console.log("ERR: ", ex.errors[field].message)
      return ex.errors[field]
    } 
  }

}

// Delete Operation
async function deleteMovie(id){
  const movie = await Movie.findById(id)

  if(!movie){
    console.log("No Document found with supplied ID");
    return;
  } 

  console.log("Document found with supplied ID", movie);

  try{
    const result = await movie.deleteOne()
    console.log("Deleted: ",result)
    return result
  }
  catch(ex){
    for(field in ex.errors){
      console.log("ERR: ", ex.errors[field])
      return ex.errors[field]
    } 
  }

}

module.exports = {
    getMovies: getMovies,
    createMovies: createMovies,
    updateMovie: updateMovie,
    deleteMovie: deleteMovie,
}