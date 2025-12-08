import { getApiUrl, isDevelopment, isProduction } from '../src/lib/api';

console.log('=== Verificação de Configuração da API ===\n');

// Verificar ambiente
console.log(`Ambiente: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`Desenvolvimento: ${isDevelopment()}`);
console.log(`Produção: ${isProduction()}\n`);

// Verificar URLs
const testPaths = [
  '/api/image/create',
  '/api/image/status/123',
  '/api/image/history'
];

console.log('URLs geradas:');
testPaths.forEach(path => {
  const url = getApiUrl(path);
  console.log(`  ${path} → ${url}`);
});

console.log('\nVariáveis de ambiente:');
console.log(`  NEXT_PUBLIC_API_BASE_URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'undefined'}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);