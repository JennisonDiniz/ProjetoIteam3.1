// Aula 5 do dia 13/04/2026
/* criação do servidor com pgAdmin no computardo do curso */
//Aula 9 do dia16-04-2026
// src/server.js
const express = require("express");
const app = express();
const port = 3000;

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// ... outras importações (express, etc.)
const db = require("./db"); // Importa nosso módulo de conexão

// Rota principal
app.get("/", (req, res) => {
  res.send("Bem-vindo à API de tasks!");
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// GET /tasks - Retorna todas as tasks

app.get("/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// POST /tasks - Cria uma nova tarefa
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Tarefa não encontrada.");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// PUT /tasks/:id - Atualiza uma tarefa existente
app.post("/tasks", async (req, res) => {
  const { title, description, status, user_id } = req.body;

  // Validação simples
  if (!title || !user_id) {
    return res.status(400).send("Título e user_id são obrigatórios.");
  }

  const query = `
    INSERT INTO tasks (title, description, status, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [title, description || null, status || "pendente", user_id];

  try {
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// DELETE /tasks/:id - Deleta uma tarefa
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Tarefa não encontrada.");
    }

    res.status(204).send(); // 204 No Content é a resposta padrão para um DELETE bem-sucedido
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

