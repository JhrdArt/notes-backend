const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static("dist"))
//
const requestLogger = (request, respone, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknow endpoint" });
};

const notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

//Obtenemos el título
app.get("/", (request, response) => {
  response.send("<h1>Backend de Notes<h1/>");
});
//Obtenemos la base de datos
app.get("/api/notes", (request, response) => {
  response.json(notes);
});
//obtgener una nota
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
//Eliminar una nota
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes.filter((note) => note.id !== id);
  response.status(204).end();
});
//Crea un id aleatorio
const idGenerator = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};
//Añadir una nueva nota
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "Content is missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: idGenerator(),
  };

  response.json([...notes, note]);
});

//REQUESTLOGGER
app.use(requestLogger);
app.use(unknowEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`El Servidor está corriendo en el puerto: ${PORT}`);
});
