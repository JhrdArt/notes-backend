const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    `PLEASE PROVIDE A PASSWORD AS AN ARGUMENT: node mongo.js password`
  );
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://Jhordart:${password}@cluster0.d6uaelj.mongodb.net/note-app?retryWrites=true&w=majority&appName=AtlasApp`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true,
  },
  date: {
    date: Date,
    required: true
  },
  important: Boolean,
});

const Note = mongoose.model("Notes", noteSchema);

const note = new Note({
  content: "Hola mundo",
  date: new Date(),
  important: true,
});

// note.save().then((result) => {
//   console.log(`Note saved`);
//   mongoose.connection.close();
// });

Note.find({}).then((notes) => {
  notes.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
