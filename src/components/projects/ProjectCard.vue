<script setup lang="ts">
import { ArrowUpRight, Code2 } from '@lucide/vue';
import TechnologyIcons from './TechnologyIcons.vue';
import { previewUrl, type PortfolioProject } from '../../data/projects';
defineProps<{ project: PortfolioProject; language: 'pt' | 'en' }>();
defineEmits<{ explore: [project: PortfolioProject] }>();
</script>

<template>
    <article class="project">
        <component :is="previewUrl(project) ? 'button' : 'a'"
            class="project-image" :class="{ 'portfolio-preview': project.artwork === 'portfolio' }"
            :href="previewUrl(project) ? undefined : project.liveUrl || project.repositoryUrl"
            :type="previewUrl(project) ? 'button' : undefined"
            :target="previewUrl(project) ? undefined : '_blank'" rel="noopener noreferrer"
            :aria-label="`${language === 'pt' ? 'Explorar' : 'Explore'} ${project.title[language]}`"
            @click="previewUrl(project) && $emit('explore', project)">
            <img v-if="project.image" :src="project.image" :alt="project.imageAlt?.[language] || project.title[language]" width="1440" height="1000" loading="lazy" />
            <template v-else-if="project.artwork === 'portfolio'">
                <small>EA / PORTFOLIO</small><strong>Ideas into<br /><em>experiences.</em></strong>
            </template>
            <span><ArrowUpRight :size="23" /></span>
        </component>
        <div class="project-details">
        <div class="project-heading"><h3>{{ project.title[language] }}</h3><span v-if="project.segment" class="project-segment">{{ project.segment[language] }}</span></div>
        <p>{{ project.description[language] }}</p>
        <p v-if="project.category === 'landing-page'" class="project-type">{{ project.projectType === 'client' ? (language === 'pt' ? 'Projeto de cliente' : 'Client project') : (language === 'pt' ? 'Demonstração' : 'Demo') }}</p>
        <div class="project-footer"><TechnologyIcons :technologies="project.technologies" :language="language" />
        <div class="project-links">
            <button v-if="previewUrl(project)" class="text-link" type="button" @click="$emit('explore', project)">{{ language === 'pt' ? 'Explorar site' : 'Explore website' }}<ArrowUpRight :size="14" /></button>
            <a v-else-if="project.category === 'landing-page' && project.liveUrl" class="text-link" :href="project.liveUrl" target="_blank" rel="noopener noreferrer">{{ language === 'pt' ? 'Abrir site' : 'Open website' }}<ArrowUpRight :size="14" /></a>
            <a v-if="project.repositoryUrl" class="text-link" :href="project.repositoryUrl" target="_blank" rel="noopener noreferrer"><Code2 :size="16" />{{ language === 'pt' ? 'Conhecer o código' : 'Explore the code' }}<ArrowUpRight :size="14" /></a>
        </div></div>
        </div>
    </article>
</template>
