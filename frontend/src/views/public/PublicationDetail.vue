<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader solid />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-12 lg:pb-16">
      <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <router-link to="/" class="hover:text-primary-600 transition-colors">Inicio</router-link>
        <span>/</span>
        <router-link to="/publicaciones" class="hover:text-primary-600 transition-colors">Publicaciones</router-link>
        <span>/</span>
        <span v-if="publication" class="text-gray-600 truncate">{{ publication.title }}</span>
      </nav>

      <div v-if="loading" class="text-center py-20">
        <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-else-if="publication">
        <div class="flex items-center gap-3 mb-4">
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full"
            :class="publication.type === 'article' ? 'bg-primary-50 text-primary-700' : 'bg-accent-50 text-accent-700'"
          >
            {{ publication.type === 'article' ? 'Artículo' : 'Noticia' }}
          </span>
          <span class="text-sm text-gray-400">{{ formatDate(publication.date) }}</span>
        </div>

        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{{ publication.title }}</h1>

        <p class="text-lg text-gray-600 mb-8 leading-relaxed">{{ publication.summary }}</p>

        <div v-if="publication.imageUrl" class="mb-8">
          <img :src="publication.imageUrl" :alt="publication.title" class="w-full rounded-2xl">
        </div>

        <div
          v-if="publication.content"
          class="prose prose-gray max-w-none"
          v-html="publication.content"
        ></div>

        <div v-if="publication.link" class="mt-8">
          <a
            :href="publication.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            Leer artículo completo
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-400 text-lg">Publicación no encontrada.</p>
        <router-link to="/publicaciones" class="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">Volver a publicaciones</router-link>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Publication } from "../../types";
import { publications as pubsApi } from "../../services/api";
import AppHeader from "../../components/layout/AppHeader.vue";
import AppFooter from "../../components/layout/AppFooter.vue";

const route = useRoute();
const publication = ref<Publication | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    publication.value = await pubsApi.getById(Number(route.params.id));
  } catch (err) {
    console.error("Error cargando publicación:", err);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>


