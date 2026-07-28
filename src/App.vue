<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDown, Code2, Mail } from '@lucide/vue'
import { siCss, siDotnet, siGithub, siGmail, siGnubash, siGo, siHtml5, siJavascript, siLua, siPhp, siPostgresql, siPython, siRust, siTypescript, siVite, siVuedotjs } from 'simple-icons'

interface GitHubRepository {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  fork: boolean
  archived: boolean
  updated_at: string
}

interface RepositoryLanguage {
  name: string
  percentage: number
}

interface RepositoryReadme {
  subtitle: string
}

const technologies = [
  { name: 'Go', icon: siGo },
  { name: 'PostgreSQL', icon: siPostgresql },
  { name: 'Vue', icon: siVuedotjs },
  { name: 'TypeScript', icon: siTypescript },
  { name: '.NET', icon: siDotnet },
  { name: 'Vite', icon: siVite },
]

const aboutTechnologies = [
  { name: 'TypeScript', icon: siTypescript },
  { name: 'Vue', icon: siVuedotjs },
  { name: 'Vite', icon: siVite },
  { name: 'Go', icon: siGo },
  { name: 'C#', icon: null },
  { name: '.NET', icon: siDotnet },
  { name: 'PostgreSQL', icon: siPostgresql },
]

const menuOpen = ref(false)
const scrolled = ref(false)
const language = ref<'pt' | 'en'>('pt')
const languageMenu = ref<HTMLDetailsElement | null>(null)
const repositories = ref<GitHubRepository[]>([])
const repositoriesLoading = ref(true)
const repositoriesError = ref(false)
const repositoryPage = ref(1)
const repositoryLanguages = ref<Record<number, RepositoryLanguage[]>>({})
const repositoryReadmes = ref<Record<number, RepositoryReadme>>({})
const contactStatus = ref<'idle' | 'submitting' | 'success' | 'error' | 'rate-limited'>('idle')

const languageIcons: Record<string, typeof siGithub> = {
  CSS: siCss,
  Go: siGo,
  HTML: siHtml5,
  JavaScript: siJavascript,
  Lua: siLua,
  PHP: siPhp,
  Python: siPython,
  Rust: siRust,
  Shell: siGnubash,
  TypeScript: siTypescript,
  Vue: siVuedotjs,
}

