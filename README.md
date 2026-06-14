# FerTech Portfolio

Portfolio pessoal e profissional de Fernando Forastieri Neto. O projeto combina uma experiencia tradicional, uma experiencia imersiva chamada Aurora, painel administrativo, conteudo dinamico via Supabase, internacionalizacao e experimentos WebGL.

## Visao Geral

O site possui dois modos publicos que compartilham a mesma base de dados:

- **Tradicional**: leitura objetiva, navegacao convencional e foco em recrutadores, projetos, artigos e curriculo.
- **Aurora**: experiencia visual imersiva com animacoes, WebGL, navegacao customizavel e playground/laboratorio interativo.

O conteudo editavel nao deve ficar chumbado nas telas. Textos, projetos, artigos, curriculo, labels globais e conteudo do playground sao carregados do Supabase e administrados pelo painel.

## Stack

- **React 18** para UI.
- **TypeScript** com `strict` ativo.
- **Vite** para desenvolvimento e build.
- **React Router** para rotas publicas, Aurora, detalhes e admin.
- **Supabase** para banco, autenticacao, RLS e storage de logos.
- **React Query** para cache e sincronizacao de dados.
- **Tailwind CSS** para estilo.
- **Three.js**, **React Three Fiber** e **Drei** para cenas e experimentos WebGL.
- **GSAP** e **Motion** para animacoes e transicoes.
- **jsPDF/html2canvas** para geracao de curriculo em PDF.
- **Zod** para validacao de ambiente.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

Use `npm run build` como verificacao principal antes de finalizar alteracoes.

## Ambiente

Configure o `.env` local com:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

O cliente normaliza `VITE_SUPABASE_URL` para a origem do projeto Supabase em `src/config/env`.

## Arquitetura

```txt
src/
  api/                 Hooks de dados, Supabase, i18n helpers e PDF.
  components/          Componentes reutilizaveis por modulo.
  components/aurora/   Layout, cena, loading e efeitos da experiencia Aurora.
  components/language/ Seletor de idioma.
  components/playground/ WebGL, mini games e exploradores visuais.
  components/projects/ Detalhes tecnicos dos projetos.
  components/seo/      SEO por rota, canonical, Open Graph e JSON-LD.
  components/ui/       Componentes base de formulario, layout e feedback.
  config/              Env e Supabase.
  contexts/            ExperienceContext e LanguageContext.
  hooks/               Hooks compartilhados.
  pages/               Paginas roteadas.
```

## Rotas

Principais rotas publicas:

- `/`: gateway de escolha de experiencia.
- `/classic`: home tradicional.
- `/classic/projects`: projetos no modo tradicional.
- `/classic/projects/:projectId`: detalhe de projeto tradicional.
- `/classic/blog`: artigos no modo tradicional.
- `/classic/blog/:slug`: detalhe de artigo tradicional.
- `/classic/resume`: curriculo tradicional.
- `/aurora`: home Aurora.
- `/aurora/projects`: projetos Aurora.
- `/aurora/projects/:projectId`: detalhe de projeto Aurora.
- `/aurora/blog`: artigos Aurora.
- `/aurora/blog/:slug`: detalhe de artigo Aurora.
- `/aurora/resume`: curriculo Aurora.
- `/aurora/playground`: laboratorio WebGL.
- `/admin/login`: login administrativo.
- `/admin`: painel protegido.

Tambem existem aliases sem `/classic` para blog, projetos e curriculo.

## Supabase

As migrations ficam em:

```txt
src/config/supabase/migrations
```

Tabelas principais:

- `profile`: dados pessoais, logo, redes, tecnologias, sobre e destaques.
- `home_content`: textos da home, botoes, titulos e grupos de stack.
- `site_content`: navegacao, labels globais, textos de paginas, playground e arquitetura.
- `project_groups`: agrupadores de projetos.
- `projects`: cards, links, arquitetura e detalhes tecnicos.
- `articles`: artigos profissionais e pessoais.
- `resume_settings`: configuracoes gerais do curriculo.
- `resume_experiences`: experiencias profissionais.
- `resume_roles`: cargos dentro de experiencias.
- `resume_education`: formacao.
- `resume_technologies`: tecnologias do curriculo.
- `admin_users`: lista de usuarios autorizados.
- Storage bucket `logos`: imagens publicas usadas no site.

