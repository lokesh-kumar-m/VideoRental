const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')

// Connect to DB
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log("Users - Connected to MongoDB"))
  .catch(err => console.log("Users - Error Connecting to MongoDB: ", err.message))

// Document Schema
const userSchema = new mongoose.Schema({

  name : {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32,    
  },

  email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
  },

  password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
  },
  
  isAdmin: {
    type: Boolean
  }

});

// Collection 
const User = mongoose.model('User', userSchema)


// Genrate JWT 
generateAuthToken = function(user) {
  const token = jwt.sign({_id: user.id, isAdmin: user.isAdmin}, config.get('jwtPrivateKey'));
  return token;
};

// Read Operation
async function getUsers(){
  const users = await User
  .find()
  .sort({name:1})
  .select({name:1, email:1, _id:1})
  
  console.log("Users: ", users)
  return users
}

// Create Operation
async function createUser(body){
  
    let user = await User.findOne({email: body.email});
    if (user) {
        message = "User with supplied email address already exists"
        return message
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashed_pwd = await bcrypt.hash(body.password, salt)
    
    user = User({
        name: body.name,
        email: body.email,
        password: hashed_pwd
    })

  try{
    const result = await user.save()
    console.log("Created: ",result)
    return _.pick(result, ['_id','name', 'email'])
  }
  catch(ex){
    for(field in ex.errors){
      console.log("ERR: ", ex.errors[field])
      return ex.errors[field].message
    } 
  }
}

// Delete Operation
async function deleteUser(id){
  const user = await User.findById(id)

  if(!user){
    console.log("No Document found with supplied ID");
    return;
  } 

  console.log("Document found with supplied ID", user);

  try{
    const result = await user.deleteOne()
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
    getUsers: getUsers,
    createUser: createUser,
    deleteUser: deleteUser,
    generateAuthToken: generateAuthToken,
    User: User,
}