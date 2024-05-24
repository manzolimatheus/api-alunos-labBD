const { withPrisma } = require("../utils/db-utils");

async function usingRA(req, res, next) {
  const { ra } = req.params;
  if (!ra) {
    return res
      .status(400)
      .send({ status: "RA não foi fornecido e é um campo obrigatório." });
  }

  const exists = await withPrisma((prisma) =>
    prisma.aluno.findUnique({ where: { RA: ra } })
  );

  if (!exists) {
    return res.status(404).send({ status: "Aluno não encontrado!" });
  }

  next();
}

async function usingCreateAluno(req, res, next) {
  const aluno = req.body;
  if (!aluno) {
    return res
      .status(400)
      .send({ status: "Aluno não foi fornecido e é um item obrigatório." });
  }

  const requiredFields = ["nome", "RA", "data_de_nascimento"];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!aluno[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).send({
      status: `Campos obrigatórios não preenchidos: ${missingFields.join(
        ", "
      )}`,
    });
  }

  const alreadyExists = await withPrisma((prisma) =>
    prisma.aluno.findUnique({ where: { RA: aluno.RA } })
  );

  if (alreadyExists) {
    return res.status(409).send({ status: "Aluno já cadastrado!" });
  }

  next();
}

module.exports = { usingRA, usingCreateAluno };
