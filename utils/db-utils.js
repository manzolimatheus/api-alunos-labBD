const { PrismaClient } = require("@prisma/client");

async function withPrisma(callback) {
  const prisma = new PrismaClient();
  try {
    return await callback(prisma);
  } catch (e) {
    console.error(e);
    return {
      status:
        "Erro ao processar sua solicitação, por favor, tente novamente mais tarde!",
      erro: e?.meta?.cause || "Causa não definida.",
      statusCode: 500,
    };
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { withPrisma };
