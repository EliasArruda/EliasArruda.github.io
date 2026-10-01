<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { usePortfolioMotion } from "./usePortfolioMotion";
usePortfolioMotion();
import { useTheme } from "./useTheme";
const { theme, toggleTheme } = useTheme();
import {
    ArrowUpRight,
    ArrowRight,
    Check,
    ChevronDown,
    Mail,
    Menu,
    X,
    Globe2,
    PanelsTopLeft,
    AppWindow,
    Code2,
    MapPin,
    MessageCircle,
    Monitor,
    Radio,
    Braces,
    Home,
    FolderOpen,
    Layers,
    Send,
    Database,
    Server,
    Smartphone,
    ExternalLink,
    Copy,
    CheckCheck,
    Sparkles,
    Pause,
    Play,
    Sun,
    Moon,
} from "@lucide/vue";
import {
    siGithub,
    siVuedotjs,
    siTypescript,
    siGo,
    siDotnet,
    siPostgresql,
    siGit,
} from "simple-icons";
import SkillOrb from "./components/SkillOrb.vue";
import GithubActivity from "./components/GithubActivity.vue";
const motionPaused = ref(false);
const activeSection = ref("inicio");
const navMore = ref<HTMLDetailsElement | null>(null);
const typed = ref("");
const typingPhrase = computed(() =>
    en.value ? "Interfaces, APIs & web applications" : "Interfaces, APIs e aplicações web",
);
let motionCleanup = () => {};
onMounted(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0,
        backward = false,
        hold = 0;
    const timer = setInterval(() => {
        if (reduced.matches || motionPaused.value) {
            typed.value = typingPhrase.value;
            return;
        }
        if (document.hidden) return;
        if (hold > 0) {
            hold--;
            return;
        }
        index += backward ? -1 : 1;
        index = Math.max(0, Math.min(index, typingPhrase.value.length));
        typed.value = typingPhrase.value.slice(0, index);
        if (index === typingPhrase.value.length) {
            backward = true;
            hold = 32;
        } else if (index === 0) {
            backward = false;
            hold = 5;
        }
    }, 75);
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries)
                if (entry.isIntersecting) activeSection.value = entry.target.id;
        },
        { rootMargin: "-15% 0px -60% 0px" },
    );
    for (const id of ["inicio", "sobre", "projeto", "tech-stack", "contato"]) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    }
    motionCleanup = () => {
        clearInterval(timer);
        observer.disconnect();
    };
});
onUnmounted(() => motionCleanup());
const techs = [siVuedotjs, siTypescript, siGo, siDotnet, siPostgresql, siGit];
const copied = ref(false);
const copyEmail = async () => {
    try {
        await navigator.clipboard.writeText("eliaspessoal06@gmail.com");
        copied.value = true;
        setTimeout(() => (copied.value = false), 2500);
    } catch {
        window.location.href = "mailto:eliaspessoal06@gmail.com";
    }
};
const language = ref<"pt" | "en">("pt");
const menuOpen = ref(false);
const languageMenu = ref<HTMLDetailsElement | null>(null);
const contactStatus = ref<"idle" | "submitting" | "success" | "error" | "rate-limited">("idle");
const translations = {
    pt: {
        skip: "Pular para o conteúdo",
        homeLabel: "Elias Arruda — início",
        menu: "Menu",
        close: "Fechar",
        navLabel: "Navegação principal",
        nav: ["Projeto", "Serviços", "Sobre", "Contato"],
        developer: "Desenvolvedor web",
        hero: "Seu próximo passo digital,",
        accent: "com tranquilidade.",
        intro: "Sou Elias Arruda. Desenvolvo sites e aplicações web com atenção aos detalhes, comunicação direta e clareza em cada etapa.",
        viewProject: "Ver projeto",
        contact: "Fale comigo",
        technologiesLabel: "Tecnologias que utilizo",
        professionalInfo: "Informações profissionais",
        available: "Disponível para novos projetos",
        railTitle: "Sites profissionais e aplicações web, construídos de ponta a ponta.",
        focus: "Foco",
        base: "Base",
        country: "Brasil",
        soon: "eliaspessoal06@gmail.com",
        trajectoryLabel: "Trajetória da ideia ao lançamento",
        idea: "Ideia",
        development: "Desenvolvimento",
        launch: "Lançamento",
        projectVisual: "Apresentação gráfica do FinovaApp",
        projectInProgress: "Projeto em desenvolvimento",
        projectVisualText:
            "Uma aplicação web criada para transformar uma necessidade em uma experiência clara e funcional.",
        selectedProject: "Projeto selecionado",
        projectText:
            "Desenvolvimento web completo, do planejamento da solução à construção da aplicação.",
        projectTech: "Tecnologias do projeto",
        caseSoon: "Estudo de caso completo em preparação.",
        servicesTitle: "O que você precisa construir?",
        servicesIntro:
            "Um site para apresentar seu negócio ou uma ferramenta para facilitar sua rotina. Começamos pelo que faz sentido para você.",
        services: [
            {
                title: "Sites profissionais",
                description:
                    "Sites institucionais, portfólios e páginas comerciais responsivas, organizados para apresentar seu trabalho e facilitar o contato.",
                items: [
                    ["Design responsivo", "Uma experiência consistente do celular ao desktop."],
                    [
                        "Performance e SEO",
                        "Estrutura preparada para carregar rápido e ser encontrada.",
                    ],
                    ["Publicação completa", "Projeto pronto para sair do código e entrar no ar."],
                ],
            },
            {
                title: "Landing pages",
                description:
                    "Páginas focadas em comunicar uma oferta com clareza e conduzir o visitante até a ação mais importante.",
                items: [
                    [
                        "Hierarquia de conteúdo",
                        "A mensagem principal aparece antes de qualquer distração.",
                    ],
                    [
                        "Carregamento rápido",
                        "A página responde rápido em conexões e dispositivos reais.",
                    ],
                    ["Contato sem atrito", "O caminho até a conversão permanece curto e evidente."],
                ],
            },
            {
                title: "Aplicações web",
                description:
                    "Sistemas personalizados, painéis e ferramentas construídas de acordo com o fluxo e as necessidades do projeto.",
                items: [
                    ["Interface em Vue", "Interações claras e componentes fáceis de manter."],
                    [
                        "APIs e integrações",
                        "Comunicação segura entre serviços e recursos externos.",
                    ],
                    ["Banco de dados", "Informações organizadas para crescer com o produto."],
                ],
            },
        ],
        about: "Sobre",
        aboutTitle: "Do que aparece na tela ao que faz tudo funcionar.",
        aboutText:
            "Sou Elias Arruda, desenvolvedor web. Construo interfaces, APIs e bancos de dados para transformar ideias em produtos completos e bem estruturados.",
        mainTech: "Principais tecnologias",
        githubProjects: "Projetos no GitHub",
        githubIntro: "Repositórios públicos atualizados automaticamente a partir do meu perfil.",
        loadingProjects: "Buscando projetos…",
        projectsError: "Não foi possível carregar os projetos agora.",
        noDescription: "Descrição ainda não adicionada.",
        openRepository: "Abrir repositório",
        publicRepository: "Repositório público",
        githubProject: "Projeto no GitHub",
        previous: "Anterior",
        next: "Próxima",
        page: "Página",
        of: "de",
        stars: "estrelas",
        contactKicker: "Tem uma ideia para a web?",
        contactTitle: "Vamos conversar sobre sua ideia?",
        contactNote:
            "Conte um pouco sobre sua ideia, seu objetivo e o que você precisa construir. Responderei assim que possível.",
        name: "Nome",
        email: "E-mail",
        message: "Mensagem",
        namePlaceholder: "Como você se chama?",
        emailPlaceholder: "seu@email.com",
        messagePlaceholder: "Conte sobre o projeto que você tem em mente…",
        sendEmail: "Enviar mensagem",
        sending: "Enviando…",
        sent: "Mensagem enviada. Obrigado pelo contato!",
        sendError: "Não foi possível enviar agora. Tente novamente.",
        rateLimited: "Limite de envios atingido. Aguarde antes de enviar outra mensagem.",
        viewGithub: "Ver GitHub",
        backTop: "Voltar ao topo",
        languageLabel: "Selecionar idioma",
    },
    en: {
        skip: "Skip to content",
        homeLabel: "Elias Arruda — home",
        menu: "Menu",
        close: "Close",
        navLabel: "Main navigation",
        nav: ["Project", "Services", "About", "Contact"],
        developer: "Web developer",
        hero: "Your next digital step,",
        accent: "with peace of mind.",
        intro: "I’m Elias Arruda. I build websites and web applications with thoughtful details, direct communication and clarity at every step.",
        viewProject: "View project",
        contact: "Get in touch",
        technologiesLabel: "Technologies I use",
        professionalInfo: "Professional information",
        available: "Available for new projects",
        railTitle: "Professional websites and web applications, built from end to end.",
        focus: "Focus",
        base: "Based in",
        country: "Brazil",
        soon: "eliaspessoal06@gmail.com",
        trajectoryLabel: "Journey from idea to launch",
        idea: "Idea",
        development: "Development",
        launch: "Launch",
        projectVisual: "FinovaApp visual presentation",
        projectInProgress: "Project in development",
        projectVisualText:
            "A web application created to turn a real need into a clear and functional experience.",
        selectedProject: "Selected project",
        projectText: "Complete web development, from solution planning to application delivery.",
        projectTech: "Project technologies",
        caseSoon: "Full case study coming soon.",
        servicesTitle: "What would you like to build?",
        servicesIntro:
            "A website to introduce your business or a tool to simplify your workflow. We start with what makes sense for you.",
        services: [
            {
                title: "Professional websites",
                description:
                    "Responsive corporate websites, portfolios and commercial pages organized to showcase your work and make contact easier.",
                items: [
                    ["Responsive design", "A consistent experience from mobile to desktop."],
                    ["Performance and SEO", "A structure designed to load quickly and be found."],
                    ["Complete publishing", "A project ready to leave the codebase and go live."],
                ],
            },
            {
                title: "Landing pages",
                description:
                    "Pages focused on communicating an offer clearly and guiding visitors toward the most important action.",
                items: [
                    ["Content hierarchy", "The main message comes before any distraction."],
                    ["Fast loading", "The page responds quickly on real connections and devices."],
                    ["Frictionless contact", "The path to conversion stays short and clear."],
                ],
            },
            {
                title: "Web applications",
                description:
                    "Custom systems, dashboards and tools built around the project workflow and requirements.",
                items: [
                    ["Vue interfaces", "Clear interactions and maintainable components."],
                    [
                        "APIs and integrations",
                        "Reliable communication between services and external resources.",
                    ],
                    ["Databases", "Information structured to grow with the product."],
                ],
            },
        ],
        about: "About",
        aboutTitle: "From what appears on screen to what makes it all work.",
        aboutText:
            "I’m Elias Arruda, a web developer. I build interfaces, APIs and databases that turn ideas into complete, well-structured products.",
        mainTech: "Main technologies",
        githubProjects: "GitHub projects",
        githubIntro: "Public repositories updated automatically from my profile.",
        loadingProjects: "Loading projects…",
        projectsError: "Projects could not be loaded right now.",
        noDescription: "No description added yet.",
        openRepository: "Open repository",
        publicRepository: "Public repository",
        githubProject: "GitHub project",
        previous: "Previous",
        next: "Next",
        page: "Page",
        of: "of",
        stars: "stars",
        contactKicker: "Have an idea for the web?",
        contactTitle: "Let’s talk about your idea.",
        contactNote:
            "Tell me a little about your idea, your goal and what you need to build. I’ll get back to you as soon as possible.",
        name: "Name",
        email: "Email",
        message: "Message",
        namePlaceholder: "What’s your name?",
        emailPlaceholder: "you@email.com",
        messagePlaceholder: "Tell me about the project you have in mind…",
        sendEmail: "Send message",
        sending: "Sending…",
        sent: "Message sent. Thank you for reaching out!",
        sendError: "Could not send your message right now. Please try again.",
        rateLimited: "Message limit reached. Please wait before sending another message.",
        viewGithub: "View GitHub",
        backTop: "Back to top",
        languageLabel: "Select language",
    },
} as const;

