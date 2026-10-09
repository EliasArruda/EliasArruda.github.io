export type ProjectCategory = 'landing-page' | 'professional';
export type LocalizedText = { pt: string; en: string };
export type PortfolioProject = {
    id: string;
    title: LocalizedText;
    description: LocalizedText;
    category: ProjectCategory;
    projectType: 'demo' | 'client' | 'personal';
    segment?: LocalizedText;
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
    "id": "barbearia",
    "title": {
        "pt": "Barber & Co.",
        "en": "Barber & Co."
    },
    "segment": {
        "pt": "Barbearia",
        "en": "Barbershop"
    },
    "description": {
        "pt": "Barbearia contemporânea: serviços, galeria interativa e um ritual de agendamento.",
        "en": "Contemporary barbershop with services, an interactive gallery and a booking flow."
    },
    "category": "landing-page",
    "projectType": "demo",
    "image": "/images/projects/barbearia.webp",
    "imageAlt": {
        "pt": "Captura real da página Barber & Co.",
        "en": "Actual screenshot of Barber & Co."
    },
    "technologies": [
        "HTML",
        "CSS",
        "JavaScript"
    ],
    "liveUrl": "/demos/barbearia/",
    "embeddable": true
},
{
    "id": "advocacia",
    "title": {
        "pt": "Almeida & Associados",
        "en": "Almeida & Associados"
    },
    "segment": {
        "pt": "Advocacia",
        "en": "Law firm"
    },
    "description": {
        "pt": "Presença institucional com áreas de atuação, perguntas frequentes e contato demonstrativo.",
        "en": "An institutional experience with practice areas, FAQs and a demo contact form."
    },
    "category": "landing-page",
    "projectType": "demo",
    "image": "/images/projects/advocacia.webp",
    "imageAlt": {
        "pt": "Captura real da página Almeida & Associados",
        "en": "Actual screenshot of Almeida & Associados"
    },
    "technologies": [
        "HTML",
        "CSS",
        "JavaScript"
    ],
    "liveUrl": "/demos/advocacia/",
    "embeddable": true
},
{
    "id": "culinaria",
    "title": {
        "pt": "Sapore Cucina",
        "en": "Sapore Cucina"
    },
    "segment": {
        "pt": "Restaurante",
        "en": "Restaurant"
    },
    "description": {
        "pt": "Uma experiência à mesa, com cardápio filtrável, fotografia e reserva demonstrativa.",
        "en": "A dining experience with menu filters, photography and a demo reservation flow."
    },
    "category": "landing-page",
    "projectType": "demo",
    "image": "/images/projects/culinaria.webp",
    "imageAlt": {
        "pt": "Captura real da página Sapore Cucina",
        "en": "Actual screenshot of Sapore Cucina"
    },
    "technologies": [
        "HTML",
        "CSS",
        "JavaScript"
    ],
    "liveUrl": "/demos/culinaria/",
    "embeddable": true
},
{
    "id": "pet",
    "title": {
        "pt": "Paw & Care",
        "en": "Paw & Care"
    },
    "segment": {
        "pt": "Pet Shop",
        "en": "Pet shop"
    },
    "description": {
        "pt": "Cuidado e acolhimento em um site com serviços e agendamento em duas etapas.",
        "en": "A welcoming pet care website with services and a two-step appointment flow."
    },
    "category": "landing-page",
    "projectType": "demo",
    "image": "/images/projects/pet.webp",
    "imageAlt": {
        "pt": "Captura real da página Paw & Care",
        "en": "Actual screenshot of Paw & Care"
    },
    "technologies": [
        "HTML",
        "CSS",
        "JavaScript"
    ],
    "liveUrl": "/demos/pet/",
    "embeddable": true
},
    {
        id: 'voxen', title: { pt: 'Voxen', en: 'Voxen' },
        description: { pt: 'Player de música para Linux e Windows, com busca no YouTube e SoundCloud, biblioteca pessoal, playlists e equalizador.', en: 'A music player for Linux and Windows, with YouTube and SoundCloud search, a personal library, playlists and an equalizer.' },
        category: 'professional', projectType: 'personal', image: '/images/projects/voxen.webp',
        imageAlt: { pt: 'Captura do player de música Voxen, publicada no repositório do projeto', en: 'Screenshot of the Voxen music player from the project repository' },
        technologies: ['.NET', 'Blazor'], repositoryUrl: 'https://github.com/EliasArruda/Voxen'
    },
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
    }
];

// Only registered, explicitly embeddable local demos can enter the viewer.
export function previewUrl(project: PortfolioProject): string | undefined {
    if (project.category !== "landing-page" || !project.embeddable) return;
    const registered = projects.find(item => item.id === project.id);
    if (!registered || registered.category !== "landing-page" || !registered.embeddable || registered.liveUrl !== project.liveUrl || !/^\/demos\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(project.liveUrl ?? "")) return;
    return project.liveUrl;
}
