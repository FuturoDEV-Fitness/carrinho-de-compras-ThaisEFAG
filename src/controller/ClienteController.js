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

  async pesquisaId(request, response) {
    try {
      const id = request.params.id;

      const clientes = await conexao.query(
        `
        SELECT * FROM clientes
        where id = $1
        `,
        [id]
      );

      if (clientes.rows.length === 0) {
        // rows é um array composto pelos retornos
        return response.status(404).json({ mensagem: "ID não encontrado" });
      }

      response.json(clientes.rows[0]);
      //   biblioteca trata os retornos como array: id (unico sempre), sempre terá somente o indice zero nas querys com id
    } catch (error) {
      response.status(500).json({ mensagem: "Não foi possível encontrar" });
    }
  }

  async deleteID(request, response) {
    try {
      const id = request.params.id;

      const rowCount = await conexao.query(
        `
                DELETE FROM clientes
                where id = $1
                `,
        [id]
      );

      if (rowCount === 0) {
        return response
          .status(404)
          .json({ mensagem: "Não foi encontrado um registro com esse id" });
      }

      response.staus(204).json({ mensagem: "Cadastro deletado!" });
    } catch (error) {
      response.status(500).json({ mensagem: "Houve um erro ao deletar" });
    }
  }
}

// body = rotas de atualizar e cadastrar
// query params = rotas get (listar um ou todos os dados
// rout params = listar um dado ou atualizar

module.exports = new ClienteController();
