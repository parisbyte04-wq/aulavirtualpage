<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <router-link to="/admin/courses" class="text-sm text-primary-600 hover:underline">&larr; Volver a cursos</router-link>
        <h2 class="text-2xl font-bold text-gray-900 mt-1">Lecciones del curso</h2>
      </div>
      <router-link :to="`/admin/courses/${courseId}/lessons/crear`" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nueva lección
      </router-link>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="lessons.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay lecciones creadas</div>
      <div
        v-for="(lesson, i) in lessons"
        :key="lesson.id"
        class="px-6 py-4 border-b border-gray-50 last:border-0 flex items-center justify-between hover:bg-gray-50 transition-all"
        :class="{ 'opacity-40 bg-gray-50': draggingId === lesson.id }"
        draggable="true"
        @dragstart="onDragStart(lesson.id, i)"
        @dragover.prevent="onDragOver(i)"
        @drop="onDrop(i)"
        @dragend="onDragEnd"
      >
        <div class="flex items-center gap-4 flex-1">
          <div class="flex items-center gap-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600" title="Arrastrar para reordenar">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
            <div class="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">{{ lesson.order }}</div>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">{{ lesson.title }}</h3>
            <p class="text-xs text-gray-400">{{ lesson.duration ? lesson.duration + ' min' : '' }} {{ lesson.videoUrl ? '• Video' : '' }}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <router-link :to="`/admin/courses/${courseId}/lessons/${lesson.id}`" class="text-primary-600 hover:text-primary-800 text-sm font-medium">Editar</router-link>
          <button @click="remove(lesson.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { lessonsApi } from "../../services/api";
import type { Lesson } from "../../types";

const route = useRoute();
const courseId = Number(route.params.courseId);
const lessons = ref<Lesson[]>([]);

const draggingId = ref<number | null>(null);
const dragIndex = ref(-1);

onMounted(load);

async function load() { lessons.value = await lessonsApi.adminGetByCourse(courseId); }

async function remove(id: number) {
  if (confirm("¿Eliminar esta lección?")) {
    await lessonsApi.adminDelete(id);
    await load();
  }
}

function onDragStart(id: number, index: number) {
  draggingId.value = id;
  dragIndex.value = index;
}

function onDragOver(index: number) {
  if (dragIndex.value === -1 || dragIndex.value === index) return;
  const item = lessons.value.splice(dragIndex.value, 1)[0];
  lessons.value.splice(index, 0, item);
  dragIndex.value = index;
}

async function onDrop(_index: number) {
  const updates = lessons.value.map((l, i) => ({ id: l.id, order: i + 1 }));
  for (const u of updates) {
    await lessonsApi.adminUpdate(u.id, { order: u.order } as any);
  }
  draggingId.value = null;
  dragIndex.value = -1;
  await load();
}

function onDragEnd() {
  draggingId.value = null;
  dragIndex.value = -1;
}
</script>
