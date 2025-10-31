# Portfolio - Fernando Forastieri Neto

Portfolio profissional desenvolvido com Next.js 14, React, TypeScript e Tailwind CSS.

## Stack Tecnológica

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Radix UI** - Componentes acessíveis

## Estrutura do Projeto

```
/app
  /blog          - Página de blog
  layout.tsx     - Layout principal
  page.tsx       - Página inicial
  globals.css    - Estilos globais

/components
  /sections      - Componentes de seções (Hero, About, Experience, etc)
  /ui            - Componentes UI reutilizáveis
  header.tsx     - Cabeçalho do site
  title.tsx     - Componente de título

/provider
  provider-theme.tsx - Provider de tema (dark/light mode)
```

## Como executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador

## Build para produção

```bash
npm run build
npm start
```