const translations = {
  pt: {
    skip: 'Pular para o conteúdo', homeLabel: 'Elias Arruda — início', menu: 'Menu', close: 'Fechar', navLabel: 'Navegação principal',
    nav: ['Projeto', 'Serviços', 'Sobre', 'Contato'], developer: 'Desenvolvedor web', hero: 'Eu construo sites e aplicações web.', accent: 'Para necessidades reais.',
    intro: 'Da ideia ao lançamento, desenvolvo experiências rápidas, claras e preparadas para funcionar em qualquer tela.', viewProject: 'Ver projeto', contact: 'Fale comigo', technologiesLabel: 'Tecnologias que utilizo',
    professionalInfo: 'Informações profissionais', available: 'Disponível para novos projetos', railTitle: 'Sites profissionais e aplicações web, construídos de ponta a ponta.', focus: 'Foco', base: 'Base', country: 'Brasil', soon: 'eliaspessoal06@gmail.com',
    trajectoryLabel: 'Trajetória da ideia ao lançamento', idea: 'Ideia', development: 'Desenvolvimento', launch: 'Lançamento',
    projectVisual: 'Apresentação gráfica do FinovaApp', projectInProgress: 'Projeto em desenvolvimento', projectVisualText: 'Uma aplicação web criada para transformar uma necessidade em uma experiência clara e funcional.', selectedProject: 'Projeto selecionado', projectText: 'Desenvolvimento web completo, do planejamento da solução à construção da aplicação.', projectTech: 'Tecnologias do projeto', caseSoon: 'Estudo de caso completo em preparação.',
    servicesTitle: 'Da presença digital ao sistema completo.', servicesIntro: 'Escolho a solução certa para o objetivo, sem adicionar complexidade só para parecer técnico.',
    services: [
      { title: 'Sites profissionais', description: 'Sites institucionais, portfólios e páginas comerciais responsivas, organizados para apresentar seu trabalho e facilitar o contato.', items: [['Design responsivo', 'Uma experiência consistente do celular ao desktop.'], ['Performance e SEO', 'Estrutura preparada para carregar rápido e ser encontrada.'], ['Publicação completa', 'Projeto pronto para sair do código e entrar no ar.']] },
      { title: 'Landing pages', description: 'Páginas focadas em comunicar uma oferta com clareza e conduzir o visitante até a ação mais importante.', items: [['Hierarquia de conteúdo', 'A mensagem principal aparece antes de qualquer distração.'], ['Carregamento rápido', 'A página responde rápido em conexões e dispositivos reais.'], ['Contato sem atrito', 'O caminho até a conversão permanece curto e evidente.']] },
      { title: 'Aplicações web', description: 'Sistemas personalizados, painéis e ferramentas construídas de acordo com o fluxo e as necessidades do projeto.', items: [['Interface em Vue', 'Interações claras e componentes fáceis de manter.'], ['APIs e integrações', 'Comunicação segura entre serviços e recursos externos.'], ['Banco de dados', 'Informações organizadas para crescer com o produto.']] },
    ],
    about: 'Sobre', aboutTitle: 'Do que aparece na tela ao que faz tudo funcionar.', aboutText: 'Sou Elias Arruda, desenvolvedor web. Construo interfaces, APIs e bancos de dados para transformar ideias em produtos completos e bem estruturados.', mainTech: 'Principais tecnologias',
    githubProjects: 'Projetos no GitHub', githubIntro: 'Repositórios públicos atualizados automaticamente a partir do meu perfil.', loadingProjects: 'Buscando projetos…', projectsError: 'Não foi possível carregar os projetos agora.', noDescription: 'Descrição ainda não adicionada.', openRepository: 'Abrir repositório', publicRepository: 'Repositório público', githubProject: 'Projeto no GitHub', previous: 'Anterior', next: 'Próxima', page: 'Página', of: 'de', stars: 'estrelas',
    contactKicker: 'Tem uma ideia para a web?', contactTitle: 'Vamos transformar em algo real.', contactNote: 'Conte um pouco sobre sua ideia, seu objetivo e o que você precisa construir. Responderei assim que possível.', name: 'Nome', email: 'E-mail', message: 'Mensagem', namePlaceholder: 'Como você se chama?', emailPlaceholder: 'seu@email.com', messagePlaceholder: 'Conte sobre o projeto que você tem em mente…', sendEmail: 'Enviar mensagem', sending: 'Enviando…', sent: 'Mensagem enviada. Obrigado pelo contato!', sendError: 'Não foi possível enviar agora. Tente novamente.', rateLimited: 'Limite de envios atingido. Aguarde antes de enviar outra mensagem.', viewGithub: 'Ver GitHub', backTop: 'Voltar ao topo', languageLabel: 'Selecionar idioma',
  },
  en: {
    skip: 'Skip to content', homeLabel: 'Elias Arruda — home', menu: 'Menu', close: 'Close', navLabel: 'Main navigation',
    nav: ['Project', 'Services', 'About', 'Contact'], developer: 'Web developer', hero: 'I build websites and web applications.', accent: 'For real-world needs.',
    intro: 'From idea to launch, I develop fast, clear experiences designed to work beautifully on every screen.', viewProject: 'View project', contact: 'Get in touch', technologiesLabel: 'Technologies I use',
    professionalInfo: 'Professional information', available: 'Available for new projects', railTitle: 'Professional websites and web applications, built from end to end.', focus: 'Focus', base: 'Based in', country: 'Brazil', soon: 'eliaspessoal06@gmail.com',
    trajectoryLabel: 'Journey from idea to launch', idea: 'Idea', development: 'Development', launch: 'Launch',
    projectVisual: 'FinovaApp visual presentation', projectInProgress: 'Project in development', projectVisualText: 'A web application created to turn a real need into a clear and functional experience.', selectedProject: 'Selected project', projectText: 'Complete web development, from solution planning to application delivery.', projectTech: 'Project technologies', caseSoon: 'Full case study coming soon.',
    servicesTitle: 'From digital presence to complete systems.', servicesIntro: 'I choose the right solution for each goal, without adding complexity just to sound technical.',
    services: [
      { title: 'Professional websites', description: 'Responsive corporate websites, portfolios and commercial pages organized to showcase your work and make contact easier.', items: [['Responsive design', 'A consistent experience from mobile to desktop.'], ['Performance and SEO', 'A structure designed to load quickly and be found.'], ['Complete publishing', 'A project ready to leave the codebase and go live.']] },
      { title: 'Landing pages', description: 'Pages focused on communicating an offer clearly and guiding visitors toward the most important action.', items: [['Content hierarchy', 'The main message comes before any distraction.'], ['Fast loading', 'The page responds quickly on real connections and devices.'], ['Frictionless contact', 'The path to conversion stays short and clear.']] },
      { title: 'Web applications', description: 'Custom systems, dashboards and tools built around the project workflow and requirements.', items: [['Vue interfaces', 'Clear interactions and maintainable components.'], ['APIs and integrations', 'Reliable communication between services and external resources.'], ['Databases', 'Information structured to grow with the product.']] },
    ],
    about: 'About', aboutTitle: 'From what appears on screen to what makes it all work.', aboutText: 'I’m Elias Arruda, a web developer. I build interfaces, APIs and databases that turn ideas into complete, well-structured products.', mainTech: 'Main technologies',
    githubProjects: 'GitHub projects', githubIntro: 'Public repositories updated automatically from my profile.', loadingProjects: 'Loading projects…', projectsError: 'Projects could not be loaded right now.', noDescription: 'No description added yet.', openRepository: 'Open repository', publicRepository: 'Public repository', githubProject: 'GitHub project', previous: 'Previous', next: 'Next', page: 'Page', of: 'of', stars: 'stars',
    contactKicker: 'Have an idea for the web?', contactTitle: 'Let’s make it real.', contactNote: 'Tell me a little about your idea, your goal and what you need to build. I’ll get back to you as soon as possible.', name: 'Name', email: 'Email', message: 'Message', namePlaceholder: 'What’s your name?', emailPlaceholder: 'you@email.com', messagePlaceholder: 'Tell me about the project you have in mind…', sendEmail: 'Send message', sending: 'Sending…', sent: 'Message sent. Thank you for reaching out!', sendError: 'Could not send your message right now. Please try again.', rateLimited: 'Message limit reached. Please wait before sending another message.', viewGithub: 'View GitHub', backTop: 'Back to top', languageLabel: 'Select language',
  },
} as const

