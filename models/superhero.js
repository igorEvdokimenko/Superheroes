const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuperheroSchema = new Schema({
  nickname: String,
  real_name: String,
  origin_description: String,
  superpowers: String,
  catch_phrase: String,
  images: [{ url: String, filename: String }],
});

module.exports = mongoose.model("Superhero", SuperheroSchema);
