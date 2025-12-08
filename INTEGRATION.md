# Integração Frontend + Backend (Next.js + Hono)

Este documento descreve como a integração entre o frontend Next.js e o backend Hono foi configurada para deploy na Vercel.

## Arquitetura

### Estrutura do Monorepo
```
z-image-app/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── server/       # Backend Hono API
├── packages/
│   └── db/           # Banco de dados compartilhado
└── vercel.json       # Configuração de deploy
```

## Configurações Realizadas

### 1. Dependencies do Frontend (`apps/web/package.json`)

Adicionadas as dependências do backend como workspace:
```json
{
  "dependencies": {
    "@z-image-app/db": "workspace:*",
    "server": "workspace:*",
    "@hono/zod-validator": "^0.7.5"
  }
}
```

### 2. TypeScript Paths (`apps/web/tsconfig.json`)

Configurados os paths para imports do workspace:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "server": ["../server/src"],
      "@z-image-app/db": ["../../packages/db/src"]
    }
  }
}
```

### 3. API Route Wrapper

A API route `apps/web/src/app/api/[...route]/route.ts` funciona como:
- **Desenvolvimento**: Proxy que indica usar o backend separado na porta 3000
- **Produção**: Recebe os requests através do rewrite do vercel.json

### 4. Vercel Configuration

O arquivo `vercel.json` configura:
- Build command apontando para o frontend
- Output directory correto
- Runtime edge para performance
- Rewrite de todas as rotas `/api/*` para o handler

## Deploy na Vercel

### Backend Separado (Opção 1)
- Frontend: Deployado como aplicação Next.js padrão
- Backend: Deployado separadamente como função serverless
- Comunicação: Através de URLs da API

### Backend Integrado (Opção 2 - Configuração Atual)
- Frontend e Backend no mesmo projeto
- API routes do Next.js servem como proxy
- A integração real acontece através do rewrite no vercel.json

## Como Usar

### Importando Tipos no Frontend

```typescript
// Importando tipos do backend para tipagem forte
import type { CreateTaskResponse } from 'server/src/services/z-image-api';

// Ou através do helper api-types
import { apiClient, CreateTaskRequest } from '@/lib/api-types';

const task = await apiClient.createTask({
  prompt: "Uma imagem de teste",
  aspectRatio: "1:1"
});
```

### Desenvolvimento Local

1. Iniciar o backend:
```bash
pnpm run dev:server  # Roda na porta 3000
```

2. Iniciar o frontend:
```bash
pnpm run dev:web     # Roda na porta 3001
```

3. O frontend automatically se conecta ao backend através das chamadas de API

### Comandos Úteis

```bash
# Instalar dependências de todos os pacotes
pnpm install

# Verificar tipos em todo o projeto
pnpm run check-types

# Build para produção
pnpm run build

# Iniciar desenvolvimento (ambos os serviços)
pnpm run dev
```

## Próximos Passos

1. Implementar middleware de autenticação compartilhado
2. Configurar variáveis de ambiente para produção
3. Implementar rate limiting na API
4. Adicionar logging centralizado
5. Configurar testes E2E para a integração