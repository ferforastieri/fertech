alter table public.profile add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.home_content add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.site_content add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.project_groups add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.projects add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.articles add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.resume_settings add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.resume_experiences add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.resume_roles add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.resume_education add column if not exists translations jsonb not null default '{}'::jsonb;

update public.profile
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'name', name,
    'role', 'Fullstack | Design Systems, Infra & UX',
    'intro', 'I build digital products end to end, with clear architecture, a consistent visual foundation and intuitive UX.',
    'technologies', to_jsonb(technologies),
    'aboutParagraphs', jsonb_build_array(
      '"It is very easy to work with you" - that is the reaction I consistently receive. I value a light, clear and collaborative environment before any goal, task or skill.',
      'I am a fullstack developer focused on design systems, infrastructure and digital product architecture.',
      'I like frontend and UX because that is where architecture becomes experience. AI accelerates delivery, but human touch still defines clarity, flow and consistency.',
      'I am also passionate about games, a direct influence on my interest in programming and interfaces with good feedback.'
    ),
    'highlights', jsonb_build_array(
      jsonb_build_object('icon', 'code', 'title', 'Fullstack Development', 'description', 'End-to-end experience connecting frontend, backend, design systems and infrastructure.'),
      jsonb_build_object('icon', 'rocket', 'title', 'Architecture With Human Touch', 'description', 'I use technology and AI as accelerators, while valuing human decisions around architecture, flow and experience.'),
      jsonb_build_object('icon', 'sparkles', 'title', 'Design Systems and UX', 'description', 'I like creating consistent visual foundations, intuitive interfaces and products that are easy to evolve.')
    )
  ),
  'es', jsonb_build_object(
    'name', name,
    'role', 'Fullstack | Design Systems, Infra & UX',
    'intro', 'Creo productos digitales de punta a punta, con arquitectura clara, base visual consistente y UX intuitiva.',
    'technologies', to_jsonb(technologies),
    'aboutParagraphs', jsonb_build_array(
      '"Es muy fácil trabajar contigo" - esa es la reacción que siempre recibo. Valoro un ambiente ligero, claro y colaborativo antes de cualquier meta, tarea o habilidad.',
      'Soy desarrollador fullstack con foco en design systems, infraestructura y arquitectura de productos digitales.',
      'Me gusta frontend y UX porque es donde la arquitectura se convierte en experiencia. La IA acelera la entrega, pero el tacto humano todavía define claridad, flujo y consistencia.',
      'También soy apasionado por los juegos, una influencia directa en mi interés por programación e interfaces con buen feedback.'
    ),
    'highlights', jsonb_build_array(
      jsonb_build_object('icon', 'code', 'title', 'Desarrollo Fullstack', 'description', 'Experiencia de punta a punta conectando frontend, backend, design systems e infraestructura.'),
      jsonb_build_object('icon', 'rocket', 'title', 'Arquitectura con Tacto Humano', 'description', 'Uso tecnología e IA como aceleradores, pero valoro decisiones humanas de arquitectura, flujo y experiencia.'),
      jsonb_build_object('icon', 'sparkles', 'title', 'Design Systems y UX', 'description', 'Me gusta crear bases visuales consistentes, interfaces intuitivas y productos fáciles de evolucionar.')
    )
  )
)
where id = 'main';

