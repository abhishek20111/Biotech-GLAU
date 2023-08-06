const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const sample = new mongoose.Schema({
    title: String,
    subtitle: String,
    content: String,
    imageUrl: [String],

}, { timestamps: true });
module.exports = mongoose.model("Biotech_Post", sample); 