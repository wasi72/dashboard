const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category:{
        type: String,
        required: true,
      },
      company:{
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      }
})
module.exports = mongoose.model('products', productSchema);