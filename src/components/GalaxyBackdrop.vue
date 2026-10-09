<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
defineProps<{ paused: boolean }>();
const root = ref<HTMLElement>();
const active = ref(false);
const visible = ref(!document.hidden);
const stars = Array.from({ length: 72 }, (_, i) => ({ left: `${(i * 37.17) % 100}%`, top: `${(i * 23.41) % 100}%`, '--size': `${i % 5 === 0 ? 3 : 1.5}px`, '--delay': `${-(i % 11)}s`, '--travel': `${10 + i % 18}px`, '--duration': `${3 + i % 4}s` }));
let observer: IntersectionObserver;
const visibility = () => { visible.value = !document.hidden; };
onMounted(() => { observer = new IntersectionObserver(([entry]) => { active.value = !!entry?.isIntersecting; }); if (root.value) observer.observe(root.value); document.addEventListener('visibilitychange', visibility); });
onUnmounted(() => { observer?.disconnect(); document.removeEventListener('visibilitychange', visibility); });
</script>
<template><div ref="root" class="galaxy-backdrop" :class="{ 'galaxy-paused': paused || !active || !visible }" aria-hidden="true"><div class="galaxy-nebula"></div><i v-for="(star, index) in stars" :key="index" :style="star"></i></div></template>
