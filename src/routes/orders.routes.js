const { Router } = require("express");
const OrderController = require("../controller/OrderController");

const ordersRoute = new Router();

ordersRoute.post("/", OrderController.carPedidos);

module.exports = ordersRoute;
