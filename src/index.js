const express = require("express");
const clientesRoute = require("./routes/clientes.routes");
const productsRoute = require("./routes/products.routes");
const ordersRoute = require("./routes/orders.routes");

const app = express();
app.use(express.json());

app.use("/clientes", clientesRoute);
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);

app.listen(3000, () => {
  console.log("servidor rodando");
});
