const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log("Genres - Connected to MongoDB"))
  .catch(err => console.log("Genres - Error Connecting to MongoDB: ", err.message))

// Document Schema
const genreSchema = new mongoose.Schema({

  name : {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32,    
  }

});

// Collection 
const Genre = mongoose.model('Genre', genreSchema)

// Read Operation
async function getGenres(){
  const genres = await Genre
  .find()
  .sort({name:1})

  console.log("Genres: ", genres)
  return genres
}

// Create Operation
async function createGenres(body){
  const genre = Genre({
    name: body.name
  })

  try{
    const result = await genre.save()
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
async function updateGenre(id, body){
  const genre = await Genre.findById(id)

  if(!genre){
    console.log("No Document found with supplied ID");
    return;
  }

  console.log("Document found with supplied ID");
  genre.name = body.name;
  
  try{
    
    const result = await genre.save()
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
async function deleteGenre(id){
  const genre = await Genre.findById(id)

  if(!genre){
    console.log("No Document found with supplied ID");
    return;
  } 

  console.log("Document found with supplied ID", genre);

  try{
    const result = await genre.deleteOne()
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
    getGenres: getGenres,
    createGenres: createGenres,
    updateGenre: updateGenre,
    deleteGenre: deleteGenre,
    genreSchema: genreSchema,
    Genre: Genre,
}