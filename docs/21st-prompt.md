# Prompt de direção visual

Prompt preparado a partir do padrão de componentes copiáveis do 21st.dev e adaptado ao conteúdo real do portfólio:

> Build a production-ready, responsive React hero for a senior software engineer portfolio. The single memorable object is a physical field notebook centered in the viewport. On entry, its cobalt cover opens from right to left; navigation tabs turn the right-hand page between Projects, Field Notes, Trajectory, and Contact. Use DOM and CSS 3D transforms only, animated with Anime.js v4 timelines and scoped cleanup — no Three.js, canvas, generic gradient blobs, glass cards, or decorative dashboards. Art direction: cold blue-grey drafting table, off-white ruled paper, ultramarine technical ink, one vermilion handwritten annotation color, narrow grotesk headings paired with an italic editorial serif. Keep UI chrome quiet so the notebook owns the scene. Preserve semantic links and server-rendered content, keyboard focus, mobile layout, and `prefers-reduced-motion`. The motion should feel like paper mechanics: cover hinge, page turn, slight stagger of ink, never random floating effects.

## Decisões aplicadas

- O caderno é HTML semântico e CSS, portanto continua legível sem WebGL.
- A capa abre uma vez; as páginas viram apenas quando o usuário muda de seção.
- No celular, uma página ocupa a tela e o índice vira uma barra de abas.
- A paleta e a tipografia vêm do vocabulário de cadernos técnicos, não de um template genérico.
