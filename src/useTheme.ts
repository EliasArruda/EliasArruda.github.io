import { ref, onMounted, onUnmounted } from "vue";
export function useTheme() {
    const theme = ref<"light" | "dark">(
        document.documentElement.dataset.theme === "light" ? "light" : "dark",
    );
    let saved: string | null = null;
    try {
        saved = localStorage.getItem("portfolio-theme");
    } catch {
        /* Optional storage. */
    }
    const system = matchMedia("(prefers-color-scheme: dark)");
    const apply = (value: "light" | "dark") => {
        theme.value = value;
        document.documentElement.dataset.theme = value;
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", value === "dark" ? "#100e18" : "#f6f4fa");
    };
    const followSystem = () => {
        if (saved !== "dark" && saved !== "light") apply(system.matches ? "dark" : "light");
    };
    const toggleTheme = () => {
        const next = theme.value === "dark" ? "light" : "dark";
        saved = next;
        apply(next);
        try {
            localStorage.setItem("portfolio-theme", saved);
        } catch {
            /* Theme still works. */
        }
    };
    onMounted(() => {
        if (saved === "dark" || saved === "light") apply(saved);
        else followSystem();
        system.addEventListener("change", followSystem);
    });
    onUnmounted(() => system.removeEventListener("change", followSystem));
    return { theme, toggleTheme };
}
