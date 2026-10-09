<script setup lang="ts">
import { siHtml5, siCss, siJavascript, siVuedotjs, siTypescript, siDotnet, siBlazor } from 'simple-icons';
import { Code2, Radio } from '@lucide/vue';
defineProps<{ technologies: string[]; language: 'pt' | 'en' }>();
const icons: Record<string, { path: string; tone: string }> = {
    HTML: { path: siHtml5.path, tone: 'html' },
    CSS: { path: siCss.path, tone: 'css' },
    JavaScript: { path: siJavascript.path, tone: 'javascript' },
    Vue: { path: siVuedotjs.path, tone: 'vue' },
    TypeScript: { path: siTypescript.path, tone: 'typescript' },
    '.NET': { path: siDotnet.path, tone: 'dotnet' },
    Blazor: { path: siBlazor.path, tone: 'dotnet' },
};
</script>
<template>
    <ul class="project-technologies" :aria-label="language === 'pt' ? 'Tecnologias do projeto' : 'Project technologies'">
        <li v-for="technology in technologies" :key="technology" :title="technology" :class="icons[technology]?.tone || 'generic'">
            <svg v-if="icons[technology]" viewBox="0 0 24 24" aria-hidden="true"><path :d="icons[technology]!.path" /></svg>
            <Radio v-else-if="technology === 'WebRTC'" :size="19" aria-hidden="true" /><Code2 v-else :size="19" aria-hidden="true" />
            <span class="sr-only">{{ technology }}</span>
        </li>
    </ul>
</template>
