# Fertec — Portfolio

Portfólio pessoal de [Fernando Forastieri](https://fer.tec.br), engenheiro de software fullstack. O projeto apresenta trajetória profissional, projetos e currículo em uma experiência editorial, responsiva e instalável.

**Produção:** [fer.tec.br](https://fer.tec.br)

## Objetivo

Reunir em uma única aplicação o trabalho e a identidade de Fernando sem transformar o portfólio em um catálogo genérico. A interface combina conteúdo profissional, narrativa pessoal e experimentação técnica, mantendo:

- leitura clara em desktop e mobile;
- temas claro e escuro;
- conteúdo em português, inglês e espanhol;
- transições e entradas coordenadas por Web Animations API e `requestAnimationFrame`;
- páginas pré-renderizadas para carregamento rápido e indexação;
- instalação como PWA e navegação básica offline.

## Experiência

- **Home:** apresentação, métricas e linha do tempo profissional.
- **Projetos:** trabalhos pessoais e profissionais, tecnologias, serviços e árvore de cada repositório.
- **Sobre:** interesses, referências e uma apresentação mais pessoal.
- **Currículo:** perfil, experiência, formação, competências e geração do PDF diretamente da página.
- **Sistema visual:** navegação reposicionável, cursor próprio, animações nativas e uma superfície de água interativa aplicada ao fundo global.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Aplicação | Next.js 16, React 19 e TypeScript 5 |
| Animação | Web Animations API e `requestAnimationFrame` |
| Gráficos | WebGL 1.0, GLSL e Canvas para a superfície de água |
| Conteúdo | next-intl e catálogos JSON tipados |
| Estilo | Tailwind CSS 4, Manrope e Instrument Serif locais |
| PDF | jsPDF carregado sob demanda |
| PWA | Web App Manifest, Service Worker e cache offline nativos |
| SEO | Metadata API, Open Graph gerado, JSON-LD, sitemap e robots |
| Entrega | Vercel e domínio `fer.tec.br` |

## Arquitetura

```text
app/
├── (portfolio)/              # rotas públicas e metadata por página
│   ├── page.tsx              # home
│   ├── projetos/             # índice e páginas SSG por slug
│   ├── sobre/
│   └── curriculo/
├── components/
│   ├── ui/                   # componentes realmente globais
│   ├── portfolio/            # componentes exclusivos da home
│   ├── projects/             # listagem, detalhes e árvore
│   ├── about/                # módulo Sobre
│   └── resume/               # módulo Currículo e exportação
├── hooks/                    # animações de entrada e scroll
├── layout.tsx                # shell, providers, metadata e JSON-LD
├── manifest.ts               # manifesto PWA gerado pelo Next.js
├── sitemap.ts                # páginas e projetos indexáveis
├── robots.ts
└── seo.ts                    # URL canônica e metadata compartilhada
messages/
├── pt-BR.json                # todo o conteúdo visível em português
├── en.json                   # tradução em inglês
├── es.json                   # tradução em espanhol
├── project-data.ts           # dados e estruturas dos projetos
└── site-content.ts           # identidade, contatos e metadata
public/
├── assets/                   # mídia local
├── pwa-icon.svg
├── pwa-maskable.svg
└── sw.js                     # cache do shell e fallback de navegação
```

### Fluxo de renderização

```text
Requisição
   ↓
Next.js App Router
   ├── páginas estáticas → HTML pré-renderizado + hidratação
   ├── projetos/[slug]   → SSG via generateStaticParams
   ├── metadata          → canonical + Open Graph + Twitter
   └── arquivos SEO      → manifest + sitemap + robots
   ↓
SceneShell global
   ├── preferências de tema, idioma e navegação
   ├── animações nativas do navegador
   └── conteúdo da rota
```

O conteúdo estático é renderizado previamente no servidor. Interações que dependem do navegador — animações, preferências, PDF, service worker e a superfície de água — ficam isoladas em Client Components.

## Como o efeito de água funciona

O fundo interativo é implementado em [`WaterSurface`](app/components/ui/water-surface.tsx) com WebGL 1.0 e GLSL, sem Three.js ou biblioteca de animação. Um único `canvas` fica fixo atrás das páginas, não recebe eventos diretamente (`pointer-events: none`) e é atualizado por `requestAnimationFrame`.

### 1. Estado da onda

A simulação usa uma textura RGBA de `384 × 384` pixels como uma grade numérica. O canal vermelho guarda a altura atual da água e o canal verde guarda a altura do quadro anterior. Os valores são normalizados entre `0` e `1` na textura e convertidos para `-1` a `1` dentro do shader.

Em cada quadro, o shader de simulação lê os quatro vizinhos de cada ponto — esquerda, direita, topo e base — e calcula a próxima altura com uma forma discreta da equação de ondas:

```text
próxima altura = (soma dos vizinhos × 0,5 − altura anterior) × amortecimento
```

O amortecimento é `0.986`, suficiente para as ondas perderem energia gradualmente sem desaparecerem de imediato.

### 2. Ping-pong entre texturas

WebGL não permite ler e escrever com segurança na mesma textura durante o mesmo passe. Por isso o componente cria duas texturas e dois framebuffers:

```text
textura A → shader de simulação → textura B
textura B → shader de simulação → textura A
```

As referências de origem e destino são trocadas após cada quadro. Essa técnica é conhecida como *ping-pong rendering* e mantém toda a simulação na GPU.

### 3. Interação com o ponteiro

O movimento global do ponteiro é convertido para coordenadas UV entre `0` e `1`. Cada movimento injeta uma perturbação gaussiana na grade, com raio `0.018`. A intensidade considera a velocidade do gesto e é limitada ao intervalo de `0.07` a `0.24`; movimentos rápidos geram ondas mais fortes.

### 4. Refração da imagem

O segundo shader não desenha geometria de água. Ele calcula o gradiente da altura comparando os vizinhos da grade e usa esse vetor para deslocar as coordenadas da imagem de fundo:

```text
UV da imagem = UV da tela + gradiente da onda × 0.055
```

Esse pequeno desvio cria a impressão de refração. O comprimento do gradiente também adiciona um brilho discreto nas cristas. A função `coverUv` corrige a proporção entre canvas e imagem para reproduzir o comportamento de `background-size: cover` sem deformação.

### 5. Desempenho e acessibilidade

- a simulação é fixa em `384 × 384`, independentemente da resolução da tela;
- o `devicePixelRatio` do canvas é limitado a `1.5`;
- antialias e transparência do contexto são desativados;
- apenas dois passes com um retângulo de seis vértices são executados por quadro;
- texturas, framebuffers, programas e listeners são destruídos no cleanup;
- com `prefers-reduced-motion`, o canvas não inicializa e permanece oculto.

Assim, a imagem final acompanha a viewport, mas o custo principal da simulação permanece previsível.

## PWA e cache

O manifesto é servido em `/manifest.webmanifest`. Em produção, o service worker registra `/sw.js`, mantém o shell principal disponível e usa:

- **network first** para navegação, preservando conteúdo atualizado;
- **cache first** para chunks, fontes, estilos e imagens;
- limpeza automática de versões antigas do cache.

O site pode ser instalado pelo menu do navegador em sistemas compatíveis.

## Conteúdo e idiomas

Nenhum texto editorial deve ser inserido diretamente nos componentes. Informações visíveis ficam em `messages/`; os componentes apenas escolhem e apresentam esses dados. Esse limite mantém as três traduções sincronizadas e separa conteúdo de comportamento.

## Redes e contato

- Site: [fer.tec.br](https://fer.tec.br)
- GitHub: [github.com/ferforastieri](https://github.com/ferforastieri)
- LinkedIn: [linkedin.com/in/fernando-forastieri](https://linkedin.com/in/fernando-forastieri)
- X: [x.com/viciofer](https://x.com/viciofer)
- E-mail: [fernandoforastieri2@gmail.com](mailto:fernandoforastieri2@gmail.com)

## Ambiente

O projeto funciona sem variável local. Em previews ou domínios alternativos, a URL pública pode ser sobrescrita sem versionar segredos:

```bash
NEXT_PUBLIC_SITE_URL=https://exemplo.com
```

Arquivos `.env*` locais permanecem ignorados pelo Git. A URL padrão de produção é `https://fer.tec.br`.

## Desenvolvimento

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Validações antes do deploy:

```bash
npm run typecheck
npm run build
```

Para executar o build local:

```bash
npm start
```

## Deploy

O repositório está configurado para Next.js na Vercel. O build gera páginas estáticas e SSG dentro de `.next`; não é necessário configurar `dist` como diretório de saída.
