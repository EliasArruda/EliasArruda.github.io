<script setup lang="ts">
import type { ProjectCategory } from '../../data/projects';
defineProps<{ modelValue: ProjectCategory; language: 'pt' | 'en' }>();
const emit = defineEmits<{ 'update:modelValue': [value: ProjectCategory] }>();
const categories: ProjectCategory[] = ['landing-page', 'professional'];
function navigate(event: KeyboardEvent, index: number) {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 1;
    else return;
    event.preventDefault();
    emit('update:modelValue', categories[next]!);
    (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
}
</script>
<template>
    <div class="project-tabs" role="tablist" :aria-label="language === 'pt' ? 'Categorias de projetos' : 'Project categories'">
        <button v-for="(category, index) in categories" :id="`tab-${category}`" :key="category" role="tab" type="button" :aria-selected="modelValue === category" :aria-controls="`panel-${category}`" :tabindex="modelValue === category ? 0 : -1" @click="emit('update:modelValue', category)" @keydown="navigate($event, index)">{{ category === 'landing-page' ? 'Landing Pages' : language === 'pt' ? 'Projetos Profissionais' : 'Professional Projects' }}</button>
    </div>
</template>