update public.home_content
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'heroEyebrow', 'Fullstack Developer | Design Systems, Infra & UX',
    'heroHeadline', 'Architecture, infra and UX.',
    'heroDescription', 'I am a developer focused on design systems, patterns and infrastructure. I am passionate about frontend and UX because AI greatly accelerates execution, but architecture, human touch and intuitive experience still need intention.',
    'projectsButtonLabel', 'View projects',
    'resumeButtonLabel', 'Resume',
    'contactButtonLabel', 'Get in touch',
    'stackTitle', 'Skills and technologies',
    'stackGroups', jsonb_build_array(
      jsonb_build_object('title', 'Interface', 'items', jsonb_build_array('React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS')),
      jsonb_build_object('title', 'Backend', 'items', jsonb_build_array('Node.js', 'NestJS', 'PostgreSQL', 'MongoDB')),
      jsonb_build_object('title', 'Infra', 'items', jsonb_build_array('Docker', 'AWS')),
      jsonb_build_object('title', 'Soft skills', 'items', jsonb_build_array('Design systems', 'Patterns', 'Architecture', 'Intuitive UX'))
    ),
    'classicAboutTitle', 'About Me',
    'classicHighlightsTitle', 'What Makes Me Different',
    'classicCapabilitiesTitle', 'Technical Capabilities',
    'languageNote', 'I have advanced English with writing and speaking capability.',
    'auroraAboutEyebrow', 'About',
    'auroraAboutTitle', 'Lightness is also architecture.',
    'projectsEyebrow', 'Projects',
    'projectsTitle', 'Projects and deliveries.',
    'projectsLinkLabel', 'Explore all',
    'projectsTotalLabel', 'Projects mapped in total',
    'blogEyebrow', 'Blog',
    'blogTitle', 'Ideas in motion.',
    'contactTitle', 'Let us talk?',
    'contactDescription', 'Want to work together or have a question? Send me a message.'
  ),
  'es', jsonb_build_object(
    'heroEyebrow', 'Desarrollador Fullstack | Design Systems, Infra & UX',
    'heroHeadline', 'Arquitectura, infra y UX.',
    'heroDescription', 'Soy desarrollador con foco en design systems, patterns e infraestructura. Me apasionan frontend y UX porque la IA acelera mucho la ejecución, pero arquitectura, tacto humano y experiencia intuitiva todavía necesitan intención.',
    'projectsButtonLabel', 'Ver proyectos',
    'resumeButtonLabel', 'Currículum',
    'contactButtonLabel', 'Entrar en contacto',
    'stackTitle', 'Skills y tecnologías',
    'stackGroups', jsonb_build_array(
      jsonb_build_object('title', 'Interfaz', 'items', jsonb_build_array('React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS')),
      jsonb_build_object('title', 'Backend', 'items', jsonb_build_array('Node.js', 'NestJS', 'PostgreSQL', 'MongoDB')),
      jsonb_build_object('title', 'Infra', 'items', jsonb_build_array('Docker', 'AWS')),
      jsonb_build_object('title', 'Soft skills', 'items', jsonb_build_array('Design systems', 'Patterns', 'Arquitectura', 'UX intuitiva'))
    ),
    'classicAboutTitle', 'Sobre mí',
    'classicHighlightsTitle', 'Lo que me diferencia',
    'classicCapabilitiesTitle', 'Capacidades técnicas',
    'languageNote', 'Tengo inglés avanzado con capacidad de escritura y conversación.',
    'auroraAboutEyebrow', 'Sobre',
    'auroraAboutTitle', 'La ligereza también es arquitectura.',
    'projectsEyebrow', 'Proyectos',
    'projectsTitle', 'Proyectos y entregas.',
    'projectsLinkLabel', 'Explorar todo',
    'projectsTotalLabel', 'Proyectos mapeados en total',
    'blogEyebrow', 'Blog',
    'blogTitle', 'Ideas en movimiento.',
    'contactTitle', '¿Hablamos?',
    'contactDescription', '¿Quieres trabajar conmigo o tienes alguna duda? Envíame un mensaje.'
  )
)
where id = 'main';