const copy = computed(() => translations[language.value])
const repositoriesPerPage = 3
const repositoryPageCount = computed(() => Math.max(1, Math.ceil(repositories.value.length / repositoriesPerPage)))
const paginatedRepositories = computed(() => repositories.value.slice((repositoryPage.value - 1) * repositoriesPerPage, repositoryPage.value * repositoriesPerPage))

const changeRepositoryPage = (page: number) => {
  repositoryPage.value = Math.min(Math.max(page, 1), repositoryPageCount.value)
  document.querySelector('.repositories-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const loadRepositoryLanguages = async (visibleRepositories: GitHubRepository[]) => {
  await Promise.all(visibleRepositories.map(async (repository) => {
    if (repositoryLanguages.value[repository.id]) return
    const cacheKey = `github-languages-${repository.id}`
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? 'null') as { updatedAt: string; data: RepositoryLanguage[] } | null
    if (cached?.updatedAt === repository.updated_at) {
      repositoryLanguages.value = { ...repositoryLanguages.value, [repository.id]: cached.data }
      return
    }
    try {
      const response = await fetch(`https://api.github.com/repos/EliasArruda/${encodeURIComponent(repository.name)}/languages`, {
        headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      })
      if (!response.ok) throw new Error(`GitHub languages API: ${response.status}`)
      const bytes = (await response.json()) as Record<string, number>
      const total = Object.values(bytes).reduce((sum, value) => sum + value, 0)
      const data = Object.entries(bytes).map(([name, value]) => ({ name, percentage: total ? Math.round((value / total) * 1000) / 10 : 0 }))
      repositoryLanguages.value = { ...repositoryLanguages.value, [repository.id]: data }
      localStorage.setItem(cacheKey, JSON.stringify({ updatedAt: repository.updated_at, data }))
    } catch {
      const fallback = repository.language ? [{ name: repository.language, percentage: 100 }] : []
      repositoryLanguages.value = { ...repositoryLanguages.value, [repository.id]: fallback }
    }
  }))
}

