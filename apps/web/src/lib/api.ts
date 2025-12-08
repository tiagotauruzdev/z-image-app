/**
 * Utilitário para gerenciar URLs da API adaptativas entre desenvolvimento e produção
 *
 * Em desenvolvimento: usa URLs absolutas (http://localhost:3000)
 * Em produção: usa URLs relativas (mesmo domínio)
 */

/**
 * Retorna a URL base da API dependendo do ambiente
 * @returns URL base da API
 */
function getApiBaseUrl(): string {
  // Em desenvolvimento, usa a variável de ambiente ou localhost:3000
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  }

  // Em produção, retorna string vazia para usar URLs relativas
  return '';
}

/**
 * Constrói uma URL completa para a API dependendo do ambiente
 * @param path - Caminho da API (ex: '/api/image/create')
 * @returns URL completa da API
 */
export function getApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();

  // Remove barras duplicadas
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Em produção (baseUrl vazio), retorna apenas o path
  if (!cleanBaseUrl) {
    return cleanPath;
  }

  // Em desenvolvimento, retorna baseUrl + path
  return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * Verifica se a aplicação está em modo de desenvolvimento
 * @returns true se estiver em desenvolvimento
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Verifica se a aplicação está em modo de produção
 * @returns true se estiver em produção
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}