update public.site_content
set translations = translations || jsonb_build_object(
  'en',
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              content,
              '{navigation}',
              jsonb_build_object(
                'home', 'Home',
                'blog', 'Blog',
                'projects', 'Projects',
                'resume', 'Resume',
                'playground', 'Lab',
                'switchToAurora', 'Switch to immersive mode',
                'switchToClassic', 'Switch to classic mode',
                'socialLinks', 'Social links',
                'playgroundDialogTitle', 'Open WebGL Lab?',
                'playgroundDialogDescription', 'The lab is part of the Aurora experience.',
                'cancel', 'Cancel',
                'goToAurora', 'Go to Aurora'
              )
            ),
            '{common}',
            jsonb_build_object(
              'readTimeSuffix', 'read',
              'articlesCountLabel', 'articles',
              'projectsCountLabel', 'projects',
              'viewProject', 'View project',
              'viewSite', 'View site',
              'loadingPage', 'Preparing page',
              'homeLoading', 'Starting experience',
              'contentLoadError', 'Could not load content.',
              'closeNavigation', 'Close navigation'
            )
          ),
          '{blog}',
          jsonb_build_object(
            'title', 'Blog',
            'description', 'Articles about development, technology and personal reflections.',
            'auroraEyebrow', 'Articles and ideas',
            'workTitle', 'Professional Articles',
            'personalTitle', 'Personal Articles',
            'loading', 'Syncing articles',
            'error', 'Could not load articles.',
            'notFoundTitle', 'Article not found',
            'backToBlog', 'Back to Blog',
            'backToArticles', 'Back to articles'
          )
        ),
        '{projects}',
        jsonb_build_object(
          'title', 'My Projects',
          'description', 'A selection of products, companies and projects I worked on and contributed to over the years.',
          'auroraEyebrow', 'Technical portfolio',
          'loading', 'Loading projects',
          'error', 'Could not load projects.',
          'notFound', 'Project not found.',
          'backToProjects', 'Back to projects'
        )
      ),
      '{resume}',
      jsonb_build_object(
        'loading', 'Building resume',
        'error', 'Could not load resume.',
        'logoAlt', 'Resume logo',
        'pdfSuccess', 'Resume generated successfully.',
        'pdfError', 'Could not generate resume.'
      )
    ),
    '{gateway}',
    jsonb_build_object(
      'kicker', 'Choose how you want to navigate',
      'titleLine1', 'Choose how',
      'titleLine2', 'to explore.',
      'descriptionTemplate', 'This is my personal and professional portfolio. If no option is chosen, the immersive experience will start in {seconds} seconds.',
      'redirectSeconds', content #> '{gateway,redirectSeconds}',
      'modes', jsonb_build_array(
        jsonb_build_object('id', 'classic', 'name', 'Classic', 'audience', 'Recommended for recruiters', 'description', 'Objective reading, familiar visuals and direct navigation to learn about my experience, projects and resume.', 'href', '/classic'),
        jsonb_build_object('id', 'aurora', 'name', 'Immersive Mode', 'audience', 'Recommended for exploration', 'description', 'A creative and personal experience with WebGL, motion, depth and cinematic navigation.', 'href', '/aurora')
      )
    )
  ),
  'es',
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              content,
              '{navigation}',
              jsonb_build_object(
                'home', 'Inicio',
                'blog', 'Blog',
                'projects', 'Proyectos',
                'resume', 'Currículum',
                'playground', 'Laboratorio',
                'switchToAurora', 'Cambiar al modo inmersivo',
                'switchToClassic', 'Cambiar al modo tradicional',
                'socialLinks', 'Redes sociales',
                'playgroundDialogTitle', '¿Abrir Laboratorio WebGL?',
                'playgroundDialogDescription', 'El laboratorio forma parte de la experiencia Aurora.',
                'cancel', 'Cancelar',
                'goToAurora', 'Ir a Aurora'
              )
            ),
            '{common}',
            jsonb_build_object(
              'readTimeSuffix', 'de lectura',
              'articlesCountLabel', 'artículos',
              'projectsCountLabel', 'proyectos',
              'viewProject', 'Ver proyecto',
              'viewSite', 'Ver sitio',
              'loadingPage', 'Preparando página',
              'homeLoading', 'Iniciando experiencia',
              'contentLoadError', 'No fue posible cargar el contenido.',
              'closeNavigation', 'Cerrar navegación'
            )
          ),
          '{blog}',
          jsonb_build_object(
            'title', 'Blog',
            'description', 'Artículos sobre desarrollo, tecnología y reflexiones personales.',
            'auroraEyebrow', 'Artículos e ideas',
            'workTitle', 'Artículos Profesionales',
            'personalTitle', 'Artículos Personales',
            'loading', 'Sincronizando artículos',
            'error', 'No fue posible cargar los artículos.',
            'notFoundTitle', 'Artículo no encontrado',
            'backToBlog', 'Volver al Blog',
            'backToArticles', 'Volver a artículos'
          )
        ),
        '{projects}',
        jsonb_build_object(
          'title', 'Mis Proyectos',
          'description', 'Una selección de productos, empresas y proyectos en los que trabajé y contribuí a lo largo de los años.',
          'auroraEyebrow', 'Portafolio técnico',
          'loading', 'Cargando proyectos',
          'error', 'No fue posible cargar los proyectos.',
          'notFound', 'Proyecto no encontrado.',
          'backToProjects', 'Volver a proyectos'
        )
      ),
      '{resume}',
      jsonb_build_object(
        'loading', 'Montando currículum',
        'error', 'No fue posible cargar el currículum.',
        'logoAlt', 'Logo del currículum',
        'pdfSuccess', 'Currículum generado con éxito.',
        'pdfError', 'No fue posible generar el currículum.'
      )
    ),
    '{gateway}',
    jsonb_build_object(
      'kicker', 'Elige cómo quieres navegar',
      'titleLine1', 'Elige cómo',
      'titleLine2', 'explorar.',
      'descriptionTemplate', 'Este es mi portafolio personal y profesional. Si no eliges una opción, la experiencia inmersiva comenzará en {seconds} segundos.',
      'redirectSeconds', content #> '{gateway,redirectSeconds}',
      'modes', jsonb_build_array(
        jsonb_build_object('id', 'classic', 'name', 'Tradicional', 'audience', 'Recomendado para reclutadores', 'description', 'Lectura objetiva, visual familiar y navegación directa para conocer mi experiencia, proyectos y currículum.', 'href', '/classic'),
        jsonb_build_object('id', 'aurora', 'name', 'Modo Inmersivo', 'audience', 'Recomendado para explorar', 'description', 'Una experiencia creativa y personal con WebGL, movimiento, profundidad y navegación cinematográfica.', 'href', '/aurora')
      )
    )
  )
)
where id = 'main';

