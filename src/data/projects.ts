export type ProjectCategory = 'landing-page' | 'professional';
export type LocalizedText = { pt: string; en: string };
export type PortfolioProject = {
    id: string;
    title: LocalizedText;
    description: LocalizedText;
    category: ProjectCategory;
    projectType: 'demo' | 'client' | 'personal';
    image?: string;
    imageAlt?: LocalizedText;
    technologies: string[];
    liveUrl?: string;
    repositoryUrl?: string;
    embeddable?: boolean;
    artwork?: 'portfolio';
};

export const projects: PortfolioProject[] = [
    {
        "id": "veyrascreen",
        "title": {
            "pt": "VeyraScreen",
            "en": "VeyraScreen"
        },
        "description": {
            "pt": "Uma aplicação web em que o apresentador cria uma sala e compartilha um link. Os espectadores recebem áudio e vídeo em tempo real por WebRTC.",
            "en": "A web application where a presenter creates a room and shares a link. Viewers receive audio and video in real time through WebRTC."
        },
        "category": "professional",
        "projectType": "personal",
        "image": "/veyra-preview.jpg",
        "imageAlt": {
            "pt": "Captura real da aplicação VeyraScreen",
            "en": "Actual screenshot of VeyraScreen"
        },
        "technologies": [
            "Blazor",
            ".NET",
            "WebRTC"
        ],
        "liveUrl": "https://veyrascreen.onrender.com/",
        "repositoryUrl": "https://github.com/EliasArruda/VeyraScreen"
    },
    {
        "id": "portfolio",
        "title": {
            "pt": "Portfólio pessoal",
            "en": "Personal portfolio"
        },
        "description": {
            "pt": "Este portfólio: um site responsivo em Vue e TypeScript, com dois idiomas, navegação acessível e formulário de contato.",
            "en": "This portfolio: a responsive Vue and TypeScript website, with two languages, accessible navigation and a contact form."
        },
        "category": "professional",
        "projectType": "personal",
        "technologies": [
            "Vue",
            "TypeScript",
            "CSS"
        ],
        "repositoryUrl": "https://github.com/EliasArruda/EliasArruda.github.io",
        "artwork": "portfolio"
    }
];

// Only registered, explicitly embeddable local demos can enter the viewer.
export function previewUrl(project: PortfolioProject): string | undefined {
    if (project.category !== "landing-page" || !project.embeddable) return;
    const registered = projects.find(item => item.id === project.id);
    if (!registered || registered.category !== "landing-page" || !registered.embeddable || registered.liveUrl !== project.liveUrl || !/^\/demos\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(project.liveUrl ?? "")) return;
    return project.liveUrl;
}
