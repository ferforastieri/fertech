export interface Article {
    slug: string;
    title: string;
    category: string;
    description: string;
    date: string;
    readTime: string;
    content: string;
}

export const workArticles: Article[] = [
    {
        slug: "design-system-construindo-consistencia-visual",
        title: "Design System: Construindo Consistência Visual em Projetos Frontend",
        category: "UI/UX",
        description: "Explorando como criar e manter um design system eficiente que garante consistência visual e acelera o desenvolvimento. Discutindo a importância de componentes reutilizáveis e documentação adequada.",
        date: "8 de Dezembro, 2025",
        readTime: "8 min",
        content: `
# Design System: Construindo Consistência Visual em Projetos Frontend

Nos últimos anos, trabalhar em projetos frontend sem um design system bem estruturado tem se tornado cada vez mais desafiador. A medida que os projetos crescem e equipes se expandem, manter a consistência visual e de código se torna crítico.

## Por que Design Systems Importam?

Um design system não é apenas uma biblioteca de componentes. É um conjunto de padrões, princípios e ferramentas que facilitam a criação de interfaces consistentes. Quando bem implementado, ele:

- **Acelera o desenvolvimento**: Componentes reutilizáveis reduzem drasticamente o tempo de desenvolvimento
- **Garante consistência**: Todos os desenvolvedores usam os mesmos componentes e padrões
- **Facilita manutenção**: Mudanças em um componente se refletem em toda a aplicação
- **Melhora a experiência do usuário**: Interfaces mais consistentes são mais intuitivas

## Componentes Fundamentais

### 1. Tokens de Design

Os tokens são os átomos do seu design system. Eles definem cores, espaçamentos, tipografia e outros elementos básicos:

\`\`\`typescript
// tokens.ts
export const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  // ...
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  // ...
}
\`\`\`

### 2. Componentes Base

Comece com componentes simples e bem testados. Botões, inputs, cards - estes são os blocos fundamentais que você usará em toda a aplicação.

### 3. Documentação

Sem documentação adequada, mesmo o melhor design system falhará. Use ferramentas como Storybook para criar uma documentação interativa onde desenvolvedores possam ver componentes em ação.

## Melhores Práticas

1. **Comece Pequeno**: Não tente criar um design system completo de uma vez. Comece com os componentes mais usados.

2. **Documente Tudo**: Cada componente deve ter exemplos de uso, variações e casos especiais documentados.

3. **Versionamento**: Trate seu design system como uma biblioteca e use versionamento semântico.

4. **Feedback Contínuo**: Seja receptivo ao feedback da equipe. O design system deve evoluir com as necessidades do projeto.

5. **Acessibilidade**: Desde o início, considere acessibilidade. Seus componentes devem ser utilizáveis por todos.

## Conclusão

Um design system bem estruturado é um investimento que paga dividendos ao longo do tempo. Ele não apenas acelera o desenvolvimento, mas também melhora a qualidade do código e a experiência do usuário final.

O segredo está em começar simples, documentar bem e evoluir continuamente baseado no feedback real dos desenvolvedores e usuários.
        `.trim()
    },
    {
        slug: "acessibilidade-web-alem-do-codigo",
        title: "Acessibilidade Web: Além do Código",
        category: "UI/UX",
        description: "Reflexões sobre como desenvolver interfaces verdadeiramente acessíveis, considerando não apenas as diretrizes WCAG, mas também a experiência real dos usuários com diferentes necessidades.",
        date: "8 de Dezembro, 2022",
        readTime: "6 min",
        content: `
# Acessibilidade Web: Além do Código

Acessibilidade web vai muito além de apenas seguir as diretrizes WCAG. É sobre criar experiências que sejam verdadeiramente utilizáveis por todos, independentemente de suas habilidades ou limitações.

## O Que É Acessibilidade Realmente?

Acessibilidade não é apenas uma checklist. É uma mentalidade que deve ser incorporada em cada decisão de design e desenvolvimento. Quando falamos de acessibilidade, estamos falando sobre:

- **Usuários com deficiências visuais** que usam leitores de tela
- **Usuários com deficiências motoras** que navegam apenas com teclado
- **Usuários com deficiências auditivas** que precisam de alternativas para conteúdo de áudio
- **Usuários neurodivergentes** que podem ter diferentes formas de processar informação

Mas também estamos falando sobre usuários que:
- Estão em conexões lentas
- Estão usando dispositivos antigos
- Estão em ambientes com muita luz ou pouca luz
- Estão temporariamente com limitações (como uma mão engessada)

## Além das Diretrizes WCAG

As diretrizes WCAG são essenciais, mas são apenas o ponto de partida. A verdadeira acessibilidade vem da empatia e do entendimento real dos usuários.

### Teste com Usuários Reais

Não assuma que você sabe o que funciona. Teste com pessoas que realmente usam tecnologias assistivas. Você descobrirá problemas que nunca imaginaria apenas seguindo uma checklist.

### Considere o Contexto

Um formulário acessível em um ambiente calmo pode ser inutilizável em um ambiente barulhento. Um design que funciona perfeitamente em um monitor grande pode ser frustrante em um celular com tela pequena.

### Feedback e Recuperação de Erros

Mensagens de erro claras e acionáveis são fundamentais. Não basta dizer "erro". Diga o que aconteceu e como corrigir.

## Implementação Prática

### HTML Semântico

Use as tags HTML corretas. Um botão deve ser um \`<button>\`, não um \`<div>\` com JavaScript.

\`\`\`html
<!-- ❌ Ruim -->
<div onclick="submit()">Enviar</div>

<!-- ✅ Bom -->
<button type="submit">Enviar</button>
\`\`\`

### ARIA Quando Necessário

Use ARIA apenas quando o HTML semântico não é suficiente. Não adicione ARIA desnecessariamente.

### Contraste de Cores

Garanta contraste adequado, mas também forneça outras formas de diferenciar elementos (ícones, texto, bordas).

## Acessibilidade é Responsabilidade de Todos

Acessibilidade não é responsabilidade apenas do desenvolvedor ou do designer. É uma responsabilidade compartilhada:

- **Designers** devem considerar acessibilidade desde o início
- **Desenvolvedores** devem implementar código acessível
- **QA** deve testar com tecnologias assistivas
- **PMs** devem priorizar acessibilidade como feature, não como "nice to have"

## Conclusão

Acessibilidade não é algo que você adiciona depois. É algo que você constrói desde o início. E vai além do código - é sobre criar experiências que funcionem para todos, em todos os contextos.

Quando você realmente entende as necessidades dos seus usuários, acessibilidade deixa de ser uma obrigação e se torna uma oportunidade de criar produtos melhores para todos.
        `.trim()
    },
    {
        slug: "performance-react-otimizacoes-praticas",
        title: "Performance em React: Otimizações Práticas para Aplicações Reais",
        category: "Dev Frontend",
        description: "Estratégias práticas de otimização em React que realmente fazem diferença. Desde memoização até code splitting, abordando casos de uso reais e como medir o impacto.",
        date: "8 de Dezembro, 2019",
        readTime: "10 min",
        content: `
# Performance em React: Otimizações Práticas para Aplicações Reais

Performance em React é um tópico complexo, mas não precisa ser complicado. Vamos focar em otimizações que realmente fazem diferença em aplicações reais.

## Medindo Primeiro

Antes de otimizar qualquer coisa, meça. Use ferramentas como React DevTools Profiler, Lighthouse, e Chrome DevTools para identificar os verdadeiros gargalos.

### O Que Medir

- **First Contentful Paint (FCP)**: Quando o primeiro conteúdo aparece
- **Largest Contentful Paint (LCP)**: Quando o maior elemento aparece
- **Time to Interactive (TTI)**: Quando a página fica interativa
- **Re-renders desnecessários**: Componentes renderizando quando não deveriam

## Memoização Estratégica

### React.memo()

Use \`React.memo()\` para componentes que recebem props que raramente mudam:

\`\`\`typescript
const ExpensiveComponent = React.memo(({ data }: { data: Data }) => {
  // Componente caro
}, (prevProps, nextProps) => {
  // Comparação customizada se necessário
  return prevProps.data.id === nextProps.data.id;
});
\`\`\`

### useMemo() e useCallback()

Use com parcimônia. Nem sempre vale a pena:

\`\`\`typescript
// ✅ Bom: Cálculo caro que raramente muda
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// ❌ Ruim: Operação simples
const simpleValue = useMemo(() => data.map(x => x.id), [data]);

// ✅ Bom: Callback passado para componente memoizado
const handleClick = useCallback(() => {
  // ...
}, [dependency]);
\`\`\`

## Code Splitting

Divida seu código em chunks menores que são carregados sob demanda:

\`\`\`typescript
// Lazy loading de componentes
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Usando com Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
\`\`\`

### Rotas com Code Splitting

\`\`\`typescript
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

// No router
<Route path="/" element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
\`\`\`

## Virtualização para Listas Grandes

Para listas com muitos itens, use virtualização:

\`\`\`typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={10000}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>
\`\`\`

## Otimização de Imagens

1. **Lazy loading nativo**:
\`\`\`html
<img loading="lazy" src="image.jpg" alt="..." />
\`\`\`

2. **Usar formatos modernos**: WebP ou AVIF quando possível

3. **Tamanhos responsivos**: Use \`srcset\` para diferentes tamanhos de tela

## Estado Local vs Global

Nem tudo precisa estar no Redux ou Context:

\`\`\`typescript
// ✅ Estado que só um componente usa
const [localState, setLocalState] = useState();

// ✅ Estado compartilhado entre poucos componentes
// Use Context ou props drilling

// ✅ Estado global complexo
// Use Redux/Zustand
\`\`\`

## Evitando Re-renders Desnecessários

### Context Dividido

Em vez de um contexto gigante, divida em contextos menores:

\`\`\`typescript
// ❌ Ruim: Um contexto para tudo
<UserContext>
  // Tudo aqui re-renderiza quando qualquer parte do estado muda
</UserContext>

// ✅ Bom: Contextos separados
<UserDataContext>
<UserPreferencesContext>
\`\`\`

## Bundle Size

### Analise seu Bundle

\`\`\`bash
npm run build
npm run analyze
\`\`\`

### Imports Específicos

\`\`\`typescript
// ❌ Ruim: Importa toda a biblioteca
import _ from 'lodash';

// ✅ Bom: Importa apenas o que precisa
import debounce from 'lodash/debounce';
\`\`\`

## Conclusão

Performance é um equilíbrio. Não otimize prematuramente, mas também não ignore problemas reais. Meça, identifique gargalos reais e otimize estrategicamente.

Lembre-se: a melhor otimização é a que você não precisa fazer porque seu código já é eficiente desde o início.
        `.trim()
    },
    {
        slug: "typescript-avancado-tipos-escalabilidade",
        title: "TypeScript Avançado: Tipos que Ajudam na Escalabilidade",
        category: "Dev Frontend",
        description: "Como usar tipos avançados do TypeScript para criar código mais seguro e escalável. Discutindo generics, utility types e padrões que facilitam a manutenção em projetos grandes.",
        date: "8 de Dezembro, 2016",
        readTime: "12 min",
        content: `
# TypeScript Avançado: Tipos que Ajudam na Escalabilidade

TypeScript vai muito além de anotar tipos básicos. Quando usado corretamente, ele se torna uma ferramenta poderosa para criar código mais seguro e escalável.

## Generics: Flexibilidade com Segurança de Tipos

Generics permitem criar componentes e funções reutilizáveis sem perder a segurança de tipos:

\`\`\`typescript
// Função genérica simples
function identity<T>(arg: T): T {
  return arg;
}

// Interface genérica
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Classe genérica
class Cache<T> {
  private data: Map<string, T> = new Map();
  
  get(key: string): T | undefined {
    return this.data.get(key);
  }
  
  set(key: string, value: T): void {
    this.data.set(key, value);
  }
}
\`\`\`

## Utility Types: Seu Melhor Amigo

TypeScript fornece vários utility types poderosos:

### Partial<T>

Torna todas as propriedades opcionais:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Para atualização, nem todos os campos são obrigatórios
function updateUser(id: string, updates: Partial<User>): void {
  // ...
}
\`\`\`

### Pick<T, K> e Omit<T, K>

\`\`\`typescript
// Pick: Seleciona propriedades específicas
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit: Remove propriedades específicas
type UserWithoutId = Omit<User, 'id'>;
\`\`\`

### Record<K, T>

Útil para criar tipos de objetos com chaves conhecidas:

\`\`\`typescript
type Status = 'pending' | 'approved' | 'rejected';
type StatusColors = Record<Status, string>;

const colors: StatusColors = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red'
};
\`\`\`

## Conditional Types

Permitem criar tipos que dependem de condições:

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type ApiResponse<T> = T extends string 
  ? { message: T }
  : T extends number
  ? { count: T }
  : { data: T };
\`\`\`

## Template Literal Types

Crie tipos a partir de strings:

\`\`\`typescript
type EventName = \`on\${string}\`;
type Getter<T extends string> = \`get\${Capitalize<T>}\`;

// Resulta em: "getName" | "getEmail" | "getAge"
type UserGetters = Getter<'name' | 'email' | 'age'>;
\`\`\`

## Mapped Types

Transforme tipos existentes:

\`\`\`typescript
// Torna todas as propriedades readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Adiciona um prefixo às chaves
type Prefixed<T, P extends string> = {
  [K in keyof T as \`\${P}\${string & K}\`]: T[K];
};
\`\`\`

## Branded Types para Segurança Adicional

Crie tipos que não podem ser confundidos:

\`\`\`typescript
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

// Agora você não pode confundir UserId com OrderId
function getUser(id: UserId) { }
function getOrder(id: OrderId) { }
\`\`\`

## Padrões Úteis para Projetos Grandes

### Discriminated Unions

\`\`\`typescript
type SuccessResponse<T> = {
  status: 'success';
  data: T;
};

type ErrorResponse = {
  status: 'error';
  message: string;
};

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// TypeScript sabe qual tipo você tem baseado no status
function handleResponse<T>(response: ApiResponse<T>) {
  if (response.status === 'success') {
    // TypeScript sabe que response.data existe aqui
    return response.data;
  } else {
    // TypeScript sabe que response.message existe aqui
    throw new Error(response.message);
  }
}
\`\`\`

### Builder Pattern com Tipos

\`\`\`typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  
  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }
  
  execute(items: T[]): T[] {
    return items.filter(item => 
      this.filters.every(filter => filter(item))
    );
  }
}
\`\`\`

## Conclusão

TypeScript avançado não é sobre mostrar conhecimento complexo. É sobre criar código que seja mais seguro, mais fácil de manter e que capture corretamente a intenção do seu domínio.

Use esses padrões onde fazem sentido. Não complique desnecessariamente, mas também não tenha medo de usar tipos poderosos quando eles realmente ajudam.

O objetivo final é ter código que fale por si mesmo, onde os tipos documentam as expectativas e o TypeScript nos ajuda a evitar erros antes mesmo de executar o código.
        `.trim()
    },
    {
        slug: "serverless-quando-usar-evitarm",
        title: "Serverless: Quando Usar e Quando Evitar",
        category: "Servidor",
        description: "Uma análise honesta sobre arquitetura serverless, seus benefícios reais e armadilhas comuns. Quando serverless faz sentido e quando uma abordagem tradicional pode ser melhor.",
        date: "8 de Dezembro, 2013",
        readTime: "9 min",
        content: `
# Serverless: Quando Usar e Quando Evitar

Serverless tem sido apresentado como a solução para todos os problemas, mas a realidade é mais complexa. Vamos fazer uma análise honesta sobre quando serverless realmente faz sentido.

## O Que É Serverless Realmente?

Serverless não significa "sem servidor". Significa que você não gerencia servidores. O provedor faz isso por você, e você paga apenas pelo que usar.

### Modelo Tradicional vs Serverless

**Tradicional:**
- Você provisiona servidores
- Paga mesmo quando não está usando
- Responsável por escalar manualmente
- Gerencia sistema operacional, patches, etc.

**Serverless:**
- Provedor gerencia servidores
- Paga apenas por execução
- Escala automaticamente
- Zero manutenção de infraestrutura

## Quando Serverless Faz Sentido

### 1. Cargas de Trabalho Esporádicas

Se sua aplicação tem períodos de muito tráfego e períodos de pouco tráfego, serverless é perfeito:

- **APIs com tráfego variável**: Picos em horários específicos
- **Processamento de eventos**: Webhooks, notificações
- **Tarefas agendadas**: Jobs que rodam periodicamente

### 2. Prototipagem Rápida

Serverless permite colocar algo no ar rapidamente sem se preocupar com infraestrutura:

\`\`\`typescript
// Exemplo: Lambda function simples
export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World' })
  };
};
\`\`\`

### 3. Microserviços Pequenos

Funções serverless funcionam bem para microserviços que são:

- Pequenos e focados
- Independentes
- Sem estado (stateless)

## Quando Evitar Serverless

### 1. Aplicações com Estado

Se você precisa manter conexões longas ou estado compartilhado, serverless pode ser problemático:

- Conexões WebSocket persistentes
- Aplicações que dependem de estado de sessão complexo
- Processos que precisam manter estado entre execuções

### 2. Cold Starts São Inaceitáveis

Cold starts (tempo de inicialização) podem ser problemáticos:

- **Primeira execução**: Pode levar segundos
- **Depois de inatividade**: Timeout pode causar cold start novamente
- **Dependências grandes**: Aumentam o tempo de cold start

### 3. Custo de Execução Contínua

Se sua aplicação roda constantemente, serverless pode ser mais caro:

\`\`\`typescript
// Serverless: Paga por cada execução
// Se rodar 24/7, pode ser mais caro que um servidor dedicado
\`\`\`

### 4. Limitações de Tempo de Execução

Funções serverless têm limites de tempo de execução:

- AWS Lambda: máximo 15 minutos
- Outros provedores: limites similares
- Se você precisa processar algo por mais tempo, precisa de outra solução

## Armadilhas Comuns

### 1. Vendor Lock-in

Você fica preso ao provedor específico:

\`\`\`typescript
// Código específico da AWS
import { APIGatewayProxyHandler } from 'aws-lambda';
\`\`\`

**Solução**: Use frameworks como Serverless Framework ou abstrações que facilitem migração.

### 2. Debugging Mais Difícil

Debugging funções serverless pode ser desafiador:

- Logs distribuídos
- Dificuldade de reproduzir localmente
- Ferramentas de debugging limitadas

### 3. Gerenciamento de Dependências

Gerenciar dependências em funções serverless requer atenção:

- Tamanho do pacote afeta performance
- Cold starts aumentam com mais dependências
- Limites de tamanho (ex: 250MB descompactado na AWS)

## Arquitetura Híbrida

Você não precisa ser 100% serverless ou 100% tradicional. Use o melhor de ambos:

\`\`\`typescript
// Serverless para: APIs, processamento de eventos
// Tradicional para: WebSockets, processamento pesado
\`\`\`

## Conclusão

Serverless não é uma panaceia. É uma ferramenta poderosa quando usada no contexto certo. 

**Use serverless quando:**
- Tráfego é variável ou esporádico
- Quer reduzir manutenção de infraestrutura
- Precisa escalar automaticamente
- Está prototipando rapidamente

**Evite serverless quando:**
- Precisa de estado persistente
- Cold starts são inaceitáveis
- Roda constantemente (pode ser mais caro)
- Precisa de controle total da infraestrutura

A chave é entender seu caso de uso específico e escolher a arquitetura que melhor se adequa às suas necessidades, não seguir tendências cegamente.
        `.trim()
    },
    {
        slug: "monitoramento-infraestrutura-importa",
        title: "Monitoramento de Infraestrutura: O Que Realmente Importa",
        category: "Servidor",
        description: "Métricas que realmente importam ao monitorar servidores e aplicações. Discutindo como estabelecer alertas eficientes e evitar a sobrecarga de informação.",
        date: "8 de Dezembro, 2010",
        readTime: "7 min",
        content: `
# Monitoramento de Infraestrutura: O Que Realmente Importa

Monitoramento é essencial, mas muita informação pode ser pior que pouca informação. Vamos focar no que realmente importa.

## As 4 Métricas Essenciais

### 1. Latência (Tempo de Resposta)

O mais importante: quanto tempo leva para sua aplicação responder?

- **P50 (mediana)**: Experiência da maioria dos usuários
- **P95**: Usuários com pior experiência (ainda aceitável)
- **P99**: Casos extremos (pode indicar problemas)

\`\`\`typescript
// Exemplo de métrica de latência
const responseTime = Date.now() - startTime;
metrics.recordLatency('api.request', responseTime);
\`\`\`

### 2. Taxa de Erro

Quantos requests estão falhando?

- **Taxa de erro geral**: Quanto do seu tráfego está falhando
- **Erros por tipo**: Quais tipos de erro são mais comuns
- **Taxa de erro por endpoint**: Onde estão os problemas

### 3. Taxa de Tráfego

Quantos requests você está recebendo?

- **RPS (Requests Per Second)**: Volume atual
- **Tendências**: Aumento ou diminuição de tráfego
- **Picos**: Identificar padrões de uso

### 4. Saturação de Recursos

Quanto dos seus recursos está sendo usado?

- **CPU**: Não deve ficar consistentemente acima de 70-80%
- **Memória**: Preste atenção em leaks
- **Disco I/O**: Pode ser um gargalo silencioso
- **Rede**: Bandwidth disponível

## O Que Você Pode Ignorar (Por Enquanto)

### Métricas "Nice to Have"

- Métricas muito granulares que você nunca consulta
- Métricas históricas que não informam decisões
- Métricas que mudam constantemente sem padrão claro

### Comece Simples

Não tente monitorar tudo de uma vez:

1. Comece com as 4 métricas essenciais
2. Adicione métricas específicas conforme identifica problemas
3. Remova métricas que você nunca consulta

## Alertas Eficientes

### O Problema com Alertas Ruidosos

Alertas que disparam constantemente são ignorados. Isso é pior que não ter alertas.

### Quando Alertar?

**Alertar quando:**
- Usuários estão sendo impactados
- Ação imediata é necessária
- O problema não se resolve sozinho rapidamente

**Não alertar quando:**
- É um problema conhecido e transitório
- Já existe um alerta para isso
- É apenas um pico temporário esperado

### Regra dos 3 Alertas

1. **Warning**: Algo está anormal, mas não crítico
2. **Critical**: Ação necessária, usuários impactados
3. **Emergency**: Sistema completamente inoperante

## Dashboards Úteis

Um bom dashboard responde uma pergunta específica. Evite dashboards genéricos que mostram "tudo".

### Dashboard Operacional

Foco em: "O sistema está funcionando agora?"
- Latência atual
- Taxa de erro atual
- Status de serviços críticos

### Dashboard de Análise

Foco em: "Como estamos comparado com ontem/semana passada?"
- Tendências de latência
- Comparação de tráfego
- Mudanças em padrões

## Logs Estruturados

Logs estruturados são mais úteis que logs de texto livre:

\`\`\`typescript
// ❌ Ruim
console.log('Error processing user 123');

// ✅ Bom
logger.error('user.processing.failed', {
  userId: '123',
  error: error.message,
  timestamp: new Date().toISOString(),
  context: { action: 'processPayment' }
});
\`\`\`

## Correlação de Eventos

Relacione eventos para entender contexto completo:

- Uma requisição lenta pode estar relacionada a um erro no banco
- Um pico de tráfego pode explicar aumento de erros
- Uma mudança de deploy pode correlacionar com problemas

## Conclusão

Monitoramento eficiente não é sobre coletar mais dados. É sobre coletar os dados certos e usá-los para tomar decisões.

**Princípios:**
1. **Menos é mais**: Comece com poucas métricas essenciais
2. **Contexto importa**: Uma métrica isolada não conta toda a história
3. **Alertas acionáveis**: Se você não pode fazer nada, não alerte
4. **Evolua**: Adicione métricas conforme identifica necessidades reais

O objetivo é detectar problemas antes que usuários sejam impactados, não criar dashboards bonitos que ninguém consulta.
        `.trim()
    }
];

