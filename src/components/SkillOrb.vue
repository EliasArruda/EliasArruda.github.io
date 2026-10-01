<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
const props = defineProps<{ paused: boolean }>();
const canvas = ref<HTMLCanvasElement | null>(null);
let dispose = () => {};
let sync = () => {};
onMounted(() => {
    const el = canvas.value!;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
        visible = false,
        angle = 0.4,
        last = 0,
        size = 400;
    const point = (t: number, r: number) => ({
        x: Math.cos(t) * r,
        y: Math.sin(t) * r * 0.37,
        z: Math.sin(t),
    });
    const draw = () => {
        const light = document.documentElement.dataset.theme === "light";
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate(-0.24);
        const r = size * 0.19,
            orbit = size * 0.36;
        const halo = ctx.createRadialGradient(0, r, 0, 0, r, orbit);
        halo.addColorStop(0, light ? "#8265cf26" : "#7360eb30");
        halo.addColorStop(1, "#8265cf00");
        ctx.fillStyle = halo;
        ctx.fillRect(-size / 2, -size / 2, size, size);
        const ring = (start: number, end: number) => {
            ctx.beginPath();
            for (let i = 0; i <= 100; i++) {
                const t = start + ((end - start) * i) / 100,
                    p = point(t, orbit);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.lineWidth = 3;
            ctx.strokeStyle = light ? "#8370bb" : "#6251bb";
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = light ? "#b4a5d5" : "#a394e6";
            ctx.stroke();
        };
        const satellite = (t: number, scale: number) => {
            const p = point(t, orbit);
            const sr = size * scale;
            const g = ctx.createRadialGradient(p.x - sr * 0.4, p.y - sr * 0.5, 0, p.x, p.y, sr);
            g.addColorStop(0, "#fcfaff");
            g.addColorStop(0.32, "#c8b8f4");
            g.addColorStop(1, "#514071");
            ctx.beginPath();
            ctx.arc(p.x, p.y, sr, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        };
        ring(Math.PI, Math.PI * 2);
        for (let i = 0; i < 3; i++) {
            const t = angle + i * 2.094;
            if (Math.sin(t) < 0) satellite(t, i === 0 ? 0.028 : 0.015);
        }
        const body = ctx.createRadialGradient(-r * 0.42, -r * 0.6, r * 0.05, 0, 0, r);
        body.addColorStop(0, "#cfd0de");
        body.addColorStop(0.13, "#777786");
        body.addColorStop(0.32, "#252633");
        body.addColorStop(0.66, "#080910");
        body.addColorStop(0.89, "#151426");
        body.addColorStop(0.96, "#777089");
        body.addColorStop(1, "#28263d");
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = body;
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, r - 0.5, 0, Math.PI * 2);
        ctx.clip();
        for (let i = 0; i < 7; i++) {
            const t = angle * 0.5 + i * 0.9;
            ctx.save();
            ctx.rotate(t);
            ctx.beginPath();
            ctx.ellipse(-r * 0.28, -r * 0.24, r * 0.11, r * 0.78, t, 0, Math.PI * 2);
            ctx.strokeStyle = i % 2 ? "#d1caf012" : "#b6b3e624";
            ctx.lineWidth = r * 0.045;
            ctx.stroke();
            ctx.restore();
        }
        const sheen = ctx.createLinearGradient(-r, -r, r, r);
        sheen.addColorStop(0, "#ffffff66");
        sheen.addColorStop(0.25, "#ffffff00");
        sheen.addColorStop(0.8, "#968ce800");
        sheen.addColorStop(1, "#9a92e560");
        ctx.fillStyle = sheen;
        ctx.fillRect(-r, -r, r * 2, r * 2);
        ctx.restore();
        ring(0, Math.PI);
        for (let i = 0; i < 3; i++) {
            const t = angle + i * 2.094;
            if (Math.sin(t) >= 0) satellite(t, i === 0 ? 0.028 : 0.015);
        }
        ctx.restore();
        el.dataset.angle = angle.toFixed(3);
    };
    const tick = (now: number) => {
        frame = 0;
        angle += (last ? Math.min(now - last, 40) : 16) * 0.00032;
        last = now;
        draw();
        frame = requestAnimationFrame(tick);
    };
    sync = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        draw();
        if (visible && !props.paused && !reduced.matches && !document.hidden)
            frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver((entries) => {
        size = entries[0]?.contentRect.width || 400;
        const dpr = Math.min(devicePixelRatio, 2);
        el.width = Math.round(size * dpr);
        el.height = Math.round(size * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sync();
    });
    resize.observe(el);
    const intersection = new IntersectionObserver((entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
        sync();
    });
    intersection.observe(el);
    const theme = new MutationObserver(() => draw());
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    dispose = () => {
        cancelAnimationFrame(frame);
        resize.disconnect();
        intersection.disconnect();
        theme.disconnect();
        document.removeEventListener("visibilitychange", sync);
        reduced.removeEventListener("change", sync);
    };
});
watch(
    () => props.paused,
    () => sync(),
);
onUnmounted(() => dispose());
</script>
<template><canvas ref="canvas" class="skill-orb" aria-hidden="true"></canvas></template>
