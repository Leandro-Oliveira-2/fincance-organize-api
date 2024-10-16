import "reflect-metadata";
import fastify from 'fastify';
import cors from "@fastify/cors";
import formbody from "@fastify/formbody"; // Adicione esta linha
import { env } from "process";
import { ZodError } from "zod";
import { routes } from "./common/infra/routes";
import container from "./common/container";

export const app = fastify({ trustProxy: true });

// Configura o CORS
app.register(cors, {
  origin: true, // Permite todas as origens. Ajuste conforme necessário.
});

// Registra o plugin formbody
app.register(formbody); // Adicione esta linha

// Registra as rotas
app.register(routes, { container: container, prefix: "/finance-api" });

// Manipulador de erros
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({ message: "Internal server error." });
});