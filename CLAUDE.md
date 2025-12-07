# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Arquitetura do Projeto

Este é um monorepo TypeScript usando Turborepo com duas aplicações principais:

- **Frontend (Next.js)**: `apps/web` - Aplicação web React com TypeScript, TailwindCSS e shadcn/ui
- **Backend (Hono)**: `apps/server` - API REST usando Hono framework
- **Database**: `packages/db` - Camada de banco de dados PostgreSQL com Drizzle ORM

O projeto usa **pnpm** como gerenciador de pacotes e configurações compartilhadas via workspace.

## Comandos Essenciais

### Desenvolvimento
```bash
# Instalar dependências
pnpm install

# Iniciar todas as aplicações (web na porta 3001, server na porta 3000)
pnpm run dev

# Iniciar apenas o frontend
pnpm run dev:web

# Iniciar apenas o backend
pnpm run dev:server
```

### Banco de Dados (PostgreSQL + Drizzle)
```bash
# Aplicar schema ao banco (usando drizzle-kit push)
pnpm run db:push

# Abrir Drizzle Studio (interface visual)
pnpm run db:studio

# Gerar migrations
pnpm run db:generate

# Rodar migrations
pnpm run db:migrate
```

### Build e Type Checking
```bash
# Build de todas as aplicações
pnpm run build

# Verificar tipos TypeScript em todos os pacotes
pnpm run check-types
```

## Configuração de Ambiente

- Variáveis de ambiente do servidor devem ser configuradas em `apps/server/.env`
- `DATABASE_URL` é necessária para conexão com PostgreSQL
- `CORS_ORIGIN` para configuração de CORS na API

## Estrutura de Arquivos Importantes

- `apps/server/src/index.ts`: Entry point da API Hono
- `apps/web/src/app/layout.tsx`: Layout root do Next.js com Providers
- `packages/db/src/index.ts`: Configuração do Drizzle ORM
- `packages/db/drizzle.config.ts`: Configuração do Drizzle Kit

## Stack Técnico

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS v4, shadcn/ui
- **Backend**: Hono, Node.js, TypeScript
- **Database**: PostgreSQL com Drizzle ORM
- **Monorepo**: Turborepo, pnpm workspaces
- **Styling**: TailwindCSS com CSS-in-JS (Next.js)
- **UI Components**: Radix UI + shadcn/ui
- **Form Validation**: TanStack React Form com Zod
- **State Management**: TanStack React Query
- **Theme**: next-themes (dark/light mode)