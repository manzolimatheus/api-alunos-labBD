const express = require("express");

const app = express();
app.use(express.json());

// Routes
const alunoRouter = require("./routes/aluno");

app.use("/", alunoRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace to the console
  res.status(500).json({
    status: "Erro interno da aplicação, por favor, tente novamente mais tarde!",
    erro: err.message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
