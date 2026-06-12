<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" v-if="stats">
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-primary-600 mb-1">{{ stats.courses }}</div>
        <div class="text-sm text-gray-500">Cursos</div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-green-600 mb-1">{{ stats.enrollments }}</div>
        <div class="text-sm text-gray-500">Inscripciones</div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-accent-500 mb-1">{{ stats.completionRate }}%</div>
        <div class="text-sm text-gray-500">Tasa de finalización</div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-amber-600 mb-1">{{ stats.lessons }}</div>
        <div class="text-sm text-gray-500">Lecciones totales</div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-primary-600 mb-1">{{ stats.projects }}</div>
        <div class="text-sm text-gray-500">Proyectos</div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-accent-500 mb-1">{{ stats.team }}</div>
        <div class="text-sm text-gray-500">Miembros del equipo</div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-green-600 mb-1">{{ stats.publications }}</div>
        <div class="text-sm text-gray-500">Publicaciones</div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="text-3xl font-bold text-orange-600 mb-1">{{ stats.messages }}</div>
        <div class="text-sm text-gray-500">Mensajes recibidos</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Últimos mensajes</h3>
        <div v-if="recentMessages.length === 0" class="text-gray-400 text-sm py-4 text-center">
          No hay mensajes aún
        </div>
        <div v-for="msg in recentMessages" :key="msg.id" class="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm shrink-0">
            {{ msg.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 text-sm">{{ msg.name }}</span>
              <span v-if="!msg.read" class="w-2 h-2 bg-primary-600 rounded-full" />
            </div>
            <p class="text-xs text-gray-500">{{ msg.subject }}</p>
          </div>
          <span class="text-xs text-gray-400 shrink-0">{{ formatDate(msg.createdAt) }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Cursos con más inscripciones</h3>
        <div v-if="topCourses.length === 0" class="text-gray-400 text-sm py-4 text-center">
          No hay datos aún
        </div>
        <div v-for="(c, i) in topCourses" :key="c.id" class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
          <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">{{ i + 1 }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ c.title }}</p>
            <p class="text-xs text-gray-500">{{ (c as any)._count?.enrollments || 0 }} inscritos · {{ (c as any)._count?.lessons || 0 }} lecciones</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { contact, projects, teamMembers, publications, coursesApi } from "../../services/api";
import api from "../../services/api";
import type { ContactMessage, Course } from "../../types";

const stats = ref<{
  courses: number; enrollments: number; completionRate: number;
  lessons: number; projects: number; team: number;
  publications: number; messages: number;
} | null>(null);
const recentMessages = ref<ContactMessage[]>([]);
const topCourses = ref<Course[]>([]);

onMounted(async () => {
  try {
    const [proj, tm, pubs, msgs, allCourses, allEnrollments] = await Promise.all([
      projects.getAll(),
      teamMembers.getAll(),
      publications.getAll(),
      contact.getAll(),
      coursesApi.getAllAdmin(),
      api.get<any[]>("/admin/enrollments"),
    ]);

    const enrollments = allEnrollments.data;
    const completed = enrollments.filter((e: any) => e.completedAt);
    const totalLessons = allCourses.reduce((sum: number, c: any) => sum + (c._count?.lessons || 0), 0);

    stats.value = {
      courses: allCourses.length,
      enrollments: enrollments.length,
      completionRate: enrollments.length > 0 ? Math.round((completed.length / enrollments.length) * 100) : 0,
      lessons: totalLessons,
      projects: proj.length,
      team: tm.length,
      publications: pubs.length,
      messages: msgs.length,
    };

    recentMessages.value = msgs.slice(0, 5);
    topCourses.value = [...allCourses].sort((a: any, b: any) => (b._count?.enrollments || 0) - (a._count?.enrollments || 0)).slice(0, 5);
  } catch (err) {
    console.error(err);
  }
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
</script>
