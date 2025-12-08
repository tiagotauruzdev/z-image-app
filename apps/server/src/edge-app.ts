import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { imageGenerationRouter } from "./routes/image-generation";
import { webhookRouter } from "./routes/webhook";

const app = new Hono();

// Middleware global
app.use(logger());

// CORS apenas para desenvolvimento (em produção, não é necessário)
if (process.env.NODE_ENV !== 'production') {
  app.use(
    "/*",
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3001",
      allowMethods: ["GET", "POST", "OPTIONS"],
    }),
  );
}

// Rotas da API
app.route("/api/image", imageGenerationRouter);
app.route("/api/webhook", webhookRouter);

app.get("/", (c) => {
	return c.text("OK");
});

// Export default para Vercel/Next.js integration
export default app;