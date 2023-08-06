const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const sample = new mongoose.Schema({
    event:String,
    imageUrl:[String]
},{timestamps: true});
module.exports = mongoose.model("Biotech_Gallery", sample); 