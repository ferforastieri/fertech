update public.site_content
set content = jsonb_set(
  jsonb_set(content, '{common,homeLoading}', '"Inicializando experiência"', true),
  '{common,closeNavigation}',
  '"Fechar navegação"',
  true
)
where id = 'main';
