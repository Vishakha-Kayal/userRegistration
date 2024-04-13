const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://vishakhakayal636:kayal@cluster0.lmgpt4g.mongodb.net/signup')

const userSchema = mongoose.Schema({
  username : String,
  name:String,
  password : String,
  uimage:String
});



module.exports = mongoose.model("users",userSchema);