update public.project_groups
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object('title', case title
    when 'Projetos próprios' then 'Own projects'
    when 'Outras empresas' then 'Other companies'
    else title
  end),
  'es', jsonb_build_object('title', case title
    when 'Projetos próprios' then 'Proyectos propios'
    when 'Outras empresas' then 'Otras empresas'
    else title
  end)
);

update public.projects
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'title', title,
    'description', description,
    'tags', to_jsonb(tags),
    'architecture', architecture,
    'details', details
  ),
  'es', jsonb_build_object(
    'title', title,
    'description', description,
    'tags', to_jsonb(tags),
    'architecture', architecture,
    'details', details
  )
);

update public.articles
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'title', title,
    'category', category,
    'description', description,
    'date', date,
    'readTime', read_time,
    'content', content
  ),
  'es', jsonb_build_object(
    'title', title,
    'category', category,
    'description', description,
    'date', date,
    'readTime', read_time,
    'content', content
  )
);

update public.resume_settings
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'aboutParagraphs', jsonb_build_array(
      'Fullstack developer focused on design systems, architecture, infrastructure and user experience.',
      'I combine technical execution with product sense to create clear, scalable and intuitive solutions.'
    ),
    'languages', jsonb_build_array(
      jsonb_build_object('name', 'Portuguese', 'description', 'Native'),
      jsonb_build_object('name', 'English', 'description', 'Technical English - able to write and read technical documentation')
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('key', 'about', 'title', 'About', 'enabled', true),
      jsonb_build_object('key', 'education', 'title', 'Education', 'enabled', true),
      jsonb_build_object('key', 'experience', 'title', 'Professional Experience', 'enabled', true),
      jsonb_build_object('key', 'skills', 'title', 'Technical Skills', 'enabled', true),
      jsonb_build_object('key', 'languages', 'title', 'Languages', 'enabled', true),
      jsonb_build_object('key', 'projects', 'title', 'Relevant Projects', 'enabled', true)
    ),
    'location', 'Sorocaba, SP - Brazil',
    'downloadLabel', 'Download PDF',
    'generatingLabel', 'Generating PDF...',
    'pdfFilename', pdf_filename,
    'projectTechnologiesLabel', 'Technologies',
    'technologies', (select jsonb_agg(name order by sort_order) from public.resume_technologies)
  ),
  'es', jsonb_build_object(
    'aboutParagraphs', jsonb_build_array(
      'Desarrollador fullstack con foco en design systems, arquitectura, infraestructura y experiencia de usuario.',
      'Combino ejecución técnica con sentido de producto para crear soluciones claras, escalables e intuitivas.'
    ),
    'languages', jsonb_build_array(
      jsonb_build_object('name', 'Portugués', 'description', 'Nativo'),
      jsonb_build_object('name', 'Inglés', 'description', 'Inglés técnico - capacidad de escritura y lectura de documentación técnica')
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('key', 'about', 'title', 'Sobre', 'enabled', true),
      jsonb_build_object('key', 'education', 'title', 'Educación', 'enabled', true),
      jsonb_build_object('key', 'experience', 'title', 'Experiencia Profesional', 'enabled', true),
      jsonb_build_object('key', 'skills', 'title', 'Habilidades Técnicas', 'enabled', true),
      jsonb_build_object('key', 'languages', 'title', 'Idiomas', 'enabled', true),
      jsonb_build_object('key', 'projects', 'title', 'Proyectos Relevantes', 'enabled', true)
    ),
    'location', 'Sorocaba, SP - Brasil',
    'downloadLabel', 'Descargar PDF',
    'generatingLabel', 'Generando PDF...',
    'pdfFilename', pdf_filename,
    'projectTechnologiesLabel', 'Tecnologías',
    'technologies', (select jsonb_agg(name order by sort_order) from public.resume_technologies)
  )
)
where id = 'main';

