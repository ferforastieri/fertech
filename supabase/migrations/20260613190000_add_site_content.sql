create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
on public.site_content for select to anon, authenticated
using (true);

drop policy if exists "Authenticated write site content" on public.site_content;
create policy "Authenticated write site content"
on public.site_content for all to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_content (id, content)
values (
  'main',
  $json$
  {
    "navigation": {
      "home": "Início",
      "blog": "Blog",
      "projects": "Projetos",
      "resume": "Currículo",
      "playground": "Playground",
      "switchToAurora": "Trocar para modo imersivo",
      "switchToClassic": "Trocar para modo tradicional",
      "socialLinks": "Redes sociais",
      "playgroundDialogTitle": "Abrir Playground WebGL?",
      "playgroundDialogDescription": "O playground faz parte da experiência Aurora. Você será levado ao modo imersivo para desenhar, combinar cores e controlar animações WebGL.",
      "cancel": "Cancelar",
      "goToAurora": "Ir para o Aurora"
    },
    "gateway": {
      "kicker": "Escolha como quer navegar",
      "titleLine1": "Escolha como",
      "titleLine2": "explorar.",
      "descriptionTemplate": "Este é meu portfólio pessoal e profissional. Se nenhuma opção for escolhida, a experiência imersiva começará em {seconds} segundos.",
      "redirectSeconds": 5,
      "modes": [
        {
          "id": "classic",
          "name": "Tradicional",
          "audience": "Recomendado para recrutadores",
          "description": "Leitura objetiva, visual familiar e navegação direta para conhecer minha experiência, projetos e currículo.",
          "href": "/classic"
        },
        {
          "id": "aurora",
          "name": "Modo Imersivo",
          "audience": "Recomendado para quem quer explorar",
          "description": "Uma experiência criativa e pessoal com WebGL, movimento, profundidade e navegação cinematográfica.",
          "href": "/aurora"
        }
      ]
    },
    "common": {
      "readTimeSuffix": "de leitura",
      "articlesCountLabel": "artigos",
      "projectsCountLabel": "projetos",
      "viewProject": "Ver projeto",
      "viewSite": "Ver site",
      "loadingPage": "Preparando página",
      "homeLoading": "Inicializando experiência",
      "contentLoadError": "Não foi possível carregar o conteúdo.",
      "closeNavigation": "Fechar navegação"
    },
    "blog": {
      "title": "Blog",
      "description": "Artigos sobre desenvolvimento, tecnologia e reflexões pessoais.",
      "auroraEyebrow": "Artigos e ideias",
      "workTitle": "Artigos Profissionais",
      "personalTitle": "Artigos Pessoais",
      "loading": "Sincronizando artigos",
      "error": "Não foi possível carregar os artigos.",
      "notFoundTitle": "Artigo não encontrado",
      "backToBlog": "Voltar para Blog",
      "backToArticles": "Voltar para artigos"
    },
    "projects": {
      "title": "Meus Projetos",
      "description": "Uma seleção dos produtos, empresas e projetos em que trabalhei e contribuí ao longo dos anos.",
      "auroraEyebrow": "Portfólio técnico",
      "loading": "Carregando projetos",
      "error": "Não foi possível carregar os projetos.",
      "notFound": "Projeto não encontrado.",
      "backToProjects": "Voltar para projetos"
    },
    "resume": {
      "loading": "Montando currículo",
      "error": "Não foi possível carregar o currículo.",
      "logoAlt": "Logo do currículo",
      "pdfSuccess": "Currículo gerado com sucesso.",
      "pdfError": "Não foi possível gerar o currículo."
    },
    "playground": {
      "eyebrow": "Laboratório WebGL",
      "title": "Playground",
      "description": "Experimentos interativos com partículas, geometria, luz e movimento em tempo real.",
      "colors": ["#ff315f", "#ff8a00", "#ffe600", "#32f5a5", "#22d3ee", "#7c5cff", "#ff4fd8"],
      "modes": [
        {"id": "orbit", "label": "Órbita"},
        {"id": "wave", "label": "Ondas"},
        {"id": "chaos", "label": "Caos"}
      ],
      "controlsTitle": "Controles",
      "pause": "Pausar animação",
      "resume": "Continuar animação",
      "randomize": "Criar combinação aleatória",
      "clear": "Limpar desenho",
      "brush": "Pincel",
      "elements": "Elementos",
      "speed": "Velocidade",
      "drawingEnabled": "Desenho ativado",
      "enableDrawing": "Ativar desenho",
      "experiments": [
        {"eyebrow": "Experimento 01", "title": "Campo de partículas", "description": "Desenhe sobre a cena e altere órbita, densidade, cor e velocidade."},
        {"eyebrow": "Experimento 02", "title": "Escultura de sinal", "description": "Uma forma orgânica que distorce, flutua e reage à iluminação."},
        {"eyebrow": "Experimento 03", "title": "Pulso modular", "description": "Uma superfície de módulos propagando ondas em ciclos contínuos."},
        {"eyebrow": "Experimento 04", "title": "Arquitetura em movimento", "description": "Abra as pastas para explorar responsabilidades e tecnologias. Selecione um pattern para visualizar como as partes se conectam."}
      ],
      "architecture": {
        "treeTitle": "Estrutura de pastas",
        "rootLabel": "architecture/",
        "patternsTitle": "Design patterns",
        "footer": "Pastas organizam responsabilidades; patterns organizam a comunicação entre elas.",
        "tree": [
          {
            "name": "apps",
            "description": "Aplicações que entregam as experiências do produto.",
            "technologies": ["React", "React Native", "TypeScript"],
            "children": [
              {
                "name": "web",
                "description": "Interface web, rotas, estados de tela e composição visual.",
                "technologies": ["React", "Vite", "React Query"],
                "children": [
                  {"name": "pages", "description": "Páginas e fluxos de navegação."},
                  {"name": "components", "description": "Componentes reutilizáveis da interface."},
                  {"name": "features", "description": "Regras de apresentação organizadas por domínio."}
                ]
              },
              {
                "name": "mobile",
                "description": "Aplicativo móvel com navegação, cache e recursos nativos.",
                "technologies": ["Expo", "React Native", "SQLite"],
                "children": [
                  {"name": "screens", "description": "Experiências e jornadas do aplicativo."},
                  {"name": "services", "description": "Integrações nativas, sincronização e notificações."}
                ]
              },
              {
                "name": "api",
                "description": "Entrada HTTP, autenticação e orquestração dos casos de uso.",
                "technologies": ["NestJS", "FastAPI", "OpenAPI"],
                "children": [
                  {"name": "controllers", "description": "Contratos HTTP e validação de entrada."},
                  {"name": "use-cases", "description": "Casos de uso independentes da infraestrutura."},
                  {"name": "adapters", "description": "Integrações com bancos, filas e serviços externos."}
                ]
              }
            ]
          },
          {
            "name": "packages",
            "description": "Contratos e capacidades compartilhadas entre aplicações.",
            "technologies": ["Zod", "TypeScript", "Design System"],
            "children": [
              {"name": "domain", "description": "Entidades, regras e eventos de domínio."},
              {"name": "shared", "description": "Tipos, esquemas e utilitários compartilhados."},
              {"name": "ui", "description": "Tokens, componentes e padrões visuais."}
            ]
          },
          {
            "name": "infrastructure",
            "description": "Execução, persistência, observabilidade e entrega contínua.",
            "technologies": ["PostgreSQL", "Redis", "Docker", "Terraform"],
            "children": [
              {"name": "database", "description": "Migrações, repositórios e modelos de persistência."},
              {"name": "messaging", "description": "Filas, eventos e tarefas assíncronas."},
              {"name": "cloud", "description": "Infraestrutura declarativa e ambientes."}
            ]
          }
        ],
        "patterns": [
          {
            "id": "clean",
            "name": "Clean Architecture",
            "category": "Estrutural",
            "description": "Mantém regras de negócio isoladas de frameworks, banco de dados e interfaces.",
            "flow": ["Interface", "Caso de uso", "Domínio", "Adaptador"],
            "technologies": ["Dependency Injection", "Ports & Adapters", "SOLID"]
          },
          {
            "id": "cqrs",
            "name": "CQRS",
            "category": "Dados",
            "description": "Separa comandos e consultas quando os fluxos possuem necessidades diferentes.",
            "flow": ["Command", "Handler", "Event", "Read model"],
            "technologies": ["Event Bus", "Projections", "Cache"]
          },
          {
            "id": "repository",
            "name": "Repository",
            "category": "Persistência",
            "description": "Cria um contrato estável entre o domínio e a tecnologia de armazenamento.",
            "flow": ["Use case", "Interface", "Repository", "Database"],
            "technologies": ["PostgreSQL", "Prisma", "TypeORM"]
          },
          {
            "id": "strategy",
            "name": "Strategy",
            "category": "Comportamental",
            "description": "Permite trocar algoritmos e integrações sem alterar o fluxo que os consome.",
            "flow": ["Context", "Contract", "Strategy A", "Strategy B"],
            "technologies": ["Interfaces", "Composition", "Runtime config"]
          }
        ]
      }
    },
    "architecture": {
      "eyebrow": "Arquiteturas reais",
      "title": "Como este sistema foi construído.",
      "description": "Uma leitura visual das camadas, tecnologias e organização do sistema.",
      "flowLabel": "Fluxo vivo entre camadas",
      "layerTitles": ["Experiências", "Serviços", "Dados & Infra"],
      "foldersTitle": "Organização do código"
    }
  }
  $json$::jsonb
)
on conflict (id) do nothing;
