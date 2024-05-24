const express = require("express");
const router = express.Router();

// Utils
const { convertBrazilianDateToAmericanDate } = require("../utils/date-utils");
const { withPrisma } = require("../utils/db-utils");
const { usingRA, usingCreateAluno } = require("../middleware/aluno-middleware");

router.get("/alunos", async (req, res) => {
  const alunos = await withPrisma(
    async (prisma) => await prisma.aluno.findMany()
  );
  res.status(alunos?.statusCode || 200).json(alunos);
});

router.get("/aluno/:ra", usingRA, async (req, res) => {
  const aluno = await withPrisma((prisma) =>
    prisma.aluno.findUnique({
      where: {
        RA: req.params.ra,
      },
    })
  );

  res.status(aluno?.statusCode || 200).json(aluno);
});

router.post("/aluno", usingCreateAluno, async (req, res) => {
  const aluno = await withPrisma(async (prisma) =>
    prisma.aluno.create({
      data: {
        RA: req.body.RA,
        nome: req.body.nome,
        data_de_nascimento: new Date(
          convertBrazilianDateToAmericanDate(req.body.data_de_nascimento)
        ),
      },
    })
  );
  res
    .status(aluno?.statusCode || 201)
    .json(aluno.erro ? aluno : { status: "Aluno inserido com Sucesso!" });
});

router.patch("/aluno/:ra", usingRA, async (req, res) => {
  const aluno = await withPrisma(async (prisma) =>
    prisma.aluno.update({
      where: {
        RA: req.params.ra,
      },
      data: {
        nome: req.body.nome,
        email: req.body.email,
        data_de_nascimento: new Date(
          convertBrazilianDateToAmericanDate(req.body.data_de_nascimento)
        ),
      },
    })
  );
  res
    .status(aluno?.statusCode || 200)
    .json(aluno.erro ? aluno : { status: "Aluno alterado com Sucesso!" });
});

router.delete("/aluno/:ra", usingRA, async (req, res) => {
  const aluno = await withPrisma(async (prisma) =>
    prisma.aluno.delete({
      where: {
        RA: req.params.ra,
      },
    })
  );
  res
    .status(aluno?.statusCode || 200)
    .json(aluno.erro ? aluno : { status: "Aluno excluído com Sucesso!" });
});

module.exports = router;