const copy = computed(() => translations[language.value]);
const en = computed(() => language.value === "en");
const extra = computed(() =>
    en.value
        ? {
              role: "Independent web developer",
              available: "Let’s talk about your project",
              cta: "Tell me about your project",
              work: "Explore my work",
              note: "Clear scope. Direct communication. Thoughtful delivery.",
              journey: "A clear path from the first conversation.",
              steps: [
                  [
                      "We understand your goal",
                      "We discuss your idea, audience and what the project needs to achieve.",
                  ],
                  [
                      "We agree on the next steps",
                      "Scope, deliverables, timeline and price are defined in the proposal.",
                  ],
                  [
                      "You follow the progress",
                      "We review the work together and align adjustments along the way.",
                  ],
              ],
              selected: "Work you can explore.",
              workIntro:
                  "Personal projects that show how I turn an idea into working software. Explore the code and the decisions behind it.",
              personal: "Personal project",
              veyra: "Screen sharing, straight from your browser.",
              veyraDesc:
                  "A web application where a presenter creates a room and shares a link. Viewers receive audio and video in real time through WebRTC.",
              veyraDetail:
                  "Room management, real-time communication and interfaces built with Blazor and .NET.",
              code: "Explore the code",
              demo: "Open application",
              portfolio: "A clear home for my work.",
              portfolioDesc:
                  "This portfolio: a responsive Vue and TypeScript website, with two languages, accessible navigation and a contact form.",
              all: "More experiments on GitHub",
              about: "One person. A direct conversation.",
              aboutBody:
                  "I’m Elias, an independent developer based in Brazil. I work on interfaces, APIs and databases, connecting what people see with what happens behind the scenes.",
              aboutSecond:
                  "You speak directly with the person building your project. My approach is to make decisions understandable and keep the work aligned with your needs.",
              stack: "Tools I work with",
              email: "Prefer email?",
              privacy:
                  "Your name, email and message are sent through FormSubmit to answer your enquiry. Please do not include passwords or sensitive information.",
              footer: "Web development with care and clarity.",
              subject: "New enquiry from portfolio",
              preview: "Actual screenshot of VeyraScreen",
              website: "The website you are viewing",
              process: "How we work",
          }
        : {
              role: "Desenvolvedor web independente",
              available: "Vamos conversar sobre seu projeto",
              cta: "Conversar sobre meu projeto",
              work: "Conhecer meu trabalho",
              note: "Escopo claro. Contato direto. Cuidado na entrega.",
              journey: "Um caminho claro desde a primeira conversa.",
              steps: [
                  [
                      "Entendemos seu objetivo",
                      "Conversamos sobre sua ideia, seu público e o que o projeto precisa resolver.",
                  ],
                  [
                      "Combinamos os próximos passos",
                      "Escopo, entregas, prazo e valor ficam definidos na proposta.",
                  ],
                  [
                      "Você acompanha a evolução",
                      "Revisamos o trabalho juntos e alinhamos os ajustes ao longo do caminho.",
                  ],
              ],
              selected: "Trabalho que você pode conhecer.",
              workIntro:
                  "Projetos autorais que mostram como transformo uma ideia em software. Conheça o código e as decisões por trás de cada um.",
              personal: "Projeto autoral",
              veyra: "Sua tela compartilhada, direto no navegador.",
              veyraDesc:
                  "Uma aplicação web em que o apresentador cria uma sala e compartilha um link. Os espectadores recebem áudio e vídeo em tempo real por WebRTC.",
              veyraDetail:
                  "Gerenciamento de salas, comunicação em tempo real e interfaces construídas com Blazor e .NET.",
              code: "Conhecer o código",
              demo: "Abrir aplicação",
              portfolio: "Um espaço claro para o meu trabalho.",
              portfolioDesc:
                  "Este portfólio: um site responsivo em Vue e TypeScript, com dois idiomas, navegação acessível e formulário de contato.",
              all: "Mais experimentos no GitHub",
              about: "Uma pessoa. Uma conversa direta.",
              aboutBody:
                  "Sou Elias, desenvolvedor independente no Brasil. Trabalho com interfaces, APIs e bancos de dados, conectando o que as pessoas veem ao que acontece por trás da tela.",
              aboutSecond:
                  "Você conversa com quem desenvolve seu projeto. Minha proposta é tornar as decisões compreensíveis e manter o trabalho alinhado ao que você precisa.",
              stack: "Ferramentas com que trabalho",
              email: "Prefere enviar um e-mail?",
              privacy:
                  "Seu nome, e-mail e mensagem são enviados pelo FormSubmit para responder ao seu contato. Não inclua senhas ou informações sensíveis.",
              footer: "Desenvolvimento web com cuidado e clareza.",
              subject: "Novo contato pelo portfólio",
              preview: "Captura real da aplicação VeyraScreen",
              website: "O site que você está visitando",
              process: "Como funciona",
          },
);
const setLanguage = (value: "pt" | "en") => {
    language.value = value;
    document.documentElement.lang = value === "pt" ? "pt-BR" : "en";
    try {
        localStorage.setItem("portfolio-language", value);
    } catch {
        /* Storage is optional. */
    }
    if (languageMenu.value) languageMenu.value.open = false;
};
const closeMenu = () => {
    menuOpen.value = false;
};
const submitContact = async (event: Event) => {
    if (contactStatus.value === "submitting") return;
    const form = event.currentTarget as HTMLFormElement;
    const key = "portfolio-contact-submissions";
    const now = Date.now();
    let submissions: number[] = [];
    try {
        const stored = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(stored))
            submissions = stored.filter(
                (t: unknown): t is number => typeof t === "number" && t > now - 3600000,
            );
    } catch {
        /* Storage is optional. */
    }
    if (submissions.length >= 3 || submissions.some((t) => now - t < 60000)) {
        contactStatus.value = "rate-limited";
        return;
    }
    contactStatus.value = "submitting";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetch("https://formsubmit.co/ajax/eliaspessoal06@gmail.com", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
            signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || ![true, "true"].includes(result.success))
            throw new Error("Delivery rejected");
        try {
            localStorage.setItem(key, JSON.stringify([...submissions, now]));
        } catch {
            /* Sending succeeded independently of storage. */
        }
        form.reset();
        contactStatus.value = "success";
    } catch {
        contactStatus.value = "error";
    } finally {
        clearTimeout(timeout);
    }
};
onMounted(() => {
    let saved: string | null = null;
    try {
        saved = localStorage.getItem("portfolio-language");
    } catch {
        /* Use browser language. */
    }
    setLanguage(
        saved === "pt" || saved === "en"
            ? saved
            : navigator.language.startsWith("en")
              ? "en"
              : "pt",
    );
});
</script>

