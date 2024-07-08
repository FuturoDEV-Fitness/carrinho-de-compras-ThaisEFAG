const { Router } = require("express");
const ProductController = require("../controller/ProductController");

const productsRoute = new Router();

productsRoute.post("/", ProductController.productRegister);
productsRoute.get("/:id", ProductController.pesquisarId);
productsRoute.get("/", ProductController.pesquisarProduto);

module.exports = productsRoute;
