<script setup lang="ts">
defineProps<{ language: 'pt' | 'en' }>();
</script>
<template>
    <svg class="language-icon" viewBox="0 0 28 20" aria-hidden="true">
        <template v-if="language === 'pt'"><rect width="28" height="20" rx="3" fill="#237a4b"/><path d="m14 3 10 7-10 7L4 10Z" fill="#f3d55b"/><circle cx="14" cy="10" r="4" fill="#244780"/><path d="M10.2 8.8a13 13 0 0 1 7.5 2.5" fill="none" stroke="#fff" stroke-width="1"/></template>
        <template v-else><rect width="28" height="20" rx="3" fill="#244780"/><path d="m2 2 24 16M26 2 2 18" stroke="#fff" stroke-width="4"/><path d="m2 2 24 16M26 2 2 18" stroke="#c34655" stroke-width="1.5"/><path d="M14 0v20M0 10h28" stroke="#fff" stroke-width="6"/><path d="M14 0v20M0 10h28" stroke="#c34655" stroke-width="3"/></template>
    </svg>
</template>
