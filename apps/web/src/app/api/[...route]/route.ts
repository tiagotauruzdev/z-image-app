import { handle } from 'hono/vercel';

// Import dinâmico para evitar problemas de build
const getApp = async () => {
  const { default: app } = await import('../../../../../server/src/index');
  return app;
};

// Configuração para usar Node Runtime (Edge não suporta imports dinâmicos)
export const runtime = 'nodejs';

// Export handlers que carregam o app dinamicamente
export async function GET(request: Request) {
  const app = await getApp();
  return handle(app)(request);
}

export async function POST(request: Request) {
  const app = await getApp();
  return handle(app)(request);
}

export async function PUT(request: Request) {
  const app = await getApp();
  return handle(app)(request);
}

export async function DELETE(request: Request) {
  const app = await getApp();
  return handle(app)(request);
}

export async function PATCH(request: Request) {
  const app = await getApp();
  return handle(app)(request);
}

export async function OPTIONS(request: Request) {
  const app = await getApp();
  return handle(app)(request);
}