update public.resume_experiences
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'company', company,
    'position', case position
      when 'Desenvolvedor Fullstack' then 'Fullstack Developer'
      when 'Técnico de Redes' then 'Network Technician'
      when 'Técnico em Informática' then 'IT Technician'
      else position
    end,
    'location', replace(location, 'Brasil', 'Brazil'),
    'period', replace(period, 'Atual', 'Present'),
    'responsibilities', to_jsonb(responsibilities)
  ),
  'es', jsonb_build_object(
    'company', company,
    'position', case position
      when 'Desenvolvedor Fullstack' then 'Desarrollador Fullstack'
      when 'Técnico de Redes' then 'Técnico de Redes'
      when 'Técnico em Informática' then 'Técnico en Informática'
      else position
    end,
    'location', location,
    'period', replace(period, 'Atual', 'Actual'),
    'responsibilities', to_jsonb(responsibilities)
  )
);

update public.resume_roles
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'position', case position
      when 'Desenvolvedor Pleno' then 'Mid-level Developer'
      when 'Desenvolvedor Junior' then 'Junior Developer'
      else position
    end,
    'period', case period when 'Promoção' then 'Promotion' else period end
  ),
  'es', jsonb_build_object(
    'position', case position
      when 'Desenvolvedor Pleno' then 'Desarrollador Semi Senior'
      when 'Desenvolvedor Junior' then 'Desarrollador Junior'
      else position
    end,
    'period', case period when 'Promoção' then 'Promoción' else period end
  )
);

update public.resume_education
set translations = translations || jsonb_build_object(
  'en', jsonb_build_object(
    'institution', institution,
    'course', case course
      when 'Bacharelado em Engenharia da Computação' then 'Bachelor''s Degree in Computer Engineering'
      when 'Bacharelado em Análise e Desenvolvimento de Sistemas' then 'Bachelor''s Degree in Systems Analysis and Development'
      else course
    end,
    'location', replace(location, 'São Paulo', 'Sao Paulo'),
    'period', period
  ),
  'es', jsonb_build_object(
    'institution', institution,
    'course', case course
      when 'Bacharelado em Engenharia da Computação' then 'Licenciatura en Ingeniería de Computación'
      when 'Bacharelado em Análise e Desenvolvimento de Sistemas' then 'Licenciatura en Análisis y Desarrollo de Sistemas'
      else course
    end,
    'location', location,
    'period', period
  )
);
