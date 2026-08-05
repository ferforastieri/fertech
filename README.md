# Fertech Portfolio

Home experimental de Fernando Forastieri, construída com Next.js, Tailwind CSS e Anime.js.

## Estrutura

```text
app/
  (portfolio)/page.tsx
  components/
    portfolio/   # componentes exclusivos da home
    ui/          # primitives globais reutilizáveis
```

- A home é a única rota de produto.
- `ui/` contém somente componentes globais como logo, botão, card e scene shell.
- O fundo utiliza uma fotografia de livro do Pexels, tratada pela identidade visual do site.
- Anime.js controla a entrada, o movimento ambiente do livro e o cursor.
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
