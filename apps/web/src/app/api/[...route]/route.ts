// Este arquivo será substituído pelo handler da API do Hono
// Para desenvolvimento local, use o backend separado na porta 3000
// Para produção, o Vercel irá configurar o rewrite correto

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return new Response('API proxy - use backend server at :3000 for development', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

export async function POST(request: Request) {
  return GET(request);
}

export async function PUT(request: Request) {
  return GET(request);
}

export async function DELETE(request: Request) {
  return GET(request);
}

export async function PATCH(request: Request) {
  return GET(request);
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 200 });
}