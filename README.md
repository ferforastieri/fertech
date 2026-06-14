# FerTech Portfolio

Portfolio de Fernando Forastieri Neto em React, TypeScript, Vite, Supabase e experiencias WebGL. O projeto tem dois modos publicos: tradicional e Aurora. Os dois consomem a mesma base de conteudo no Supabase.

## Stack

- React 18 com React Router.
- TypeScript e Vite.
- Supabase para conteudo publico, painel administrativo e autenticacao.
- React Query em `src/api/queryClient.ts`.
- Three.js, React Three Fiber, Drei, GSAP e Motion para experiencias visuais.
- Tailwind CSS para estilos.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Variaveis

Configure o `.env` local com as chaves usadas em `src/config/env`. Nao versionar credenciais.

Exemplo:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Estrutura

- `src/api`: hooks de dados, integracao Supabase, query client e geracao de PDF.
- `src/components`: componentes reutilizaveis por modulo.
- `src/components/playground`: experimentos WebGL e mini games do playground.
- `src/components/seo`: metadados por rota.
- `src/config/supabase`: cliente Supabase e migrations do banco.
- `src/contexts`: contextos globais.
- `src/hooks`: hooks compartilhados.
- `src/pages`: paginas roteadas da aplicacao.
- `public`: manifest, favicons e arquivos publicos como `robots.txt`.

## Conteudo e Supabase

As tabelas publicas sao mantidas por migrations em `src/config/supabase/migrations`. O conteudo editavel do site deve vir do Supabase e ser alterado pelo painel administrativo, nao chumbado nas telas.

Antes de alterar schema ou dados iniciais:

1. Crie uma migration nova em `src/config/supabase/migrations`.
2. Evite seeds soltos fora das migrations.
3. Garanta que modo tradicional e modo Aurora leem a mesma fonte de dados.
4. Rode `npm run build` depois das alteracoes.

## Painel

O painel administrativo fica em `src/pages/admin/AdminDashboard.tsx`. Ele organiza conteudo de perfil, home, site, projetos, artigos e curriculo. Os controles devem manter alinhamento consistente, botoes com largura adequada no mobile e acoes de remocao como icone na mesma linha do item removido.

## SEO

O projeto aplica SEO em duas camadas:

- `index.html` traz metadados iniciais, idioma `pt-BR`, Open Graph, Twitter Card, `robots` e cores de tema para claro/escuro.
- `src/components/seo/RouteSeo.tsx` atualiza titulo, descricao, canonical, Open Graph, Twitter Card e JSON-LD conforme a rota.

As rotas duplicadas entre tradicional, Aurora e aliases usam canonical para a rota principal quando o conteudo e equivalente. Isso reduz duplicidade sem remover as experiencias.

Quando houver dominio final definido, vale adicionar um `sitemap.xml` absoluto em `public` e referenciar esse arquivo no `robots.txt`. Nao foi fixado um dominio no codigo para evitar canonical errado em deploys diferentes.

Referencias usadas:

- Google Search Central: JavaScript SEO basics.
- Google Search Central: SEO Starter Guide.
- Google Search Central: Structured Data.
- web.dev: Metadata.

## Verificacao

```bash
npm run build
```
