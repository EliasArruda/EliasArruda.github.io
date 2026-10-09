<script setup lang="ts">
import { computed } from "vue";
import data from "../data/github.json";
const props = defineProps<{ en: boolean }>();
const activeDays = computed(() => data.days.filter(day => day.count > 0).length);
const range = computed(() => { const format = (date: string) => new Intl.DateTimeFormat(props.en ? 'en' : 'pt-BR', {month:'short', year:'numeric', timeZone:'UTC'}).format(new Date(date + 'T12:00:00Z')); return `${format(data.days[0]!.date)} — ${format(data.days[data.days.length - 1]!.date)}`; });
const weeks = computed(() => {
    const result: (typeof data.days)[] = [];
    for (let i = 0; i < data.days.length; i += 7) result.push(data.days.slice(i, i + 7));
    return result;
});
const month = (index: number) => {
    const date = weeks.value[index]?.[0]?.date;
    if (!date) return "";
    const current = new Date(date + "T12:00:00Z");
    if (index === 0 && current.getUTCDate() > 7) return "";
    if (index > 0 && date.slice(0, 7) === weeks.value[index - 1]?.[0]?.date.slice(0, 7)) return "";
    return new Intl.DateTimeFormat(props.en ? "en" : "pt-BR", { month: "short", timeZone: "UTC" })
        .format(current)
        .replace(".", "");
};
const dayTitle = (day: (typeof data.days)[number]) =>
    `${day.date}: ${day.count} ${props.en ? "contributions" : "contribuições"}`;
</script>
<template>
    <section class="github-section" aria-labelledby="github-heading">
        <div class="section-inner">
            <div class="section-line">
                <h2 id="github-heading">GitHub Activity<span>.</span></h2>
                <a :href="data.source" target="_blank" rel="noopener noreferrer"
                    >@{{ data.user }} ↗</a
                >
            </div>
            <div class="contribution-panel">
                <div class="activity-overview"><div><strong>{{ data.total }}</strong><span>{{ en ? 'contributions' : 'contribuições' }}</span></div><div><strong>{{ activeDays }}</strong><span>{{ en ? 'active days' : 'dias ativos' }}</span></div><p>{{ range }}</p></div>
                <div
                    class="calendar-scroll"
                    tabindex="0"
                    :aria-label="
                        en
                            ? 'GitHub contribution calendar, scroll horizontally'
                            : 'Calendário de contribuições do GitHub, role horizontalmente'
                    "
                >
                    <div class="calendar">
                        <div v-for="(week, index) in weeks" :key="index" class="calendar-week">
                            <span class="month-label">{{ month(index) }}</span
                            ><span
                                v-for="day in week"
                                :key="day.date"
                                :class="['contribution-day', 'level-' + day.level]"
                                :title="dayTitle(day)"
                                :aria-label="dayTitle(day)"
                                ></span
                            >
                        </div>
                    </div>
                </div>
                <div class="calendar-caption">
                    <span
                        ><strong>{{ data.total }}</strong>
                        {{
                            en
                                ? "contributions in the displayed period"
                                : "contribuições no período exibido"
                        }}</span
                    >
                    <div class="legend">
                        <span>{{ en ? "Less" : "Menos" }}</span
                        ><i v-for="level in 5" :key="level" :class="'level-' + (level - 1)"></i
                        ><span>{{ en ? "More" : "Mais" }}</span>
                    </div>
                </div>
                <p class="data-date">
                    {{ en ? "Updated" : "Atualizado" }}
                    {{
                        new Intl.DateTimeFormat(en ? "en" : "pt-BR", {
                            dateStyle: "medium",
                        }).format(new Date(data.updatedAt))
                    }}
                    · {{ en ? "Public GitHub data" : "Dados públicos do GitHub" }}
                </p>
            </div>
        </div>
    </section>
</template>
