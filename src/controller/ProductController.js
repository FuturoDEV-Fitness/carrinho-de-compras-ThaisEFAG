const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgree",
  database: "carrinho",
});

class ProductController {
  async produtosDetalhes(request, response) {
    try {
      const id = request.params.id;

      const detalhes = conexao.query(`
      SELECT p.id, p.name 
      FROM products p 
      INNER JOIN categories c 
      ON p.category_id = c.id
      `);
      response.json(detalhes.rows);

      if (isNaN(id)) {
        return response.status(404).json({
          mensagem: "ID Produto não encontrado",
        });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ mensagem: "Erro server" });
    }
  }

  async pesquisarProduto(request, response) {
    const filtroProduct = request.query;

    if (filtroProduct.filtroParams) {
      const products = await conexao.query(
        `
            SELECT * FROM products
            where name ilike $1
            or color ilike $1
            or description ilike $1
            or voltage ilike $1
            `,
        [`%${filtroProduct.filtroParams}%`]
      );
      response.json(products.rows);
    } else {
      const products = await conexao.query(`
          SELECT * FROM products
      `);
      response.json(products.rows);
    }
  }

  async pesquisarId(request, response) {
    try {
      const id = request.params.id;

      const products = conexao.query(
        `
      SELECT * FROM products
      where id = $1
      `,
        [id]
      );

      if (products.rows.length === 0) {
        return response.status(404).json({
          mensagem: "ID Produto não encontrado",
        });
      }

      response.json(products.rows[0]);
    } catch (error) {
      response
        .status(500)
        .json({ mensagem: "Não foi possível encontrar(server" });
    }
  }

  async productRegister(request, response) {
    try {
      const dados = await request.body;

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
