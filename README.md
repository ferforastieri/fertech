# Fertech Portfolio

Portfolio único, estático e animado de Fernando Forastieri Neto.

## Arquitetura

- Next.js com exportação estática: cada rota gera HTML indexável.
- Supabase continua como única fonte de dados, autenticação e storage.
- Nenhum backend próprio e nenhuma configuração de deploy.
- Framer Motion apenas para progressive enhancement; conteúdo e links existem antes do JavaScript.
- Não há conteúdo fallback: credenciais, registros ou campos obrigatórios ausentes interrompem o build com erro explícito.
- Metadados por página, canonical, Open Graph, JSON-LD, sitemap e robots gerados no build.

## Ambiente

```bash
cp .env.example .env.local
```

Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL`.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

O build gera o site estático em `out/`. Artigos e projetos são consultados no Supabase durante o build e transformados em páginas HTML individuais.

## Rotas

- `/`
- `/blog/`
- `/blog/[slug]/`
- `/projects/[id]/`
- `/resume/`
- `/admin/`

Não existem modos Classic, Aurora, playground ou rotas de compatibilidade.
