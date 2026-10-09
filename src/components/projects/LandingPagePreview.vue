<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Monitor, Tablet, Smartphone, ExternalLink, X } from '@lucide/vue';
import { previewUrl, type PortfolioProject } from '../../data/projects';
const props = defineProps<{ project: PortfolioProject; language: 'pt' | 'en' }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
const frame = ref<HTMLIFrameElement>();
function frameMessage(event: MessageEvent) {
    if (event.source === frame.value?.contentWindow && event.data === "portfolio-preview:close") emit("close");
}
const mode = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
const loading = ref(true);
const timedOut = ref(false);
const url = computed(() => previewUrl(props.project));
const opener = document.activeElement as HTMLElement | null;
const overflow = document.body.style.overflow;
let timer: ReturnType<typeof setTimeout>;
function loaded() { loading.value = false; timedOut.value = false; clearTimeout(timer); }
onMounted(() => {
    if (!url.value) { emit('close'); return; }
    document.body.style.overflow = 'hidden';
    window.addEventListener('message', frameMessage);
    dialog.value?.showModal();
    timer = setTimeout(() => { timedOut.value = true; loading.value = false; }, 15000);
});
onUnmounted(() => {
    clearTimeout(timer);
    window.removeEventListener('message', frameMessage);
    dialog.value?.close();
    document.body.style.overflow = overflow;
    opener?.focus({ preventScroll: true });
});
// The sandbox has an opaque origin: scripts cannot access the portfolio's DOM/storage.
// Escape inside a sandboxed frame cannot bubble to the parent; keep an explicit exit reachable.
</script>
<template>
    <Teleport to="body">
        <dialog ref="dialog" class="landing-preview" aria-labelledby="preview-title" @cancel.prevent="emit('close')" @click="($event.target === dialog) && emit('close')">
            <header class="preview-header">
                <h2 id="preview-title">{{ project.title[language] }}</h2>
                <div class="preview-devices" role="group" :aria-label="language === 'pt' ? 'Resolução da prévia' : 'Preview resolution'">
                    <button v-for="device in (['desktop', 'tablet', 'mobile'] as const)" :key="device" type="button" :aria-pressed="mode === device" :aria-label="device === 'mobile' ? (language === 'pt' ? 'Celular' : 'Mobile') : device === 'tablet' ? 'Tablet' : 'Desktop'" @click="mode = device"><component :is="device === 'desktop' ? Monitor : device === 'tablet' ? Tablet : Smartphone" :size="18" /><span>{{ device === 'mobile' ? (language === 'pt' ? 'Celular' : 'Mobile') : device === 'tablet' ? 'Tablet' : 'Desktop' }}</span></button>
                </div>
                <a :href="url" target="_blank" rel="noopener noreferrer" class="preview-external"><ExternalLink :size="18" /><span>{{ language === 'pt' ? 'Abrir em nova aba' : 'Open in new tab' }}</span></a>
                <button type="button" class="preview-close" autofocus :aria-label="language === 'pt' ? 'Fechar prévia' : 'Close preview'" @click="emit('close')"><X :size="20" /></button>
            </header>
            <p class="preview-address">{{ url }} <span>{{ mode === 'tablet' ? '768 px' : mode === 'mobile' ? '390 px' : language === 'pt' ? 'Largura disponível' : 'Available width' }}</span></p>
            <p v-if="loading" class="preview-status" role="status">{{ language === 'pt' ? 'Carregando site…' : 'Loading website…' }}</p>
            <p v-if="timedOut" class="preview-status" role="status">{{ language === 'pt' ? 'A prévia está demorando. Tente abrir em nova aba.' : 'The preview is taking longer. Try opening it in a new tab.' }}</p>
            <div class="preview-stage">
                <iframe ref="frame" v-if="url" :src="url" :title="project.title[language]" :style="{ width: mode === 'tablet' ? '768px' : mode === 'mobile' ? '390px' : '100%' }" sandbox="allow-scripts" referrerpolicy="no-referrer" @load="loaded" />
            </div>
        </dialog>
    </Teleport>
</template>
