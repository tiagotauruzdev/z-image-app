# Configuração de URLs da API

Este documento explica como as URLs da API são configuradas para funcionar corretamente em desenvolvimento e produção.

## Visão Geral

O frontend usa URLs adaptativas dependendo do ambiente:

- **Desenvolvimento**: Usa URLs absolutas (`http://localhost:3000/api/...`)
- **Produção**: Usa URLs relativas (`/api/...`)

## Implementação

A função `getApiUrl()` em `/src/lib/api.ts` gerencia automaticamente as URLs:

```typescript
import { getApiUrl } from '@/lib/api';

// Exemplos de uso:
fetch(getApiUrl('/api/image/create'))  // Dev: http://localhost:3000/api/image/create
                                      // Prod: /api/image/create
```

## Configuração de Ambiente

### Variáveis de Ambiente

- `NEXT_PUBLIC_API_BASE_URL`: URL base da API para desenvolvimento
- `NODE_ENV`: Determina o ambiente (development/production)

### Arquivos .env

#### Desenvolvimento (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

#### Produção (.env.production)
```env
# Não é necessário definir NEXT_PUBLIC_API_BASE_URL
# As URLs serão relativas automaticamente
```

## Fluxos de API Implementados

Os seguintes endpoints estão configurados com URLs adaptativas:

1. **Criar Imagem**: `/api/image/create`
   - Usado em: `ImageForm.tsx`
   - Método: POST

2. **Verificar Status**: `/api/image/status/:taskId`
   - Usado em: `TaskStatus.tsx`
   - Método: GET

3. **Histórico**: `/api/image/history`
   - Usado em: `GenerationHistory.tsx`
   - Método: GET

## Testes

### Para testar em desenvolvimento:

1. Verifique se o backend está rodando em `http://localhost:3000`
2. As chamadas de API usarão URLs absolutas

### Para testar em produção:

1. Faça o deploy da aplicação
2. As chamadas usarão URLs relativas automaticamente
3. O Next.js irá direcionar as requisições para o handler da API

## Solução de Problemas

### CORS em Desenvolvimento

Se encontrar erros de CORS:
- Verifique se o backend está configurado para aceitar requisições de `http://localhost:3001`
- A variável `CORS_ORIGIN` deve incluir o URL do frontend

### URLs não funcionam em produção

Se as chamadas falharem em produção:
- Verifique se o `vercel.json` está configurado corretamente para reescrever as rotas
- Confirme que não há uma URL hardcoded no código