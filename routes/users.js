const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/bharatInternDb')

const userSchema = mongoose.Schema({
  username : String,
  name:String,
  password : String,
  uimage:String
});



module.exports = mongoose.model("users",userSchema);