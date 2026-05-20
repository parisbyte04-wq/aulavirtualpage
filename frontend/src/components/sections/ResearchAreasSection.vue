<template>
  <section id="areas" class="py-20 lg:py-28 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Áreas de <span class='text-primary-600'>Investigación</span>"
        subtitle="Nuestras líneas de investigación abordan los desafíos más importantes de la sociedad actual."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="area in areas"
          :key="area.id"
          class="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all cursor-default"
        >
          <div class="w-14 h-14 bg-primary-50 group-hover:bg-primary-600 rounded-xl flex items-center justify-center mb-5 transition-colors">
            <component :is="getIcon(area.icon)" class="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-3">{{ area.title }}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">{{ area.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from "vue";
import type { ResearchArea } from "../../types";
import SectionTitle from "../ui/SectionTitle.vue";

defineProps<{
  areas: ResearchArea[];
}>();

const icons: Record<string, any> = {
  cpu: () =>
    h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 2, d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" }),
    ]),
  dna: () =>
    h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 2, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }),
    ]),
  zap: () =>
    h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }),
    ]),
  "bar-chart": () =>
    h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }),
    ]),
  flask: () =>
    h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 2, d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" }),
    ]),
};

function getIcon(name: string) {
  return icons[name] || icons.flask;
}
</script>
