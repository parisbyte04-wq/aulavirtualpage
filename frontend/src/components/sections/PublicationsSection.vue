<template>
  <section id="publicaciones" class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Publicaciones y <span class='text-primary-600'>Noticias</span>"
        subtitle="Mantente al día con nuestras últimas publicaciones y anuncios."
      />

      <div class="max-w-3xl mx-auto space-y-6">
        <div
          v-for="pub in latest"
          :key="pub.id"
          class="flex gap-4 p-6 rounded-xl border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all cursor-pointer"
          @click="$router.push(`/publicaciones/${pub.id}`)"
        >
          <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            :class="pub.type === 'article' ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'"
          >
            <svg v-if="pub.type === 'article'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                :class="pub.type === 'article' ? 'bg-primary-50 text-primary-700' : 'bg-accent-50 text-accent-700'"
              >
                {{ pub.type === 'article' ? 'Artículo' : 'Noticia' }}
              </span>
              <span class="text-xs text-gray-400">{{ formatDate(pub.date) }}</span>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">{{ pub.title }}</h3>
            <p class="text-sm text-gray-600">{{ pub.summary }}</p>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <router-link
          to="/publicaciones"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          Ver todas las publicaciones
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Publication } from "../../types";
import SectionTitle from "../ui/SectionTitle.vue";

const props = defineProps<{
  publications: Publication[];
}>();

const latest = computed(() => props.publications.slice(0, 2));

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>
