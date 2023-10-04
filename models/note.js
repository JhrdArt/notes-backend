require('dotenv').config()
const mongoose = require("mongoose");

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const password = process.env.PASSWORD;
const url = `mongodb+srv://Jhordart:${password}@cluster0.d6uaelj.mongodb.net/note-app?retryWrites=true&w=majority&appName=AtlasApp`;

mongoose
  .connect(url)
  .then((result) => {
    console.log(`Connected to MongoDB`);
  })
  .catch((error) => {
    console.log(`Error to connecting to MongoDB: ${error.message}`);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
