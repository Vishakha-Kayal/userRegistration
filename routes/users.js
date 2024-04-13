const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://vishakha:visshuu@cluster0.iztdsgv.mongodb.net/project0')

const userSchema = mongoose.Schema({
  username : String,
  name:String,
  password : String,
  uimage:String
});



module.exports = mongoose.model("users",userSchema);