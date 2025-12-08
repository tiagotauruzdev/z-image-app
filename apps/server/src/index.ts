import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import { imageGenerationRouter } from "./routes/image-generation";
import { webhookRouter } from "./routes/webhook";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
	}),
);

// Rotas da API
app.route("/api/image", imageGenerationRouter);
app.route("/api/webhook", webhookRouter);

app.get("/", (c) => {
	return c.text("OK");
});

// Para Vercel serverless
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

// Para desenvolvimento local - manter export default
export default app;

// Para desenvolvimento local
import { serve } from "@hono/node-server";

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
