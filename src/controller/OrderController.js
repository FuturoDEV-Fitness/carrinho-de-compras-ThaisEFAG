const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgree",
  password: "postgree",
  database: "carrinho",
});

class OrderController {
  async carPedidos(request, response) {
    try {
      const dadosPedidos = request.body;

      const orders = await conexao.query(
        `
        
        INSERT INTO orders
        (adress, observations)
        values
        (
        $1,
        $2,
        $3
        )
        returning *

        `,
        [dadosPedidos.total, dadosPedidos.adress, dadosPedidos.observations]
      );
      response.status(201).json(orders.rows[0]);
    } catch (error) {
      console.error(error);
      response.status(500).json({ mensagem: "Erro servidor" });
    }
  }
}

module.exports = new OrderController();
