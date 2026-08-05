# Fertech Portfolio

Portfolio estático de Fernando Forastieri Neto, com um caderno de campo interativo animado por Anime.js.

## Arquitetura

- Next.js com exportação estática e HTML indexável por rota.
- Cloud Firestore como fonte única de conteúdo; Firebase Authentication protege `/admin/`.
- Fotos e logos vivem em `public/media/`, sem Firebase Storage e sem plano Blaze.
- Anime.js v4 concentra as timelines, viradas de página, transições e microinterações.
- O conteúdo é consultado no Firestore durante o build. Registros ou campos obrigatórios ausentes interrompem o build com erro explícito.
- Metadados, canonical, Open Graph, JSON-LD, sitemap e robots são gerados no build.

## Configuração do Firebase

1. Crie um projeto e um app Web no Firebase Console.
2. Ative Cloud Firestore e Authentication > E-mail/senha.
3. Copie `.env.example` para `.env.local` e preencha as variáveis `NEXT_PUBLIC_FIREBASE_*`.
4. Publique as regras com `firebase deploy --only firestore:rules`.

As regras incluídas permitem leitura pública do portfólio e escrita somente para usuários autenticados. Para produção com mais de um usuário, restrinja a escrita a um UID de administrador.

## Migrar do Supabase

O script consulta as tabelas antigas pela API REST e grava documentos equivalentes no Firestore. Use uma service role do Supabase apenas durante a migração e credenciais administrativas do Firebase via `GOOGLE_APPLICATION_CREDENTIALS` (recomendado) ou `FIREBASE_SERVICE_ACCOUNT`.

```bash
export SUPABASE_URL=https://seu-projeto.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=...
export FIREBASE_PROJECT_ID=seu-projeto
export GOOGLE_APPLICATION_CREDENTIALS=/caminho/service-account.json
npm run migrate:firebase
```

O processo pagina todas as tabelas, baixa os arquivos públicos do Supabase Storage para `public/media/supabase-migration/`, reescreve as URLs como caminhos locais e grava os documentos com `set` em lotes. Os arquivos passam a fazer parte do build estático. Depois de conferir o conteúdo no Firestore e no site, revogue a chave antiga do Supabase e remova as variáveis `SUPABASE_*` do ambiente.

## Comandos

```bash
npm install
npm run migrate:assets
npm run migrate:firebase
npm run dev
npm run typecheck
npm run build
```

O build gera o site em `out/`.
