import { onMounted, onUnmounted } from "vue";

export function usePortfolioMotion() {
    let cleanup = () => {};
    onMounted(() => {
        const reduced = matchMedia("(prefers-reduced-motion: reduce)");
        const fine = matchMedia("(hover: hover) and (pointer: fine)");
        const dots = Array.from(document.querySelectorAll<HTMLElement>(".cursor-trail span"));
        const progress = document.querySelector<HTMLElement>(".scroll-progress");
        const points = dots.map(() => ({ x: 0, y: 0 }));
        let target = { x: 0, y: 0 };
        let frame = 0;
        let started = false;
        let lastMove = 0;
        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            started = false;
            dots.forEach((dot) => {
                dot.style.opacity = "0";
            });
        };
        const render = (now: number) => {
            frame = 0;
            if (reduced.matches || !fine.matches || document.hidden || now - lastMove > 650) {
                stop();
                return;
            }
            let previous = target;
            points.forEach((point, index) => {
                point.x += (previous.x - point.x) * 0.32;
                point.y += (previous.y - point.y) * 0.32;
                dots[index]!.style.transform =
                    `translate3d(${point.x - 6}px, ${point.y - 6}px, 0) scale(${1 - index * 0.075})`;
                dots[index]!.style.opacity =
                    `${Math.max(0, 1 - (now - lastMove) / 650) * (1 - index * 0.08)}`;
                previous = point;
            });
            frame = requestAnimationFrame(render);
        };
        const move = (event: PointerEvent) => {
            if (reduced.matches || !fine.matches || event.pointerType !== "mouse") return;
            target = { x: event.clientX, y: event.clientY };
            if (!started) {
                points.forEach((point) => Object.assign(point, target));
                started = true;
            }
            lastMove = performance.now();
            if (!frame) frame = requestAnimationFrame(render);
        };
        const scroll = () => {
            const range = document.documentElement.scrollHeight - innerHeight;
            if (progress)
                progress.style.transform = `scaleY(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
        };
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("motion-entered");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 },
        );
        document
            .querySelectorAll(".overlap-title, .tech-group")
            .forEach((el) => observer.observe(el));
        const preference = () => {
            if (reduced.matches || !fine.matches) stop();
        };
        document.addEventListener("pointermove", move, { passive: true });
        document.addEventListener("pointerleave", stop);
        document.addEventListener("visibilitychange", stop);
        window.addEventListener("scroll", scroll, { passive: true });
        window.addEventListener("resize", scroll, { passive: true });
        reduced.addEventListener("change", preference);
        fine.addEventListener("change", preference);
        scroll();
        cleanup = () => {
            stop();
            observer.disconnect();
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerleave", stop);
            document.removeEventListener("visibilitychange", stop);
            window.removeEventListener("scroll", scroll);
            window.removeEventListener("resize", scroll);
            reduced.removeEventListener("change", preference);
            fine.removeEventListener("change", preference);
        };
    });
    onUnmounted(() => cleanup());
}
