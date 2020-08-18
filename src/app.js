const express = require("express");
const cors = require("cors");

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepository(request, response, next) {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send("Repository not Found");
  }

  request.repositoryIndex = repositoryIndex;
  request.id = id;

  return next();
}

app.use("/repositories/:id", checkRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id, repositoryIndex } = request;
  const { title, url, techs } = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request;

  const repository = repositories[repositoryIndex];

  repository.likes++

  return response.status(200).json(repository);
});

module.exports = app;
