require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/note");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

//MIDLEWARE ENDPOINT
const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknow endpoint" });
};

//Obtenemos el título
app.get("/", (request, response) => {
  response.send("<h1>Datebase Notes<h1/>");
});
//Obtenemos la base de datos
app.get("/api/notes", (request, response) => {
  Note.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((error) => {
      console.error(`Error fetching notes: ${error}`);
      response.status(500).json({ error: `Internal server error` });
    });
});
//obtgener una nota
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
//Eliminar una nota
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});
//Crea un id aleatorio
// const idGenerator = () => {
//   const maxId =
//     Note.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
//   return maxId + 1;
// };
//Añadir una nueva nota
app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: "Content is missing  ",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => savedNote.toJSON())
    .then((savedAndFormattedNote) => {
      response.json(savedAndFormattedNote);
    })
    .catch((error) => next(error));
});
//ACTUALIZAR LA IMPORTANCIA
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updateNote) => {
      response.json(updateNote);
    })
    .catch((error) => next(error));
});

//MIDLEWARE
const requestLogger = (request, respone, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorhandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

//APP USE
app.use(requestLogger);
app.use(errorhandler);
app.use(unknowEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`El Servidor está corriendo en el puerto: ${PORT}`);
});
