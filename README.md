# Fertec Portfolio

Portfólio de Fernando Forastieri, construído com Next.js, CSS modular e Anime.js.

## Estrutura

```text
app/
  (portfolio)/page.tsx
  components/
    portfolio/   # componentes exclusivos da home
    ui/          # primitives globais reutilizáveis
```

- O portfólio reúne home, projetos, sobre e currículo.
- `ui/` contém somente componentes globais como logo, botão, card e scene shell.
- O fundo utiliza uma fotografia de servidores do Pexels, tratada pela identidade visual do site.
- Anime.js controla a inicialização do servidor, transições de terminal, entrada do conteúdo, texto digitado, movimento ambiente e cursor.
- Manrope e Instrument Serif ficam empacotadas localmente.

## Ambiente

Somente `NEXT_PUBLIC_SITE_URL` é necessário. Arquivos `.env*` locais continuam ignorados pelo Git.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm start
```