RLS libera leitura publica do conteudo e escrita somente para usuarios autenticados que passam pela funcao `public.is_admin()`.

## Internacionalizacao

Idiomas suportados:

- `pt-BR`
- `en`
- `es`

A deteccao inicial usa `navigator.languages` e respeita a escolha salva em `localStorage`.

Arquivos principais:

- `src/contexts/language/LanguageContext.tsx`
- `src/components/language/LanguageSelect.tsx`
- `src/api/i18n/translations.ts`

Modelo de dados:

- Portugues (`pt-BR`) usa as colunas principais.
- Ingles e espanhol usam `translations jsonb` nas tabelas de conteudo.
- Os hooks incluem `locale` no `queryKey`.
- Sem fallback silencioso para `en` e `es`: se a traducao estiver ausente, a tela mostra erro em vez de misturar idiomas.

No painel, o seletor de idioma define qual versao sera editada:

- `pt-BR`: salva nas colunas principais.
- `en` e `es`: salva dentro de `translations`.

## Painel Administrativo

Arquivo principal:

```txt
src/pages/admin/AdminDashboard.tsx
```

O painel edita:

- Perfil.
- Home.
- Conteudo global do site.
- Projetos e detalhes tecnicos.
- Artigos.
- Curriculo.
- Traducoes por idioma.

O painel usa os mesmos hooks publicos do site, entao a edicao reflete o mesmo conteudo que o usuario ve.

## Projetos

Projetos sao organizados por `project_groups`. Cada projeto pode ter:

- Titulo.
- Descricao.
- Logo.
- Tags.
- Link "Ver projeto".
- Link "Ver site".
- Arquitetura visual.
- Detalhes completos em `details`.

Os cards mostram botoes apenas quando os respectivos campos existem. A tela de detalhes usa os dados do Supabase para apresentar stack, modulos, fluxos, metricas, responsabilidades e aprendizados.

## Playground / Laboratorio

O laboratorio fica em:

```txt
src/pages/aurora/AuroraPlayground.tsx
src/components/playground/
```

Ele inclui:

- Experimentos WebGL.
- Mini games.
- Controles visuais.
- Cores e modos configuraveis pelo conteudo do Supabase.
- Componentes de arquitetura animada usados nos detalhes de projetos.

## SEO

O SEO e aplicado em duas camadas:

- `index.html`: metadados iniciais, idioma base, Open Graph, Twitter Card, robots e tema claro/escuro.
- `src/components/seo/RouteSeo.tsx`: atualiza titulo, description, canonical, Open Graph, Twitter Card e JSON-LD conforme a rota.

Rotas duplicadas entre tradicional, Aurora e aliases apontam canonical para a rota principal quando o conteudo e equivalente.

Quando houver dominio final definido, adicionar `sitemap.xml` absoluto em `public` e referenciar no `robots.txt`.

## Estilo

O projeto usa Tailwind com tokens definidos em `src/index.css`:

- `background`
- `foreground`
- `card`
- `popover`
- `primary`
- `secondary`
- `muted`
- `accent`
- `border`
- `ring`

O modo Aurora possui overrides especificos para tema claro, mantendo contraste em componentes originalmente feitos para fundo escuro.

## Fluxo de Manutencao

Antes de alterar conteudo estrutural:

1. Criar migration em `src/config/supabase/migrations`.
2. Evitar seeds soltos fora das migrations.
3. Garantir que tradicional e Aurora leem a mesma fonte.
4. Atualizar painel quando o campo precisar ser editavel.
5. Incluir traducao em `translations` para `en` e `es`.
6. Rodar `npm run build`.

## Observacoes Tecnicas

- `queryClient` fica em `src/api/queryClient.ts`.
- Supabase fica em `src/config/supabase`.
- O app usa `LanguageProvider` e `ToastProvider` no topo em `src/main.tsx`.
- O painel invalida queries apos salvar para refletir dados atualizados.
- Arquivos de conteudo publico devem ser buscados do Supabase, nao hardcoded em pagina.

## Verificacao

```bash
npm run build
```
