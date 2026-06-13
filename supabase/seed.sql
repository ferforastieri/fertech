insert into public.home_content (
  id,
  hero_eyebrow,
  hero_headline,
  hero_description,
  projects_button_label,
  resume_button_label,
  contact_button_label,
  stack_groups,
  classic_about_title,
  classic_highlights_title,
  classic_capabilities_title,
  language_note,
  aurora_about_eyebrow,
  aurora_about_title,
  projects_eyebrow,
  projects_title,
  projects_link_label,
  projects_total_label,
  blog_eyebrow,
  blog_title,
  contact_title,
  contact_description
)
values (
  'main',
  'Desenvolvedor Fullstack | Design Systems, Infra & UX',
  'Arquitetura, infra e UX.',
  'Sou fullstack, com foco em design systems, patterns e infra. Sou apaixonado por frontend e UX porque IA acelera muito a execução, mas arquitetura, tato humano e experiência intuitiva ainda precisam de intenção.',
  'Ver projetos',
  'Currículo',
  'Entre em contato',
  '[
    {"title":"Interface","items":["React","Next.js","TypeScript","JavaScript","Tailwind CSS"]},
    {"title":"Backend","items":["Node.js","NestJS","PostgreSQL","MongoDB"]},
    {"title":"Infra","items":["Docker","AWS"]},
    {"title":"Soft skills","items":["Design systems","Patterns","Arquitetura","UX intuitiva"]}
  ]'::jsonb,
  'Sobre Mim',
  'O Que Me Diferencia',
  'Capacidades Técnicas',
  'Possuo inglês avançado com capacidade de escrita e fala.',
  'Sobre',
  'Leveza também é arquitetura.',
  'Projetos',
  'Projetos e entregas.',
  'Explorar tudo',
  'Projetos mapeados no total',
  'Blog',
  'Ideias em movimento.',
  'Vamos Conversar?',
  'Quer trabalhar junto ou tem alguma dúvida? Me envie uma mensagem.'
)
on conflict (id) do update set
  hero_eyebrow = excluded.hero_eyebrow,
  hero_headline = excluded.hero_headline,
  hero_description = excluded.hero_description,
  projects_button_label = excluded.projects_button_label,
  resume_button_label = excluded.resume_button_label,
  contact_button_label = excluded.contact_button_label,
  stack_groups = excluded.stack_groups,
  classic_about_title = excluded.classic_about_title,
  classic_highlights_title = excluded.classic_highlights_title,
  classic_capabilities_title = excluded.classic_capabilities_title,
  language_note = excluded.language_note,
  aurora_about_eyebrow = excluded.aurora_about_eyebrow,
  aurora_about_title = excluded.aurora_about_title,
  projects_eyebrow = excluded.projects_eyebrow,
  projects_title = excluded.projects_title,
  projects_link_label = excluded.projects_link_label,
  projects_total_label = excluded.projects_total_label,
  blog_eyebrow = excluded.blog_eyebrow,
  blog_title = excluded.blog_title,
  contact_title = excluded.contact_title,
  contact_description = excluded.contact_description,
  updated_at = now();

insert into public.resume_settings (
  id,
  about_paragraphs,
  languages,
  sections,
  location,
  download_label,
  generating_label,
  pdf_filename,
  project_technologies_label
)
values (
  'main',
  array[
    'Desenvolvedor fullstack com foco em design systems, arquitetura, infraestrutura e experiência do usuário.',
    'Combino execução técnica com senso de produto para criar soluções claras, escaláveis e intuitivas.'
  ],
  '[
    {"name":"Português","description":"Nativo"},
    {"name":"Inglês","description":"Inglês técnico - Capacidade de escrita e leitura de documentações técnicas"}
  ]'::jsonb,
  '[
    {"key":"about","title":"Sobre","enabled":true},
    {"key":"education","title":"Educação","enabled":true},
    {"key":"experience","title":"Experiência Profissional","enabled":true},
    {"key":"skills","title":"Habilidades Técnicas","enabled":true},
    {"key":"languages","title":"Idiomas","enabled":true},
    {"key":"projects","title":"Projetos Relevantes","enabled":true}
  ]'::jsonb,
  'Sorocaba, SP - Brasil',
  'Baixar PDF',
  'Gerando PDF...',
  'CV_Fernando_Forastieri.pdf',
  'Tecnologias'
)
on conflict (id) do update set
  about_paragraphs = excluded.about_paragraphs,
  languages = excluded.languages,
  sections = excluded.sections,
  location = excluded.location,
  download_label = excluded.download_label,
  generating_label = excluded.generating_label,
  pdf_filename = excluded.pdf_filename,
  project_technologies_label = excluded.project_technologies_label,
  updated_at = now();