export const personalArticles: Article[] = [
    {
        slug: "filosofia-desenvolvimento-codigo-limpo-etica",
        title: "Filosofia do Desenvolvimento: Por Que Código Limpo É Uma Questão Ética",
        category: "Filosofia",
        description: "Explorando a ideia de que escrever código legível e bem estruturado não é apenas uma questão técnica, mas uma responsabilidade ética. Como nosso código afeta outros desenvolvedores e usuários finais.",
        date: "8 de Dezembro, 2025",
        readTime: "5 min",
        content: `
# Filosofia do Desenvolvimento: Por Que Código Limpo É Uma Questão Ética

Código limpo não é apenas uma questão de preferência estética ou boas práticas. É uma questão ética fundamental sobre como tratamos as pessoas que interagem com nosso código.

## O Código É Para Pessoas

A máquina não se importa se seu código é legível ou não. Ela executará igualmente bem código que é:

\`\`\`typescript
// Código funcional mas...
const x = (a,b) => a.filter(i=>b.some(j=>j.id===i.id)).map(k=>k.name);
\`\`\`

Ou código que é:

\`\`\`typescript
// Código legível
const getCommonNames = (users: User[], employees: Employee[]) => {
  const commonIds = findCommonIds(users, employees);
  return extractNames(commonIds);
};
\`\`\`

A diferença não está na funcionalidade, mas em como outros desenvolvedores (e você mesmo no futuro) vão interagir com esse código.

## O Impacto do Código Ruim

### Para Desenvolvedores

Código difícil de entender:
- **Aumenta o tempo de onboarding**: Novos desenvolvedores levam mais tempo para se tornarem produtivos
- **Cria frustração**: Ninguém quer trabalhar com código confuso
- **Aumenta bugs**: Código confuso é mais propenso a erros
- **Retarda desenvolvimento**: Mais tempo para entender, menos tempo para criar

### Para Usuários Finais

Código mal estruturado frequentemente resulta em:
- **Bugs mais frequentes**: Código confuso é mais difícil de debugar e corrigir
- **Recursos mais lentos**: Código desorganizado dificulta otimizações
- **Features mais lentas**: Desenvolver em cima de código ruim é mais lento

## Ética do Desenvolvimento

### Responsabilidade com o Futuro

Quando você escreve código, você está criando algo que outras pessoas vão trabalhar. Isso é uma responsabilidade:

- Outros desenvolvedores vão depender do seu código
- Você mesmo vai voltar a esse código no futuro
- Manutenção vai ser necessária, e código ruim dificulta isso

### Acesso e Inclusão

Código legível é mais acessível:
- Desenvolvedores júnior podem contribuir mais facilmente
- Pessoas aprendendo podem entender melhor
- Times diversos podem colaborar melhor

## O Que Torna Código "Ético"?

### 1. Legibilidade

Código deve ser fácil de ler e entender:

\`\`\`typescript
// Bom: Intenção clara
function calculateTotalPrice(items: Item[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * TAX_RATE;
  return subtotal + tax;
}
\`\`\`

### 2. Manutenibilidade

Código deve ser fácil de modificar sem quebrar outras partes:

- Baixo acoplamento
- Alta coesão
- Responsabilidades claras

### 3. Testabilidade

Código deve ser testável, o que geralmente resulta em melhor design:

- Funções pequenas e focadas
- Dependências explícitas
- Lógica separada de efeitos colaterais

### 4. Documentação Quando Necessária

Não é sobre comentários em toda linha, mas sobre:
- Explicar o "porquê" quando não é óbvio
- Documentar APIs públicas
- Explicar decisões complexas

## O Dilema do Tempo

"Mas eu não tenho tempo para escrever código limpo!"

Esta é uma falsa dicotomia. Código limpo:
- É mais rápido de desenvolver a longo prazo
- É mais rápido de debugar
- É mais rápido de modificar
- Reduz tempo gasto em code review

## Conclusão

Escrever código limpo não é sobre seguir regras arbitrárias. É sobre reconhecer que nosso código afeta outras pessoas e tomar responsabilidade por isso.

É uma questão ética porque:
- Afeta a qualidade de vida de outros desenvolvedores
- Impacta usuários finais através de bugs e features lentas
- Influencia quem pode participar do desenvolvimento

Código é comunicação. Comunique com clareza, respeito e consideração pelas pessoas que vão ler, manter e depender do seu código.

No final, código limpo não é apenas sobre escrever código melhor. É sobre ser um desenvolvedor melhor - alguém que pensa nas pessoas além da máquina.
        `.trim()
    },
    {
        slug: "aprendizado-continuo-humildade",
        title: "Aprendizado Contínuo: Aceitar que Não Sabemos Tudo",
        category: "Filosofia",
        description: "Reflexões sobre a importância de manter a humildade no aprendizado constante. Como aceitar que não sabemos tudo é o primeiro passo para realmente aprender algo novo.",
        date: "8 de Dezembro, 2022",
        readTime: "4 min",
        content: `
# Aprendizado Contínuo: Aceitar que Não Sabemos Tudo

Em uma indústria que muda constantemente, a única constante é a necessidade de aprender. Mas aprender efetivamente requer uma dose saudável de humildade.

## A Armadilha do "Já Sei"

Uma das maiores barreiras para aprender é achar que já sabemos. Quando assumimos que sabemos algo, fechamos nossa mente para novas possibilidades:

\`\`\`typescript
// "Eu sei fazer loops"
for (let i = 0; i < items.length; i++) {
  // ...
}

// Mas talvez exista uma forma melhor que você ainda não conhece
items.forEach(item => {
  // ...
});

// Ou talvez
for (const item of items) {
  // ...
}
\`\`\`

## A Ilusão da Competência

Quanto mais aprendemos sobre um tópico, mais percebemos o quanto não sabemos. Isso não é desencorajador - é libertador:

- **Iniciante**: Não sabe o quanto não sabe
- **Intermediário**: Sabe que não sabe tudo
- **Avançado**: Sabe exatamente o quanto não sabe

Estar no estágio intermediário ou avançado significa que você tem consciência do que ainda precisa aprender.

## A Humildade Tecnológica

### "Não sei, mas vou descobrir"

Esta frase é poderosa. Em vez de:

- "Isso não funciona assim" (sem ter certeza)
- "Eu nunca vi isso" (assumindo que não existe)

Experimente:

- "Não tenho certeza, deixe-me verificar"
- "Não conheço isso, mas vou aprender"
- "Pode estar certo, vou pesquisar"

### Admitir Erros

Errar é humano. Admitir erros é sábio:

- Mostra maturidade
- Aprende com a situação
- Constrói confiança através da honestidade
- Permite que outros ajudem

## Aprendendo com Outros

### Code Review como Oportunidade

Code reviews não são apenas sobre encontrar bugs. São sobre aprender:

- Como outros pensam
- Padrões que você não conhecia
- Melhores práticas da linguagem
- Formas diferentes de resolver problemas

### Perguntar Sem Vergonha

Não há perguntas "estúpidas". Há apenas:
- Perguntas que ainda não foram feitas
- Dúvidas que outros também têm
- Oportunidades de aprender

## A Curiosidade como Motor

Mantenha a curiosidade viva:

### Explore Além do Necessário

- Leia documentação mesmo quando não precisa
- Experimente features novas da linguagem
- Teste ferramentas diferentes
- Explore código de projetos open source

### Desafie Suas Presunções

\`\`\`typescript
// Você sempre faz assim?
function processData(data) {
  // ...
}

// Mas e se tentasse assim?
const processData = (data) => {
  // ...
};

// Qual é melhor? Por quê? Quando usar cada um?
\`\`\`

## O Aprendizado É Um Processo, Não Um Destino

### Não Existe "Finalização"

Você nunca vai "acabar" de aprender. E isso é bom:
- Mantém a carreira interessante
- Previne estagnação
- Permite crescimento contínuo

### Aprender É Circular, Não Linear

Você pode voltar a tópicos "básicos" e aprender coisas novas:
- Uma nova perspectiva
- Detalhes que passou despercebido antes
- Conexões com outros conhecimentos

## Conclusão

Aceitar que não sabemos tudo não é fraqueza - é força. É a base do aprendizado genuíno.

**Princípios para aprendizado contínuo:**
1. **Seja humilde**: Reconheça o que você não sabe
2. **Seja curioso**: Explore além do necessário
3. **Seja aberto**: Aprenda com qualquer pessoa
4. **Seja paciente**: Aprendizado leva tempo
5. **Seja persistente**: Continue mesmo quando é difícil

A indústria de tecnologia muda rápido. Mas se você mantém a humildade e a curiosidade, essas mudanças são oportunidades, não ameaças.

Lembre-se: o melhor desenvolvedor não é aquele que sabe tudo, mas aquele que sabe que não sabe tudo e está sempre disposto a aprender.
        `.trim()
    },
    {
        slug: "games-ferramenta-aprendizado-jornada",
        title: "Games Como Ferramenta de Aprendizado: Minha Jornada",
        category: "Jogos",
        description: "Como os jogos me ensinaram sobre resolução de problemas, trabalho em equipe e persistência. Uma reflexão pessoal sobre como minha paixão por games influenciou minha carreira em desenvolvimento.",
        date: "8 de Dezembro, 2019",
        readTime: "6 min",
        content: `
# Games Como Ferramenta de Aprendizado: Minha Jornada

Jogos sempre foram parte da minha vida, mas só recentemente percebi o quanto eles me ensinaram sobre desenvolvimento de software e resolução de problemas.

## Os Primeiros Passos

Minha jornada com programação começou, curiosamente, através de jogos. Quando criança, eu queria modificar meus jogos favoritos - mudar valores, criar níveis customizados, entender como funcionavam por dentro.

Isso me levou a:
- Explorar arquivos de configuração
- Aprender sobre estruturas de dados básicas
- Entender lógica através de sistemas de jogo
- Desenvolver curiosidade sobre como as coisas funcionam

## Resolução de Problemas: A Essência dos Games

Jogos são essencialmente sequências de problemas a resolver:

### Quebra-Cabeças

Muitos jogos são quebra-cabeças complexos:
- Você tem um objetivo
- Você tem ferramentas limitadas
- Você precisa descobrir a combinação certa

Isso é exatamente programação:
\`\`\`typescript
// Objetivo: Filtrar usuários ativos com idade acima de 18
// Ferramentas: Arrays, métodos de array
// Solução:
const activeAdults = users
  .filter(user => user.active && user.age >= 18);
\`\`\`

### Iteração e Melhoria

Em jogos, você tenta, falha, aprende, tenta novamente. Isso ensinou:
- **Não ter medo de tentar**: Experimentar é parte do processo
- **Aprender com falhas**: Cada tentativa ensina algo
- **Iterar rapidamente**: Tentar muitas abordagens rapidamente

## Trabalho em Equipe: Jogos Multijogador

Jogos online me ensinaram muito sobre colaboração:

### Comunicação Eficiente

Em raids ou partidas competitivas, você aprende:
- Comunicação clara e concisa
- Feedback imediato
- Adaptação rápida a mudanças

Habilidades que transferem diretamente para:
- Code reviews
- Stand-ups
- Comunicação com stakeholders

### Roles e Responsabilidades

Cada jogador tem um papel:
- Tank: Protege o time
- DPS: Faz dano
- Support: Suporta o time

Em desenvolvimento:
- Frontend: Interface do usuário
- Backend: Lógica de negócio
- DevOps: Infraestrutura

Todos são importantes, todos dependem uns dos outros.

## Persistência: Não Desistir

### Bosses Difíceis

Qualquer jogador conhece a frustração de um boss difícil. Mas também conhece a satisfação de finalmente vencer após dezenas de tentativas.

Isso ensina:
- **Persistência**: Não desistir quando algo é difícil
- **Análise**: Entender por que está falhando
- **Adaptação**: Mudar estratégia quando necessário

### Debugging É Igual a Boss Battle

Debugging código complexo é como enfrentar um boss:
1. Você tenta (executa o código)
2. Falha (bug aparece)
3. Analisa (olha logs, stack traces)
4. Adapta (muda abordagem)
5. Tenta novamente
6. Eventualmente vence (bug corrigido)

## Criatividade e Experimentação

Jogos sandbox como Minecraft ou Factorio ensinam:
- Criatividade na resolução de problemas
- Planejamento de sistemas complexos
- Otimização de processos

Isso se traduz em:
- Arquitetura de software
- Otimização de código
- Criação de sistemas escaláveis

## Gamificação no Desenvolvimento

Os próprios princípios de games podem melhorar desenvolvimento:

### Progresso Visível

- Quebrar tarefas grandes em pequenas conquistas
- Visualizar progresso através de métricas
- Celebrar pequenas vitórias

### Feedback Imediato

- Testes automatizados dão feedback rápido
- Code reviews são feedback instantâneo
- CI/CD mostra resultados imediatamente

## O Outro Lado: Quando Games Ajudam Demais

Há um lado positivo também - games me ensinaram a:
- **Balancear vida pessoal e trabalho**: Games ensinam sobre moderação
- **Relaxar e recarregar**: Descanso é importante para produtividade
- **Socializar**: Games podem ser atividade social

## Conclusão

Games não foram apenas entretenimento na minha vida. Foram professores que me ensinaram:
- Resolução de problemas
- Trabalho em equipe
- Persistência
- Criatividade
- Balanceamento

Essas habilidades se transferem diretamente para desenvolvimento de software. E o melhor: aprendi tudo isso enquanto me divertia.

Não subestime o valor educacional dos jogos. Eles desenvolvem habilidades que são difíceis de ensinar em um ambiente tradicional, mas essenciais para ser um desenvolvedor efetivo.

Se você também é um gamer, reflita sobre o que os jogos te ensinaram. Você pode se surpreender com a quantidade de habilidades transferíveis que adquiriu sem nem perceber.

E se você não joga, considere tentar. Não apenas pelos benefícios mencionados, mas porque diversão e aprendizado podem andar juntos - e isso torna ambos mais efetivos.
        `.trim()
    },
    {
        slug: "design-jogos-ux-licoes-game-design",
        title: "Design de Jogos e UX: Aplicando Lições Aprendidas em Game Design",
        category: "Jogos",
        description: "Explorando como os princípios de game design podem melhorar a experiência do usuário em aplicações web. O que podemos aprender sobre feedback, progressão e engajamento dos jogos.",
        date: "8 de Dezembro, 2016",
        readTime: "8 min",
        content: `
# Design de Jogos e UX: Aplicando Lições Aprendidas em Game Design

Game design e UX design têm mais em comum do que parece. Vamos explorar como os princípios que tornam jogos envolventes também podem tornar aplicações web mais agradáveis.

## Feedback Imediato

Jogos são mestres em feedback imediato. Cada ação tem uma resposta clara:
- Um som
- Uma animação
- Uma mudança visual

### Aplicando em UX Web

\`\`\`typescript
// Feedback visual em ações
function handleSubmit() {
  setIsLoading(true);
  // Feedback imediato: usuário sabe que algo está acontecendo
  
  submitForm()
    .then(() => {
      showSuccessMessage(); // Feedback positivo
    })
    .catch(() => {
      showErrorMessage(); // Feedback negativo
    })
    .finally(() => {
      setIsLoading(false);
    });
}
\`\`\`

### Tipos de Feedback

**Visual:**
- Animações suaves
- Mudanças de cor
- Indicadores de progresso

**Háptico:**
- Vibração (em mobile)
- Feedback tátil

**Auditivo:**
- Sons de confirmação (usado com parcimônia)

## Progressão e Motivação

Jogos mantêm jogadores engajados através de progressão clara:
- Níveis
- Conquistas
- Recompensas
- Histórico de progresso

### Aplicando em Aplicações Web

**Progresso em Formulários:**
\`\`\`typescript
// Mostrar progresso em formulários longos
const progress = (completedSteps / totalSteps) * 100;
<ProgressBar value={progress} />
\`\`\`

**Conquistas em Produtividade:**
- Mostrar tarefas completadas
- Celebrar marcos (ex: "Você completou 10 tarefas!")
- Histórico de atividade

**Níveis de Usuário:**
- Sistema de badges ou níveis
- Desbloqueio de features
- Status visual

## Microinterações

Jogos são cheios de microinterações que tornam a experiência mais prazerosa:

### Exemplos em Jogos

- Animação ao coletar um item
- Efeito visual ao acertar um alvo
- Transição suave entre telas

### Aplicando em Web

\`\`\`typescript
// Microinteração: hover em botão
.button {
  transition: transform 0.2s;
}

.button:hover {
  transform: scale(1.05);
}

// Microinteração: clique
.button:active {
  transform: scale(0.95);
}
\`\`\`

## Onboarding Progressivo

Jogos não jogam o tutorial completo de uma vez. Eles introduzem conceitos gradualmente:
- Nível 1: Ensina movimento
- Nível 2: Ensina ataque
- Nível 3: Combina os dois

### Aplicando em Aplicações

**Tutorial Progressivo:**
1. Primeira visita: Mostrar funcionalidades básicas
2. Após uso básico: Introduzir features avançadas
3. Conforme necessário: Dicas contextuais

**Não Sobrecarregue:**
- Introduza uma coisa por vez
- Deixe usuário experimentar antes de mostrar próxima feature
- Permita pular tutorial

## Desafio Apropriado

Jogos mantêm desafio balanceado:
- Muito fácil = entediante
- Muito difícil = frustrante
- Balanceado = envolvente

### Aplicando em UX

**Dificuldade de Tarefas:**
- Tarefas comuns devem ser fáceis e rápidas
- Tarefas complexas podem ter mais passos, mas devem ser claras

**Suporte Quando Necessário:**
- Help tooltips para features novas
- Documentação acessível
- Exemplos e templates

## Narrativa e Contexto

Jogos contam histórias. Mesmo jogos simples têm uma narrativa básica.

### Aplicando em Aplicações

**Narrativa de Usuário:**
- "Bem-vindo! Vamos começar..."
- "Parabéns! Você completou seu primeiro projeto"
- "Você está progredindo bem!"

**Contexto Visual:**
- Ilustrações que contam uma história
- Animações que mostram causa e efeito
- Fluxos que fazem sentido narrativo

## Economia e Recursos

Jogos têm economia clara:
- Você sabe quantos recursos tem
- Você sabe quanto algo custa
- Você vê quando ganha ou perde recursos

### Aplicando em Aplicações

**Feedback de Ações:**
- Mostrar custo antes de ação destrutiva
- Confirmar quando ação consome recursos
- Mostrar saldo ou status claramente

## Antecipação e Suspense

Jogos criam antecipação:
- Contagem regressiva antes de ação
- Animação antes de resultado
- Construção de tensão

### Aplicando (Com Cuidado)

**Loading States:**
\`\`\`typescript
// Em vez de tela branca
<SkeletonLoader /> // Mostra estrutura esperada

// Progresso claro
<ProgressBar value={progress} label="Processando..." />
\`\`\`

## Conclusão

Game design e UX design compartilham muitos princípios fundamentais. Ambos buscam criar experiências que sejam:
- Envolventes
- Intuitivas
- Gratificantes
- Memoráveis

**Princípios para aplicar:**
1. **Feedback imediato**: Toda ação deve ter resposta clara
2. **Progressão visível**: Mostre progresso e conquistas
3. **Microinterações**: Pequenos detalhes fazem grande diferença
4. **Onboarding gradual**: Não sobrecarregue com informação
5. **Desafio balanceado**: Faça tarefas apropriadas para o contexto
6. **Narrativa**: Conte uma história com sua interface
7. **Economia clara**: Mostre recursos e custos

Aplicar princípios de game design não significa tornar tudo um jogo. Significa tornar a experiência mais agradável, intuitiva e envolvente.

No final, tanto games quanto aplicações web querem a mesma coisa: que usuários queiram voltar e continuar usando. Os princípios são os mesmos - apenas o contexto muda.
        `.trim()
    }
];

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export const allArticles = [...workArticles, ...personalArticles];