const cleanMarkdownText = (value: string) => value
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, '')
  .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\u{FE0F}\u{200D}]/gu, '')
  .replace(/[\uE000-\uF8FF]/g, '')
  .replace(/[`*_~]/g, '')
  .replace(/\s+/g, ' ')
  .trim()

const loadRepositoryReadmes = async (visibleRepositories: GitHubRepository[]) => {
  await Promise.all(visibleRepositories.map(async (repository) => {
    if (repositoryReadmes.value[repository.id]) return
    const cacheKey = `github-readme-v3-${repository.id}`
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? 'null') as { updatedAt: string; data: RepositoryReadme } | null
    if (cached?.updatedAt === repository.updated_at) {
      repositoryReadmes.value = { ...repositoryReadmes.value, [repository.id]: cached.data }
      return
    }
    let data = { subtitle: repository.description || '' }
    try {
      const response = await fetch(`https://api.github.com/repos/EliasArruda/${encodeURIComponent(repository.name)}/readme`, {
        headers: { Accept: 'application/vnd.github.raw+json', 'X-GitHub-Api-Version': '2022-11-28' },
      })
      if (!response.ok) throw new Error(`GitHub README API: ${response.status}`)
      const markdown = await response.text()
      const lines = markdown.split(/\r?\n/)
      const titleIndex = lines.findIndex((line) => /^#\s+/.test(line.trim()))
      const paragraph: string[] = []
      if (titleIndex >= 0) {
        for (const sourceLine of lines.slice(titleIndex + 1)) {
          const line = sourceLine.trim()
          if (!paragraph.length && (!line || /^(!\[|\[!\[|<(?:p|div|img|picture|a)\b|---+$)/i.test(line))) continue
          if (/^#{1,6}\s+/.test(line) || (!line && paragraph.length)) break
          paragraph.push(line)
        }
      }
      const subtitle = cleanMarkdownText(paragraph.join(' '))
      data = { subtitle: subtitle || data.subtitle }
    } catch {
      // Repository metadata remains as the fallback when a README is unavailable.
    }
    repositoryReadmes.value = { ...repositoryReadmes.value, [repository.id]: data }
    localStorage.setItem(cacheKey, JSON.stringify({ updatedAt: repository.updated_at, data }))
  }))
}

watch(paginatedRepositories, (visibleRepositories) => {
  loadRepositoryLanguages(visibleRepositories)
  loadRepositoryReadmes(visibleRepositories)
}, { immediate: true })

const setLanguage = (value: 'pt' | 'en') => {
  language.value = value
  document.documentElement.lang = value === 'pt' ? 'pt-BR' : 'en'
  localStorage.setItem('portfolio-language', value)
  if (languageMenu.value) languageMenu.value.open = false
}

const submitContact = async (event: Event) => {
  const form = event.currentTarget as HTMLFormElement
  const rateLimitKey = 'portfolio-contact-submissions'
  const now = Date.now()
  const oneHourAgo = now - 60 * 60 * 1000
  let submissions: number[] = []
  try {
    submissions = (JSON.parse(localStorage.getItem(rateLimitKey) ?? '[]') as number[]).filter((timestamp) => timestamp > oneHourAgo)
  } catch {
    localStorage.removeItem(rateLimitKey)
  }
  if (submissions.length >= 3 || (submissions.length > 0 && now - submissions[submissions.length - 1] < 60 * 1000)) {
    contactStatus.value = 'rate-limited'
    return
  }
  contactStatus.value = 'submitting'
  try {
    const formData = new FormData(form)
    const response = await fetch('https://formsubmit.co/ajax/eliaspessoal06@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })
    if (!response.ok) throw new Error(`Contact form: ${response.status}`)
    localStorage.setItem(rateLimitKey, JSON.stringify([...submissions, now]))
    form.reset()
    contactStatus.value = 'success'
  } catch {
    contactStatus.value = 'error'
  }
}

const loadRepositories = async () => {
  const cacheKey = 'elias-github-repositories'
  const isPortfolioProject = (repository: GitHubRepository) => !repository.fork && !repository.archived && repository.name.toLowerCase() !== 'eliasarruda'
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? 'null') as { savedAt: number; data: GitHubRepository[] } | null
    if (cached && Date.now() - cached.savedAt < 15 * 60 * 1000) {
      repositories.value = cached.data.filter(isPortfolioProject)
      return
    }
    const response = await fetch('https://api.github.com/users/EliasArruda/repos?per_page=100&sort=updated', {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    })
    if (!response.ok) throw new Error(`GitHub API: ${response.status}`)
    const data = (await response.json()) as GitHubRepository[]
    repositories.value = data.filter(isPortfolioProject)
    localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data: repositories.value }))
  } catch {
    repositoriesError.value = true
  } finally {
    repositoriesLoading.value = false
  }
}

