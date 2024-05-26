const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:String,
    userName:String,
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
      phoneNo:Number,
      password: {
        type: String,
        required: true
      },
      cpassword: {
        type: String,
        required: true
      },
});
module.exports = mongoose.model('users', userSchema);