<template>
    <div :class="['portfolio-app', { 'motion-paused': motionPaused }]">
        <div class="cursor-trail" aria-hidden="true"><span></span></div>
        <div class="scroll-progress" aria-hidden="true"></div>
        <a class="skip-link" href="#conteudo">{{ copy.skip }}</a>
        <header class="topbar">
            <a class="brand" href="#inicio" :aria-label="copy.homeLabel"
                ><strong>EA</strong><span class="brand-divider"></span
                ><span
                    >{{ en ? "WEB DEVELOPER" : "DESENVOLVEDOR WEB"
                    }}<small
                        ><i></i>{{ en ? "Open to new projects" : "Aberto a novos projetos" }}</small
                    ></span
                ></a
            >
            <div class="topbar-right">
                <nav :aria-label="copy.navLabel" class="pill-nav">
                    <a
                        href="#inicio"
                        :aria-current="activeSection === 'inicio' ? 'location' : undefined"
                        >Home</a
                    ><a
                        href="#sobre"
                        :aria-current="activeSection === 'sobre' ? 'location' : undefined"
                        >{{ en ? "About" : "Sobre" }}</a
                    ><a
                        href="#projeto"
                        :aria-current="activeSection === 'projeto' ? 'location' : undefined"
                        >{{ en ? "Projects" : "Projetos" }}</a
                    >
                    <details ref="navMore" class="nav-more">
                        <summary>{{ en ? "More" : "Mais" }}<ChevronDown :size="12" /></summary>
                        <div class="nav-dropdown">
                            <a href="#tech-stack" @click="navMore && (navMore.open = false)"
                                >Stack & skills</a
                            ><a href="#github-heading" @click="navMore && (navMore.open = false)"
                                >GitHub Activity</a
                            ><a href="#servicos" @click="navMore && (navMore.open = false)">{{
                                en ? "Services" : "Serviços"
                            }}</a>
                        </div>
                    </details>
                    <a href="#contato" class="nav-contact">{{
                        en ? "Let’s talk" : "Vamos conversar"
                    }}</a>
                </nav>
                <div class="top-controls">
                    <button
                        class="theme-toggle"
                        @click="toggleTheme"
                        :aria-label="
                            en
                                ? theme === 'dark'
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                                : theme === 'dark'
                                  ? 'Ativar modo claro'
                                  : 'Ativar modo escuro'
                        "
                    >
                        <Sun v-if="theme === 'dark'" :size="17" /><Moon v-else :size="17" />
                    </button>
                    <details ref="languageMenu" class="language-switcher">
                        <summary>{{ en ? "EN" : "PT" }}<ChevronDown :size="11" /></summary>
                        <div class="language-options">
                            <button @click="setLanguage('pt')" :aria-pressed="!en">Português</button
                            ><button @click="setLanguage('en')" :aria-pressed="en">English</button>
                        </div>
                    </details>
                </div>
            </div>
        </header>
        <main id="conteudo">
            <section id="inicio" class="hero">
                <div class="hero-lights" aria-hidden="true"><i></i><i></i><i></i></div>
                <div class="hero-content">
                    <span class="hero-badge"
                        ><Sparkles :size="16" />{{
                            en ? "Ready to build your next idea" : "Pronto para sua próxima ideia"
                        }}</span
                    >
                    <p class="hero-name">
                        {{ en ? "Hi, I’m Elias Arruda" : "Olá, eu sou Elias Arruda" }}
                    </p>
                    <h1>
                        {{ en ? "Full Stack" : "Desenvolvedor" }}<br /><span>{{
                            en ? "Developer" : "Full Stack"
                        }}</span>
                    </h1>
                    <div class="typing-line">
                        <span class="sr-only">{{ typingPhrase }}</span
                        ><span aria-hidden="true">{{ typed }}<i></i></span>
                    </div>
                    <p class="hero-description">
                        {{
                            en
                                ? "Web experiences built with thoughtful interfaces, solid foundations and attention to every detail."
                                : "Experiências web com interfaces bem cuidadas, uma base sólida e atenção em cada detalhe."
                        }}
                    </p>
                    <div class="hero-tags">
                        <span>Vue</span><span>TypeScript</span><span>.NET</span
                        ><span>PostgreSQL</span>
                    </div>
                    <div class="hero-actions">
                        <a href="#projeto" class="button"
                            >{{ en ? "Projects" : "Projetos" }}<ArrowUpRight :size="17" /></a
                        ><a href="#contato" class="button button-secondary"
                            >{{ en ? "Contact" : "Contato" }}<Mail :size="17"
                        /></a>
                    </div>
                    <div class="hero-socials">
                        <a
                            href="https://github.com/EliasArruda"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            ><svg viewBox="0 0 24 24"><path :d="siGithub.path" /></svg></a
                        ><a href="mailto:eliaspessoal06@gmail.com" aria-label="E-mail"
                            ><Mail :size="20" /></a
                        ><a
                            href="#tech-stack"
                            :aria-label="en ? 'My technologies' : 'Minhas tecnologias'"
                            ><Code2 :size="20"
                        /></a>
                    </div>
                </div>
                <div class="hero-bottom">
                    <span
                        ><MapPin :size="14" />{{
                            en
                                ? "Based in Brazil · Working remotely"
                                : "Brasil · Atendimento remoto"
                        }}</span
                    ><a href="#sobre">{{ en ? "Explore" : "Explore" }}<ArrowRight :size="15" /></a>
                </div>
            </section>
            <div class="content-shell">
                <section id="sobre" class="me-section">
                    <div class="section-inner">
                        <div class="section-line">
                            <div>
                                <p class="section-kicker">{{ en ? "About" : "Sobre" }}</p>
                                <h2>Me<span>.</span></h2>
                            </div>
                            <span class="small-note">{{
                                en ? "The person behind the code" : "A pessoa por trás do código"
                            }}</span>
                        </div>
                        <div class="me-grid">
                            <div class="me-monogram" aria-hidden="true">
                                <span>elias<br />arruda<span class="accent">.</span></span
                                ><Code2 :size="28" /><small>INDEPENDENT DEVELOPER</small>
                            </div>
                            <div class="me-copy">
                                <h3>Elias Arruda</h3>
                                <p>{{ extra.aboutBody }}</p>
                                <p>{{ extra.aboutSecond }}</p>
                                <p class="muted">
                                    {{
                                        en
                                            ? "From the first idea to deployment: websites, landing pages and custom applications."
                                            : "Da primeira ideia à publicação: sites, landing pages e aplicações sob medida."
                                    }}
                                </p>
                                <p class="skills-label">Skills</p>
                                <div class="inline-skills">
                                    <span v-for="tech in techs" :key="tech.slug" :title="tech.title"
                                        ><svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path :d="tech.path" /></svg
                                        ><span class="sr-only">{{ tech.title }}</span></span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <GithubActivity :en="en" />
                <section id="tech-stack" class="stack-section">
                    <div class="section-inner">
                        <p class="section-kicker">
                            {{ en ? "MY SKILLSET" : "MINHAS TECNOLOGIAS" }}
                        </p>
                        <h2>
                            {{ en ? "The magic" : "O que faz" }}
                            <span>{{ en ? "behind." : "acontecer." }}</span>
                        </h2>
                        <SkillOrb :paused="motionPaused" />
                        <div class="stack-chips">
                            <span v-for="tech in techs" :key="tech.slug"
                                ><svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path :d="tech.path" /></svg
                                >{{ tech.title }}</span
                            ><span><Code2 :size="18" />HTML & CSS</span
                            ><span><Radio :size="18" />WebRTC</span
                            ><span><Server :size="18" />APIs REST</span>
                        </div>
                        <p class="stack-caption">
                            {{
                                en
                                    ? "Interfaces, services and data. Connected."
                                    : "Interfaces, serviços e dados. Conectados."
                            }}
                        </p>
                        <button
                            class="motion-toggle"
                            @click="motionPaused = !motionPaused"
                            :aria-pressed="motionPaused"
                        >
                            <Play v-if="motionPaused" :size="14" /><Pause v-else :size="14" />{{
                                en
                                    ? motionPaused
                                        ? "Resume animations"
                                        : "Pause animations"
                                    : motionPaused
                                      ? "Retomar animações"
                                      : "Pausar animações"
                            }}
                        </button>
                    </div>
                </section>
                <section id="projeto" class="projects-section">
                    <div class="section-inner">
                        <div class="section-line">
                            <div>
                                <p class="section-kicker">
                                    {{ en ? "SELECTED WORK" : "TRABALHOS SELECIONADOS" }}
                                </p>
                                <h2>{{ en ? "Built by me" : "Feito por mim" }}<span>.</span></h2>
                            </div>
                            <a
                                href="https://github.com/EliasArruda?tab=repositories"
                                target="_blank"
                                rel="noopener noreferrer"
                                >GitHub<ArrowUpRight :size="16"
                            /></a>
                        </div>
                        <div class="projects-grid">
                            <article class="project">
                                <a
                                    class="project-image"
                                    href="https://veyrascreen.onrender.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :aria-label="extra.demo"
                                    ><img
                                        src="/veyra-preview.jpg"
                                        :alt="extra.preview"
                                        width="1440"
                                        height="1000"
                                        loading="eager" /><span><ArrowUpRight :size="23" /></span
                                ></a>
                                <h3>VeyraScreen</h3>
                                <p>{{ extra.veyraDesc }}</p>
                                <div class="small-tags">
                                    <span>Blazor</span><span>.NET</span><span>WebRTC</span>
                                </div>
                                <a
                                    class="text-link"
                                    href="https://github.com/EliasArruda/VeyraScreen"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    ><Code2 :size="16" />{{ extra.code }}<ArrowUpRight :size="14"
                                /></a>
                            </article>
                            <article class="project">
                                <a
                                    class="project-image portfolio-preview"
                                    href="https://github.com/EliasArruda/EliasArruda.github.io"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :aria-label="
                                        en ? 'Portfolio source code' : 'Código do portfólio'
                                    "
                                    ><small>EA / PORTFOLIO</small
                                    ><strong>Ideas into<br /><em>experiences.</em></strong
                                    ><span><ArrowUpRight :size="23" /></span
                                ></a>
                                <h3>{{ en ? "Personal portfolio" : "Portfólio pessoal" }}</h3>
                                <p>{{ extra.portfolioDesc }}</p>
                                <div class="small-tags">
                                    <span>Vue</span><span>TypeScript</span><span>CSS</span>
                                </div>
                                <a
                                    class="text-link"
                                    href="https://github.com/EliasArruda/EliasArruda.github.io"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    ><Code2 :size="16" />{{ extra.code }}<ArrowUpRight :size="14"
                                /></a>
                            </article>
                        </div>
                    </div>
                </section>
                <section id="servicos" class="services-section">
                    <div class="section-inner">
                        <div class="section-line">
                            <h2>{{ en ? "Let’s build" : "Vamos construir" }}<span>.</span></h2>
                        </div>
                        <div class="services-grid">
                            <article v-for="(service, index) in copy.services" :key="service.title">
                                <component
                                    :is="[Globe2, PanelsTopLeft, AppWindow][index]"
                                    :size="25"
                                />
                                <h3>{{ service.title }}</h3>
                                <p>{{ service.description }}</p>
                            </article>
                        </div>
                    </div>
                </section>
                <section id="contato" class="contact-section">
                    <div class="section-inner">
                        <div class="section-line">
                            <div>
                                <p class="section-kicker">
                                    {{ en ? "HAVE SOMETHING IN MIND?" : "TEM UMA IDEIA EM MENTE?" }}
                                </p>
                                <h2>{{ en ? "Let’s talk" : "Vamos conversar" }}<span>.</span></h2>
                            </div>
                        </div>
                        <div class="contact-grid">
                            <div>
                                <h3>
                                    {{ en ? "A direct conversation." : "Uma conversa direta." }}
                                </h3>
                                <p>
                                    {{
                                        en
                                            ? "Tell me what you want to build. We will define the scope, timeline and next steps together."
                                            : "Me conte o que você quer construir. Definimos juntos o escopo, o prazo e os próximos passos."
                                    }}
                                </p>
                                <a class="email-link" href="mailto:eliaspessoal06@gmail.com"
                                    ><Mail :size="17" />eliaspessoal06@gmail.com<ArrowUpRight
                                        :size="15"
                                /></a>
                            </div>
                            <form class="contact-form" @submit.prevent="submitContact">
                                <div class="form-field">
                                    <label for="contact-name">{{ copy.name }}</label
                                    ><input
                                        id="contact-name"
                                        name="name"
                                        :placeholder="copy.namePlaceholder"
                                        autocomplete="name"
                                        maxlength="120"
                                        required
                                    />
                                </div>
                                <div class="form-field">
                                    <label for="contact-email">{{ copy.email }}</label
                                    ><input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        :placeholder="copy.emailPlaceholder"
                                        autocomplete="email"
                                        maxlength="254"
                                        required
                                    />
                                </div>
                                <div class="form-field form-message">
                                    <label for="contact-message">{{ copy.message }}</label
                                    ><textarea
                                        id="contact-message"
                                        name="message"
                                        :placeholder="copy.messagePlaceholder"
                                        rows="4"
                                        maxlength="5000"
                                        required
                                    ></textarea>
                                </div>
                                <input
                                    class="form-honeypot"
                                    name="_honey"
                                    tabindex="-1"
                                    autocomplete="off"
                                    aria-hidden="true"
                                /><input type="hidden" name="_subject" :value="extra.subject" />
                                <p class="privacy-note">{{ extra.privacy }}</p>
                                <button
                                    class="button button-primary form-submit"
                                    :disabled="contactStatus === 'submitting'"
                                >
                                    <Mail :size="18" />{{
                                        contactStatus === "submitting"
                                            ? copy.sending
                                            : copy.sendEmail
                                    }}<ArrowUpRight :size="18" />
                                </button>
                                <p
                                    v-if="contactStatus === 'success'"
                                    class="form-status"
                                    role="status"
                                >
                                    {{ copy.sent }}
                                </p>
                                <p
                                    v-if="contactStatus === 'error'"
                                    class="form-status error"
                                    role="alert"
                                >
                                    {{ copy.sendError }}
                                    <a href="mailto:eliaspessoal06@gmail.com">{{ extra.email }}</a>
                                </p>
                                <p
                                    v-if="contactStatus === 'rate-limited'"
                                    class="form-status error"
                                    role="alert"
                                >
                                    {{ copy.rateLimited }}
                                </p>
                            </form>
                        </div>
                    </div>
                </section>
                <footer>
                    <span>© {{ new Date().getFullYear() }} Elias Arruda</span
                    ><a href="#inicio">{{ copy.backTop }} ↑</a>
                </footer>
            </div>
        </main>
    </div>
</template>