const updateHeader = () => {
  scrolled.value = window.scrollY > 24
}

const closeMenu = () => {
  menuOpen.value = false
}

onMounted(() => {
  window.history.scrollRestoration = 'manual'
  if (window.location.hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  window.scrollTo(0, 0)
  window.requestAnimationFrame(() => window.scrollTo(0, 0))
  const savedLanguage = localStorage.getItem('portfolio-language')
  setLanguage(savedLanguage === 'pt' || savedLanguage === 'en' ? savedLanguage : navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt')
  loadRepositories()
  updateHeader()
  window.addEventListener('scroll', updateHeader, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateHeader))
</script>

<template>
  <a class="skip-link" href="#conteudo">{{ copy.skip }}</a>

  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <a class="brand" href="#inicio" :aria-label="copy.homeLabel" @click="closeMenu">
      <span>Elias Arruda</span>
    </a>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="main-navigation"
      @click="menuOpen = !menuOpen"
    >
      <span>{{ menuOpen ? copy.close : copy.menu }}</span>
    </button>

    <div class="header-actions">
      <nav id="main-navigation" class="navigation" :class="{ 'is-open': menuOpen }" :aria-label="copy.navLabel">
        <a href="#projeto" @click="closeMenu">{{ copy.nav[0] }}</a>
        <a href="#servicos" @click="closeMenu">{{ copy.nav[1] }}</a>
        <a href="#sobre" @click="closeMenu">{{ copy.nav[2] }}</a>
        <a href="#contato" @click="closeMenu">{{ copy.nav[3] }}</a>
      </nav>
      <details ref="languageMenu" class="language-switcher">
        <summary :aria-label="copy.languageLabel">
          <span aria-hidden="true">{{ language === 'pt' ? '🇧🇷' : '🇺🇸' }}</span>
          <ChevronDown :size="16" aria-hidden="true" />
        </summary>
        <div class="language-options">
          <button type="button" :class="{ active: language === 'pt' }" :aria-pressed="language === 'pt'" @click="setLanguage('pt')"><span aria-hidden="true">🇧🇷</span> Português</button>
          <button type="button" :class="{ active: language === 'en' }" :aria-pressed="language === 'en'" @click="setLanguage('en')"><span aria-hidden="true">🇺🇸</span> English</button>
        </div>
      </details>
    </div>
  </header>

  <main id="conteudo">
    <section id="inicio" class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="availability"><span aria-hidden="true"></span> Elias Arruda · {{ copy.developer }}</p>
        <h1 id="hero-title">{{ copy.hero }}</h1>
        <p class="accent-label hero-accent">{{ copy.accent }}</p>
        <p class="hero-intro">{{ copy.intro }}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#projeto">{{ copy.viewProject }} <span aria-hidden="true">↘</span></a>
          <a class="text-link" href="#contato">{{ copy.contact }} <span aria-hidden="true">→</span></a>
        </div>
        <ul class="hero-technologies" :aria-label="copy.technologiesLabel">
          <li v-for="technology in technologies" :key="technology.name">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="technology.icon.path" /></svg>
            <span>{{ technology.name }}</span>
          </li>
        </ul>
      </div>

      <aside class="hero-rail" :aria-label="copy.professionalInfo">
        <p class="rail-status"><span aria-hidden="true"></span> {{ copy.available }}</p>
        <p class="rail-title">{{ copy.railTitle }}</p>
        <dl>
          <div><dt>{{ copy.focus }}</dt><dd>Web &amp; sites</dd></div>
          <div><dt>{{ copy.base }}</dt><dd>{{ copy.country }}</dd></div>
          <div class="contact-detail"><dt>{{ copy.nav[3] }}</dt><dd><a href="#contato" :aria-label="`Gmail — ${copy.nav[3]}`"><svg class="gmail-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="siGmail.path" /></svg></a></dd></div>
        </dl>
        <a class="github-link" href="https://github.com/EliasArruda" target="_blank" rel="noreferrer">
          <svg class="brand-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="siGithub.path" /></svg>
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </aside>

      <svg class="trajectory" viewBox="0 0 760 260" role="img" :aria-label="copy.trajectoryLabel">
        <path d="M24 224C242 224 425 197 574 117C644 80 696 42 736 18" />
        <g><circle cx="46" cy="222" r="7" /><text x="24" y="252">{{ copy.idea }}</text></g>
        <g><circle cx="430" cy="168" r="7" /><text x="386" y="201">{{ copy.development }}</text></g>
        <g><circle cx="706" cy="41" r="7" /><text x="650" y="78">{{ copy.launch }}</text></g>
      </svg>
    </section>

    <section id="projeto" class="repositories-section" aria-labelledby="repositories-title">
      <div class="repositories-heading">
        <h2 id="repositories-title">{{ copy.githubProjects }}</h2>
        <p>{{ copy.githubIntro }}</p>
      </div>
      <p v-if="repositoriesLoading" class="repository-state" role="status">{{ copy.loadingProjects }}</p>
      <p v-else-if="repositoriesError" class="repository-state" role="alert">{{ copy.projectsError }}</p>
      <div>
        <div class="repositories-list">
          <article v-for="(repository, index) in paginatedRepositories" :key="repository.id" class="github-project" :class="{ 'is-reversed': index % 2 === 1 }">
            <div class="project-visual" :aria-label="`${repository.name}: ${copy.publicRepository}`">
              <div class="project-window">
                <div class="window-bar"><span>{{ repository.name }}</span><span>{{ copy.publicRepository }}</span></div>
                <div class="window-content">
                  <span class="finova-symbol" aria-hidden="true">{{ repository.name.charAt(0).toUpperCase() }}</span>
                  <p>{{ repositoryReadmes[repository.id]?.subtitle || repository.description || copy.noDescription }}</p>
                  <div class="code-lines" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                </div>
              </div>
            </div>
            <div class="project-copy repository-copy">
              <p class="accent-label section-label">{{ copy.githubProject }}</p>
              <h3>{{ repository.name }}</h3>
              <p>{{ repositoryReadmes[repository.id]?.subtitle || repository.description || copy.noDescription }}</p>
              <ul v-if="repositoryLanguages[repository.id]?.length" class="tech-list repository-languages" :aria-label="copy.projectTech">
                <li v-for="repositoryLanguage in repositoryLanguages[repository.id]" :key="repositoryLanguage.name" :aria-label="`${repositoryLanguage.name} ${repositoryLanguage.percentage}%`" :title="repositoryLanguage.name" :style="{ '--language-share': `${repositoryLanguage.percentage}%` }">
                  <svg v-if="languageIcons[repositoryLanguage.name]" viewBox="0 0 24 24" aria-hidden="true"><path :d="languageIcons[repositoryLanguage.name].path" /></svg>
                  <span v-else-if="repositoryLanguage.name === 'C#'" class="csharp-icon" aria-hidden="true">C#</span>
                  <Code2 v-else :size="28" aria-hidden="true" />
                  <span class="language-percentage">{{ repositoryLanguage.percentage }}%</span>
                </li>
              </ul>
              <a class="button button-primary repository-link" :href="repository.html_url" target="_blank" rel="noreferrer">{{ copy.openRepository }} <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>
        <nav v-if="repositoryPageCount > 1" class="repository-pagination" :aria-label="`${copy.githubProjects}: ${copy.page}`">
          <button class="pagination-direction" type="button" :disabled="repositoryPage === 1" :aria-label="copy.previous" @click="changeRepositoryPage(repositoryPage - 1)">←</button>
          <div class="pagination-pages">
            <button v-for="pageNumber in repositoryPageCount" :key="pageNumber" type="button" :class="{ active: repositoryPage === pageNumber }" :aria-current="repositoryPage === pageNumber ? 'page' : undefined" :aria-label="`${copy.page} ${pageNumber}`" @click="changeRepositoryPage(pageNumber)">{{ pageNumber }}</button>
          </div>
          <button class="pagination-direction" type="button" :disabled="repositoryPage === repositoryPageCount" :aria-label="copy.next" @click="changeRepositoryPage(repositoryPage + 1)">→</button>
        </nav>
      </div>
    </section>

    <section id="servicos" class="services-section" aria-labelledby="services-title">
      <div class="section-heading">
        <h2 id="services-title">{{ copy.servicesTitle }}</h2>
        <p>{{ copy.servicesIntro }}</p>
      </div>
      <div class="services-list">
        <details v-for="(service, index) in copy.services" :key="service.title" :open="index === 0">
          <summary>
            <span class="service-number">0{{ index + 1 }}</span>
            <h3>{{ service.title }}</h3>
            <ChevronDown class="service-chevron" :size="28" aria-hidden="true" />
          </summary>
          <div class="service-details">
            <p>{{ service.description }}</p>
            <ul>
              <li v-for="item in service.items" :key="item[0]"><strong>{{ item[0] }}</strong><span>{{ item[1] }}</span></li>
            </ul>
          </div>
        </details>
      </div>
    </section>

    <section id="sobre" class="about-section" aria-labelledby="about-title">
      <p class="accent-label section-label">{{ copy.about }}</p>
      <div>
        <h2 id="about-title">{{ copy.aboutTitle }}</h2>
        <p>{{ copy.aboutText }}</p>
        <ul class="skills" :aria-label="copy.mainTech">
          <li v-for="technology in aboutTechnologies" :key="technology.name">
            <svg v-if="technology.icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="technology.icon.path" /></svg>
            <span v-else class="csharp-icon" aria-hidden="true">C#</span>
            <span>{{ technology.name }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section id="contato" class="contact-section" aria-labelledby="contact-title">
      <p class="accent-label contact-kicker">{{ copy.contactKicker }}</p>
      <h2 id="contact-title">{{ copy.contactTitle }}</h2>
      <p class="contact-note">{{ copy.contactNote }}</p>
      <form class="contact-form" @submit.prevent="submitContact">
        <div class="form-field"><label for="contact-name">{{ copy.name }}</label><input id="contact-name" name="name" type="text" :placeholder="copy.namePlaceholder" autocomplete="name" required /></div>
        <div class="form-field"><label for="contact-email">{{ copy.email }}</label><input id="contact-email" name="email" type="email" :placeholder="copy.emailPlaceholder" autocomplete="email" required /></div>
        <div class="form-field form-message"><label for="contact-message">{{ copy.message }}</label><textarea id="contact-message" name="message" :placeholder="copy.messagePlaceholder" rows="6" required></textarea></div>
        <input class="form-honeypot" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <input type="hidden" name="_subject" value="Novo contato pelo portfólio" />
        <button class="button button-primary form-submit" type="submit" :disabled="contactStatus === 'submitting'">
          <Mail :size="20" aria-hidden="true" />
          {{ contactStatus === 'submitting' ? copy.sending : copy.sendEmail }} <span aria-hidden="true">→</span>
        </button>
        <p v-if="contactStatus === 'success'" class="form-status success" role="status">{{ copy.sent }}</p>
        <p v-if="contactStatus === 'error'" class="form-status error" role="alert">{{ copy.sendError }}</p>
        <p v-if="contactStatus === 'rate-limited'" class="form-status error" role="alert">{{ copy.rateLimited }}</p>
      </form>
    </section>
  </main>

  <footer class="site-footer">
    <span>© {{ new Date().getFullYear() }} Elias Arruda</span>
    <a href="#inicio">{{ copy.backTop }} ↑</a>
  </footer>
</template>
