const { Router } = require("express");
const ClienteController = require("../controller/ClienteController");

const clientesRoute = new Router();

// aspas vazias, null, 0 e undefined = false

clientesRoute.post("/", ClienteController.criar);
clientesRoute.get("/", ClienteController.pesquisarCadastros);

module.exports = clientesRoute;
