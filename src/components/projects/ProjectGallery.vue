<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowUpRight } from '@lucide/vue';
import { projects, previewUrl, type ProjectCategory, type PortfolioProject } from '../../data/projects';
import ProjectTabs from './ProjectTabs.vue';
import ProjectCard from './ProjectCard.vue';
import LandingPagePreview from './LandingPagePreview.vue';
defineProps<{ language: 'pt' | 'en' }>();
const category = ref<ProjectCategory>('landing-page');
const selected = ref<PortfolioProject>();
const visible = computed(() => projects.filter(project => project.category === category.value));
function explore(project: PortfolioProject) { if (previewUrl(project)) selected.value = project; }
</script>
<template>
    <p class="projects-intro">{{ language === 'pt' ? 'Uma seleção de interfaces, experiências digitais e soluções que desenvolvi.' : 'A selection of interfaces, digital experiences and solutions I have built.' }}</p>
    <ProjectTabs v-model="category" :language="language" />
    <section v-for="panel in (['landing-page', 'professional'] as const)" v-show="category === panel" :id="`panel-${panel}`" :key="panel" role="tabpanel" :aria-labelledby="`tab-${panel}`" tabindex="0" class="project-panel">
        <template v-if="category === panel">
            <div v-if="visible.length" class="projects-grid"><ProjectCard v-for="project in visible" :key="project.id" :project="project" :language="language" @explore="explore" /></div>
            <div v-else class="projects-empty"><p>{{ language === 'pt' ? 'Novos projetos estão a caminho.' : 'New projects are on the way.' }}</p></div>
            <div v-if="panel === 'landing-page'" class="projects-cta">
                <div><h3>{{ language === 'pt' ? 'Gostou do que viu?' : 'Like what you see?' }}</h3><p>{{ language === 'pt' ? 'Posso desenvolver uma experiência semelhante para o seu negócio.' : 'I can build a similar experience for your business.' }}</p></div>
                <a class="text-link" href="#contato">{{ language === 'pt' ? 'Solicitar orçamento' : 'Request a quote' }}<ArrowUpRight :size="16" /></a>
            </div>
        </template>
    </section>
    <LandingPagePreview v-if="selected" :project="selected" :language="language" @close="selected = undefined" />
</template>
