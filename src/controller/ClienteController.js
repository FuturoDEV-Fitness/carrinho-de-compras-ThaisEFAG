const { Pool } = require("pg");

const conexao = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgree",
  database: "carrinho",
});

class ClienteController {
  async pesquisarCadastros(request, response) {
    const filtrosCode = request.query;

    if (filtrosCode.filtroParams) {
      const clientes = await conexao.query(
        `
          SELECT * FROM clientes  
          where name ilike $1
          or email ilike $1
          or cpf ilike $1
          or contact ilike $1
            `,
        [`%${filtrosCode.filtroParams}%`]
      );
      response.json(clientes.rows);
    } else {
      const clientes = await conexao.query(`
                SELECT * FROM clientes
                 `);
      response.json(clientes.rows);
    }
  }

  async criar(request, response) {
    try {
      const dados = request.body;

      if (!dados.name || !dados.email || !dados.cpf || !dados.contact) {
        return response.status(400).json({
          mensagem: "nome, email, cpf e contact são obrigatórios",
        });
      }
      const clientes = await conexao.query(
        `
        
              INSERT INTO clientes
              (name, email, cpf, contact)
              values
              ($1,
              $2,
              $3,
              $4)
              returning *
          `,
        [dados.name, dados.email, dados.cpf, dados.contact]
      );
      response.status(201).json(clientes.rows[0]);
    } catch (error) {
      response
        .status(500)
        .json({ mensagem: "Não foi possível realizar o cadastro" });
    }
  }
}

module.exports = new ClienteController();
