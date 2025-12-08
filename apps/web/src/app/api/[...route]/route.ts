import { handle } from 'hono/vercel';
import app as honoApp from '../../../../../server/src/index';

// Configuração para usar Edge Runtime na Vercel
export const runtime = 'edge';

// Export handlers para todos os métodos HTTP suportados pelo Hono
export const GET = handle(honoApp);
export const POST = handle(honoApp);
export const PUT = handle(honoApp);
export const DELETE = handle(honoApp);
export const PATCH = handle(honoApp);
export const OPTIONS = handle(honoApp);