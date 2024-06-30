const express = require("express");
const clientesRoute = require("./routes/clientes.routes");

const app = express();
app.use(express.json());

app.use("/clientes", clientesRoute);

app.listen(3000, () => {
  console.log("servidor rodando");
});
