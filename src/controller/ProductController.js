const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgree",
  database: "carrinho",
});

class ProductController {
  async pesquisarProduto(request, response) {
    const filtroProduct = request.query;

    if (filtroProduct.filtroParams) {
      const produtos = await conexao.query(
        `
            SELECT * FROM products
            where name ilike $1
            or color ilike $
            `
      );
    }
  }

  async productRegister(request, response) {
    try {
      const dados = request.body;

      if (!dados.name || !dados.price) {
        return response.status(400).json({
          mensagem: "nome e preço são obrigatórios",
        });
      }
      const products = await conexao.query(
        `
                INSERT INTO products
                (name, price, amount, color, voltage, description, category_id)
                values
                ($1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7)
                returning *
                `,
        [
          dados.name,
          dados.price,
          dados.amount,
          dados.color,
          dados.voltage,
          dados.description,
          dados.category_id,
        ]
      );
      response.status(201).json(products.rows[0]);
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ mensagem: "Não foi possível realizar o cadastro do produto" });
    }
  }
}

// depois ver o que é error.stack

module.exports = new ProductController();
