<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { usePortfolioMotion } from "./usePortfolioMotion";
usePortfolioMotion();
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
    <div class="cursor-trail" aria-hidden="true"><span v-for="dot in 10" :key="dot"></span></div>
    <div class="scroll-progress" aria-hidden="true"></div>
    <a class="skip-link" href="#conteudo">{{ copy.skip }}</a>
    <main id="conteudo">
        <section id="inicio" class="hero">
            <a
                class="repo-ribbon"
                href="https://github.com/EliasArruda"
                target="_blank"
                rel="noopener noreferrer"
                >✦ {{ en ? "Explore my GitHub" : "Meu GitHub" }}</a
            >
            <details ref="languageMenu" class="language-switcher">
                <summary>{{ en ? "EN" : "PT" }}<ChevronDown :size="13" /></summary>
                <div class="language-options">
                    <button @click="setLanguage('pt')" :aria-pressed="!en">Português</button
                    ><button @click="setLanguage('en')" :aria-pressed="en">English</button>
                </div>
            </details>
            <a class="float-link about-link" href="#sobre">{{ en ? "About Me" : "Sobre mim" }}</a>
            <div class="hero-center">
                <p>{{ en ? "Hi, I am" : "Olá, eu sou" }}</p>
                <h1>ELIAS ARRUDA</h1>
                <p>{{ en ? "Web Developer" : "Desenvolvedor Web" }}</p>
            </div>
            <a class="float-link tech-link" href="#tech-stack">Tech</a>
            <div class="socials">
                <a
                    href="https://github.com/EliasArruda"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    ><svg viewBox="0 0 24 24"><path :d="siGithub.path" /></svg></a
                ><a href="#projeto" :aria-label="en ? 'Projects' : 'Projetos'"
                    ><FolderOpen :size="30" /></a
                ><a href="#contato" :aria-label="en ? 'Contact' : 'Contato'"><Mail :size="30" /></a>
            </div>
        </section>
        <section id="sobre" class="split-section about-section">
            <h2 class="overlap-title">
                <span>{{ en ? "ABOUT" : "SOBRE" }}</span
                ><span>{{ en ? "ME" : "MIM" }}</span>
            </h2>
            <div class="about-content">
                <div class="bio">
                    <p>
                        {{
                            en
                                ? "Hi, I’m Elias Arruda, a web developer."
                                : "Olá, sou Elias Arruda, desenvolvedor web."
                        }}
                    </p>
                    <p>{{ extra.aboutBody }}</p>
                    <p>{{ extra.aboutSecond }}</p>
                </div>
                <div id="projeto" class="timeline-group">
                    <h3>{{ en ? "PROJECTS" : "PROJETOS" }}</h3>
                    <article class="timeline-entry">
                        <h4>VeyraScreen</h4>
                        <p class="entry-label">.NET · BLAZOR · WEBRTC</p>
                        <p>{{ extra.veyraDesc }}</p>
                        <div class="entry-links">
                            <a
                                href="https://veyrascreen.onrender.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                >{{ en ? "Open application" : "Ver aplicação"
                                }}<ArrowUpRight :size="16" /></a
                            ><a
                                href="https://github.com/EliasArruda/VeyraScreen"
                                target="_blank"
                                rel="noopener noreferrer"
                                >{{ en ? "Source code" : "Código" }}<Code2 :size="16"
                            /></a>
                        </div>
                    </article>
                    <article class="timeline-entry">
                        <h4>{{ en ? "Personal portfolio" : "Portfólio pessoal" }}</h4>
                        <p class="entry-label">VUE · TYPESCRIPT</p>
                        <p>{{ extra.portfolioDesc }}</p>
                        <a
                            class="entry-links"
                            href="https://github.com/EliasArruda/EliasArruda.github.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            >{{ en ? "Explore the code" : "Conheça o código"
                            }}<ArrowUpRight :size="16"
                        /></a>
                    </article>
                </div>
                <div id="servicos" class="timeline-group">
                    <h3>{{ en ? "SERVICES" : "SERVIÇOS" }}</h3>
                    <article class="timeline-entry">
                        <h4>{{ en ? "Web development" : "Desenvolvimento web" }}</h4>
                        <p class="entry-label">
                            {{
                                en
                                    ? "WEBSITES · LANDING PAGES · APPLICATIONS"
                                    : "SITES · LANDING PAGES · APLICAÇÕES"
                            }}
                        </p>
                        <ul>
                            <li v-for="service in copy.services" :key="service.title">
                                {{ service.description }}
                            </li>
                        </ul>
                    </article>
                </div>
                <div class="timeline-group">
                    <h3>{{ en ? "HOW I WORK" : "COMO TRABALHO" }}</h3>
                    <article class="timeline-entry">
                        <h4>
                            {{
                                en
                                    ? "From the first conversation to delivery"
                                    : "Da primeira conversa à entrega"
                            }}
                        </h4>
                        <p class="entry-label">
                            {{
                                en
                                    ? "CLEAR SCOPE · DIRECT COMMUNICATION"
                                    : "ESCOPO CLARO · CONTATO DIRETO"
                            }}
                        </p>
                        <ul>
                            <li v-for="step in extra.steps" :key="step[0]">{{ step[1] }}</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>
        <section id="tech-stack" class="split-section tech-section">
            <div class="tech-content">
                <div class="tech-group">
                    <p>{{ en ? "Core Stack I Work With" : "Tecnologias com que trabalho" }}</p>
                    <div class="tech-icons">
                        <div
                            v-for="tech in techs.slice(0, 4)"
                            :key="tech.slug"
                            class="tech-icon"
                            tabindex="0"
                            :aria-label="tech.title"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="tech.path" /></svg
                            ><span class="tooltip">{{ tech.title }}</span>
                        </div>
                    </div>
                </div>
                <div class="tech-group">
                    <p>{{ en ? "Interfaces & styling" : "Interfaces e estilos" }}</p>
                    <div class="tech-icons">
                        <div class="tech-icon" tabindex="0" aria-label="Design responsivo">
                            <Smartphone /><span class="tooltip">{{
                                en ? "Responsive UI" : "Interface responsiva"
                            }}</span>
                        </div>
                        <div class="tech-icon" tabindex="0" aria-label="CSS">
                            <PanelsTopLeft /><span class="tooltip">CSS</span>
                        </div>
                        <div class="tech-icon" tabindex="0" aria-label="HTML">
                            <Code2 /><span class="tooltip">HTML</span>
                        </div>
                    </div>
                </div>
                <div class="tech-group">
                    <p>{{ en ? "Data & version control" : "Dados e versionamento" }}</p>
                    <div class="tech-icons">
                        <div
                            v-for="tech in techs.slice(4)"
                            :key="tech.slug"
                            class="tech-icon"
                            tabindex="0"
                            :aria-label="tech.title"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="tech.path" /></svg
                            ><span class="tooltip">{{ tech.title }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <h2 class="overlap-title"><span>TECH</span><span>SET</span></h2>
        </section>
        <section id="contato" class="contact-section">
            <details class="contact-disclosure">
                <summary>{{ en ? "Let’s talk" : "Vamos conversar" }}<Mail :size="25" /></summary>
                <div class="contact-inner">
                    <p>{{ en ? "Tell me about your project." : "Me conte sobre seu projeto." }}</p>
                    <a class="email-link" href="mailto:eliaspessoal06@gmail.com"
                        >eliaspessoal06@gmail.com<ArrowUpRight :size="17"
                    /></a>
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
                                contactStatus === "submitting" ? copy.sending : copy.sendEmail
                            }}<ArrowUpRight :size="18" />
                        </button>
                        <p v-if="contactStatus === 'success'" class="form-status" role="status">
                            {{ copy.sent }}
                        </p>
                        <p v-if="contactStatus === 'error'" class="form-status error" role="alert">
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
            </details>
        </section>
        <footer>
            <span>© {{ new Date().getFullYear() }} Elias Arruda</span
            ><a href="#inicio">{{ copy.backTop }} ↑</a>
        </footer>
    </main>
</template>
